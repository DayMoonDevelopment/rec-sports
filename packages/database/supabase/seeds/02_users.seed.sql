-- Creates 10 synthetic test users with generated email addresses
-- Uses UUID generation, password encryption, and metadata creation
-- Ensures consistent user creation for testing purposes
-- Note: public.users records will be automatically created via trigger
INSERT INTO
    auth.users(
        instance_id,
        id,
        aud,
        ROLE,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )(
        SELECT
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ())::text || '@example.com',
            crypt('password', gen_salt('bf')),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '{"provider":"email","providers":["email"]}',
            CASE (ROW_NUMBER() OVER ())
                WHEN 1 THEN jsonb_build_object('first_name', 'Lightning', 'last_name', 'Bolt', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lightning')
                WHEN 2 THEN jsonb_build_object('first_name', 'Thunder', 'last_name', 'Strike', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=thunder')
                WHEN 3 THEN jsonb_build_object('first_name', 'Rocket', 'last_name', 'Slam', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rocket')
                WHEN 4 THEN jsonb_build_object('first_name', 'Ace', 'last_name', 'Shooter', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ace')
                WHEN 5 THEN jsonb_build_object('first_name', 'Blaze', 'last_name', 'Runner', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=blaze')
                WHEN 6 THEN jsonb_build_object('first_name', 'Storm', 'last_name', 'Chaser', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=storm')
                WHEN 7 THEN jsonb_build_object('first_name', 'Flash', 'last_name', 'Gordon', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=flash')
                WHEN 8 THEN jsonb_build_object('first_name', 'Spike', 'last_name', 'Master', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=spike')
                WHEN 9 THEN jsonb_build_object('first_name', 'Dash', 'last_name', 'Champion', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dash')
                WHEN 10 THEN jsonb_build_object('first_name', 'Turbo', 'last_name', 'Force', 'photo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=turbo')
            END,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 10)
    );

-- Block 2: Create User Email Identities
-- Generates corresponding email identities for the created test users
-- Links user IDs with email-based authentication identities
-- Ensures each user has a complete authentication profile
INSERT INTO
    auth.identities(
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )(
        SELECT
            uuid_generate_v4(),
            id,
            id,
            format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
            'email',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        FROM
            auth.users
    );
