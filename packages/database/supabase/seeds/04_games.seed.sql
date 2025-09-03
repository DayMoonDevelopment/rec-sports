-- 1 team game
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'disc_golf',
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
    (SELECT id FROM games LIMIT 1 OFFSET 0),
    get_team_id('Thunder Hawks'),
    0
);

-- 2 team game
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
    (SELECT id FROM games LIMIT 1 OFFSET 1),
    get_team_id('Thunder Hawks'),
    0
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 1),
    get_team_id('Rockets'),
    0
);

-- 1 team game
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'disc_golf',
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
    (SELECT id FROM games LIMIT 1 OFFSET 2),
    get_team_id('Thunder Hawks'),
    0
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 2),
    get_team_id('Rockets'),
    0
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 2),
    get_team_id('Booger Beans'),
    0
);
