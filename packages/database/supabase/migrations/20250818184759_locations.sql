-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id text PRIMARY KEY DEFAULT nanoid('loc'),
    name text NULL,
    street text NULL,
    city text NULL,
    county text NULL,
    state text NULL,
    country text NULL,
    postal_code text NULL,
    location gis.geography(POINT) NOT NULL,
    sport_tags text ARRAY,
    search_vector tsvector,
    created_at timestamp WITH TIME ZONE DEFAULT now(),
    updated_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (authenticated and anonymous users)
CREATE POLICY "locations_select_policy" ON locations FOR SELECT USING (true);

-- Create GIST index for geo-spatial queries (unchanged, renamed for clarity)
CREATE INDEX IF NOT EXISTS locations_geo_idx ON locations USING GIST (location);

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS locations_search_vector_idx ON locations USING GIN (search_vector);

-- Create GIN index for fuzzy text search on name (for text lookup and lookalikes)
CREATE INDEX IF NOT EXISTS locations_name_trgm_idx ON locations USING GIN (name gin_trgm_ops);

-- Create GIN index for sport_tags array (for facet filtering and lookalikes)
CREATE INDEX IF NOT EXISTS locations_sport_tags_gin_idx ON locations USING GIN (sport_tags);

-- Create function to update search vector with weighted fields
CREATE OR REPLACE FUNCTION update_location_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Update search vector with weighted text fields
  -- Weight A (highest): name, sport_tags (array elements), street
  -- Weight B (medium): city, county
  -- Weight C (lowest): state, country, postal_code
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.sport_tags, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.street, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.county, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.state, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.country, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.postal_code, '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector on insert/update
CREATE TRIGGER locations_search_vector_trigger
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_location_search_vector();

-- Update existing rows with search vectors
UPDATE locations SET updated_at = updated_at WHERE updated_at IS NOT NULL;
