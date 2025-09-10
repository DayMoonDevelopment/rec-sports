ALTER TABLE location_facilities
    DROP COLUMN sport_tags;

ALTER TABLE location_facilities
    ADD COLUMN sport text NOT NULL;

