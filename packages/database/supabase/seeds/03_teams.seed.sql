-- Create a test team
INSERT INTO teams (
    name,
    team_type,
    sport_tags
) VALUES (
    'Thunder Hawks',
    'team',
    ARRAY['basketball', 'tennis']
);

INSERT INTO team_members (
    team_id,
    user_id,
    role
) VALUES
(
    get_team_id('Thunder Hawks'),
    get_user_id('user1@example.com'),
    'captain'
),
(
    get_team_id('Thunder Hawks'),
    get_user_id('user2@example.com'),
    'player'
);

-- Create a team that can have a user added to it later
INSERT INTO teams (
    name,
    team_type,
    sport_tags
) VALUES (
    'Rockets',
    'individual',
    ARRAY['basketball', 'tennis']
);

INSERT INTO team_members (
    team_id,
    user_id,
    role
) VALUES
(
    get_team_id('Rockets'),
    get_user_id('user1@example.com'),
    'captain'
);

-- Create a test game with only team 1 (Thunder Hawks), leaving team 2 open
INSERT INTO games (
    team_1_id,
    team_2_id,
    sport,
    game_state,
    scheduled_at,
    location_id,
    team_1_score,
    team_2_score
) VALUES (
    get_team_id('Thunder Hawks'),
    get_team_id('Rockets'),
    'basketball',
    'scheduled',
    NOW(),
    NULL,
    0,
    0
);
