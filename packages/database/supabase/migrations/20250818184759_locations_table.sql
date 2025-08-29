-- Create locations table
CREATE TABLE IF NOT EXISTS locations(
    id text PRIMARY KEY DEFAULT nanoid('loc'),
    name text NULL,
    street text NULL,
    city text NULL,
    county text NULL,
    state text NULL,
    country text NULL,
    postal_code text NULL,
    sport_tags text ARRAY,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    details jsonb NULL
);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (authenticated and anonymous users)
CREATE POLICY "locations_select_policy" ON locations
    FOR SELECT
        USING (TRUE);

