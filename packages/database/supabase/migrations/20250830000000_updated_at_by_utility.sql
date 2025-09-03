-- Function to update updated_at timestamp and updated_by user
CREATE OR REPLACE FUNCTION update_updated_at_by_columns()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
