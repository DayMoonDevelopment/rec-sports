-- Add invite_code column to teams table with automatic generation
-- Following the same pattern as users table

-- Add invite_code column to teams table
ALTER TABLE teams
ADD COLUMN invite_code text NULL UNIQUE;

-- Generate invite code from the team ID, similar to users table
CREATE OR REPLACE FUNCTION public.generate_team_invite_code()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
    -- Only generate invite code if it's null (allows manual removal/regeneration)
    IF NEW.invite_code IS NULL THEN
        NEW.invite_code := upper(left(encode(sha256(NEW.id::bytea), 'hex'), 9));
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to generate invite code on team insert/update
CREATE TRIGGER generate_team_invite_code_trigger
    BEFORE INSERT OR UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_team_invite_code();

-- Update existing teams to have invite codes
UPDATE teams SET invite_code = NULL WHERE invite_code IS NULL;
