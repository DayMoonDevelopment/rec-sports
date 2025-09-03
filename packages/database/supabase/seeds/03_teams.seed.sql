-- Create a test team
INSERT INTO teams (
    name,
    team_type,
    sport_tags
) VALUES (
    'Thunder Hawks',
    'group',
    ARRAY['basketball', 'tennis']
);

INSERT INTO team_members (
    team_id,
    user_id
) VALUES
(
    get_team_id('Thunder Hawks'),
    get_user_id('user1@example.com')
),
(
    get_team_id('Thunder Hawks'),
    get_user_id('user2@example.com')
);

-- Create a team that can have a user added to it later
INSERT INTO teams (
    name,
    team_type,
    sport_tags
) VALUES (
    'Rockets',
    'group',
    ARRAY['basketball', 'tennis']
);

INSERT INTO team_members (
    team_id,
    user_id
) VALUES
(
    get_team_id('Rockets'),
    get_user_id('user1@example.com')
);

-- Create a test game
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'basketball',
    'upcoming',
    NOW(),
    NULL
);

-- Associate teams with the game via game_teams table
INSERT INTO game_teams (
    game_id,
    team_id,
    score
) VALUES
(
    (SELECT id FROM games LIMIT 1),
    get_team_id('Thunder Hawks'),
    0
),
(
(SELECT id FROM games LIMIT 1),
    get_team_id('Rockets'),
    0
);
