-- Update all locations with search_vector_meta for full-text search optimization
-- Note: This runs after 02_update-location-names.seed.sql to ensure proper names are indexed
UPDATE locations 
SET search_vector_meta = jsonb_build_object(
  'weights', (
    SELECT jsonb_agg(entry) 
    FROM jsonb_array_elements(jsonb_build_array(
      CASE WHEN name IS NOT NULL AND name != '' THEN
        jsonb_build_object('value', name, 'weight', 'A')
      END,
      CASE WHEN sport_tags IS NOT NULL AND array_length(sport_tags, 1) > 0 THEN
        jsonb_build_object('value', array_to_string(sport_tags, ' '), 'weight', 'A')
      END,
      CASE WHEN city IS NOT NULL AND city != '' THEN
        jsonb_build_object('value', city, 'weight', 'B')
      END,
      CASE WHEN state IS NOT NULL AND state != '' THEN
        jsonb_build_object('value', state, 'weight', 'C')
      END,
      CASE WHEN street IS NOT NULL AND street != '' THEN
        jsonb_build_object('value', street, 'weight', 'B')
      END,
      CASE WHEN county IS NOT NULL AND county != '' THEN
        jsonb_build_object('value', county, 'weight', 'B')
      END,
      CASE WHEN country IS NOT NULL AND country != '' THEN
        jsonb_build_object('value', country, 'weight', 'D')
      END,
      CASE WHEN postal_code IS NOT NULL AND postal_code != '' THEN
        jsonb_build_object('value', postal_code, 'weight', 'D')
      END
    )) AS entry
    WHERE entry IS NOT NULL
  )
)
WHERE search_vector_meta IS NULL;
