ALTER TABLE locations
    ADD COLUMN bounds jsonb NULL;

ALTER TABLE location_facilities
    ADD COLUMN bounds jsonb NULL;

