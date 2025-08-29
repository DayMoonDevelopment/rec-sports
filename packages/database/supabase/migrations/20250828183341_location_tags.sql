-- Create locations table
CREATE TABLE IF NOT EXISTS location_tags(
    id text PRIMARY KEY DEFAULT nanoid('lt'),
    location_id text NOT NULL REFERENCES locations ON DELETE CASCADE,
    name text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE location_tags ENABLE ROW LEVEL SECURITY;

ALTER TABLE location_tags
    ADD CONSTRAINT location_tag_name_value UNIQUE (location_id, name, value);

-- Allow read access to everyone (authenticated and anonymous users)
CREATE POLICY "location_tags_select_policy" ON location_tags
    FOR SELECT
        USING (TRUE);

