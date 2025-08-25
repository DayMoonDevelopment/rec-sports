-- Make location name nullable
alter table locations alter column name drop not null;

-- Add search vector column for full-text search
alter table locations add column search_vector tsvector;

-- Create GIN index for fast full-text search
create index locations_search_vector_idx on locations using gin(search_vector);

-- Create function to update search vector with weighted fields
create or replace function update_location_search_vector()
returns trigger as $$
begin
  -- Update search vector with weighted text fields
  -- Weight A (highest): name, sport_tags (array elements), street
  -- Weight B (medium): city, county  
  -- Weight C (lowest): state, country, postal_code
  new.search_vector := 
    setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.sport_tags, ' '), '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.street, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.county, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.state, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.country, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.postal_code, '')), 'C');
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update search vector on insert/update
create trigger locations_search_vector_trigger
  before insert or update on locations
  for each row execute function update_location_search_vector();

-- Update existing rows with search vectors
update locations set updated_at = updated_at;