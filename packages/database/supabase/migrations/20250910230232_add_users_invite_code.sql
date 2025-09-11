ALTER TABLE public.users
ADD COLUMN invite_code text null unique;

-- Generate invite code from the actual user ID
CREATE OR REPLACE FUNCTION public.generate_invite_code()
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

CREATE TRIGGER generate_invite_code_trigger
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_invite_code();
