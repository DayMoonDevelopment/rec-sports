-- Add geo column (renamed from location for clarity)
ALTER TABLE locations ADD COLUMN geo gis.geography(POINT) NOT NULL;

-- Create GIST index for geo-spatial queries
CREATE INDEX IF NOT EXISTS locations_geo_idx ON locations USING GIST (geo);
