create table public.users (
  id text primary key default nanoid('usr'),
  email text not null unique,
  first_name text null,
  last_name text null,
  photo text null,
  display_name text null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  auth_id uuid null unique references auth.users on delete cascade
);

-- Prevent updates to auth_id column for regular users, but allow service role
CREATE OR REPLACE FUNCTION public.prevent_auth_id_update()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
    -- Allow service role to update auth_id
    IF auth.role() = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Block auth_id updates for all other users (authenticated and anon)
    IF OLD.auth_id IS DISTINCT FROM NEW.auth_id THEN
        RAISE EXCEPTION 'Cannot update auth_id column';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_auth_id_update_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_auth_id_update();

-- Create a row level security policy on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Any authenticated user can read user profiles" ON public.users
    FOR SELECT TO authenticated
        USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE TO authenticated
        USING (auth_id = auth.uid())
        WITH CHECK (auth_id = auth.uid());

--
-- No user can update or insert a user record. public.users are automatically synced with auth.users
-- insert/update rows into public.users
CREATE FUNCTION public.handle_user_insert_trigger()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
VOLATILE
SET SEARCH_PATH = public, auth
AS $$
    BEGIN
        INSERT INTO public.users (
            auth_id,
            email,
            first_name,
            last_name,
            photo,
            display_name
        )
        VALUES (
            NEW.id,
            NEW.email,
            NEW.raw_user_meta_data ->> 'first_name',
            NEW.raw_user_meta_data ->> 'last_name',
            NEW.raw_user_meta_data ->> 'photo',
            CASE
                WHEN (NEW.raw_user_meta_data ->> 'first_name') IS NOT NULL
                     AND (NEW.raw_user_meta_data ->> 'last_name') IS NOT NULL
                THEN (NEW.raw_user_meta_data ->> 'first_name') || ' ' || (NEW.raw_user_meta_data ->> 'last_name')
                WHEN (NEW.raw_user_meta_data ->> 'first_name') IS NOT NULL
                THEN (NEW.raw_user_meta_data ->> 'first_name')
                WHEN (NEW.raw_user_meta_data ->> 'last_name') IS NOT NULL
                THEN (NEW.raw_user_meta_data ->> 'last_name')
                ELSE NULL
            END
        )
        ON CONFLICT (auth_id) DO UPDATE SET
            email = EXCLUDED.email,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            photo = EXCLUDED.photo,
            display_name = CASE
                WHEN public.users.display_name IS NULL THEN EXCLUDED.display_name
                ELSE public.users.display_name
            END,
            updated_at = now();

        RETURN NULL; -- No need to return NEW in AFTER triggers
    END;
$$;

CREATE TRIGGER on_auth_user_insert_or_update
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_insert_trigger();

-- Create public.uid() function to get the public user ID from the authenticated user
CREATE OR REPLACE FUNCTION public.uid()
RETURNS text
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid();
$$;
