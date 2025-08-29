-- Create locations table
CREATE TABLE IF NOT EXISTS location_facilities(
    id text PRIMARY KEY DEFAULT nanoid('fac'),
    location_id text NOT NULL REFERENCES locations ON DELETE CASCADE,
    lat double precision NOT NULL,
    lon double precision NOT NULL,
    geo gis.geography(point) NOT NULL,
    sport_tags text ARRAY,
    details jsonb NULL
);

-- Enable Row Level Security
ALTER TABLE location_facilities ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS location_facilities_geo_idx ON location_facilities USING GIST(geo);

CREATE INDEX IF NOT EXISTS location_facilities_location_idx ON location_facilities(location_id);

CREATE INDEX IF NOT EXISTS location_facilities_location_sports_idx ON location_facilities(location_id, sport_tags);

-- Allow read access to everyone (authenticated and anonymous users)
CREATE POLICY "location_facilities_select_policy" ON location_facilities
    FOR SELECT
        USING (TRUE);

CREATE INDEX IF NOT EXISTS location_facilities_sport_tags_gin_idx ON location_facilities USING GIN(sport_tags);

ALTER TABLE location_facilities
    ADD CONSTRAINT location_facility_lat_lon UNIQUE (location_id, lat, lon);

