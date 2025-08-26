-- Add search vector columns
ALTER TABLE locations ADD COLUMN search_vector tsvector;
ALTER TABLE locations ADD COLUMN search_vector_meta JSONB;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS locations_search_vector_idx ON locations USING GIN (search_vector);

-- Create GIN index for fuzzy text search on name
CREATE INDEX IF NOT EXISTS locations_name_trgm_idx ON locations USING GIN (name gin_trgm_ops);

-- Create GIN index for sport_tags array
CREATE INDEX IF NOT EXISTS locations_sport_tags_gin_idx ON locations USING GIN (sport_tags);

-- Function to build search vector from meta weights only
CREATE OR REPLACE FUNCTION update_location_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  weight_item JSONB;
  field_value TEXT;
  result_vector tsvector := ''::tsvector;
BEGIN
  -- Check if meta exists with weights array
  IF NEW.search_vector_meta IS NOT NULL AND
     NEW.search_vector_meta ? 'weights' AND
     jsonb_array_length(NEW.search_vector_meta->'weights') > 0 THEN

    -- Loop through weights and build vector
    FOR weight_item IN SELECT * FROM jsonb_array_elements(NEW.search_vector_meta->'weights')
    LOOP
      -- Add weighted vector if field has content
      IF field_value IS NOT NULL AND trim(field_value) != '' THEN
        result_vector := result_vector ||
          setweight(to_tsvector('english', field_value), (weight_item->>'weight')::char);
      END IF;
    END LOOP;

    NEW.search_vector := result_vector;
  ELSE
    -- Set to NULL if no meta or empty weights
    NEW.search_vector := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires only when search_vector_meta changes
CREATE TRIGGER locations_search_vector_trigger
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW
  WHEN (
    TG_OP = 'INSERT' OR
    OLD.search_vector_meta IS DISTINCT FROM NEW.search_vector_meta
  )
  EXECUTE FUNCTION update_location_search_vector();

-- Update existing rows with search vectors
UPDATE locations SET updated_at = updated_at WHERE updated_at IS NOT NULL;
