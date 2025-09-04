-- Upcoming game - 2 teams
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'basketball',
    'upcoming',
    NOW() + INTERVAL '2 hours',
    NULL
);

-- Associate teams with the upcoming game
INSERT INTO game_teams (
    game_id,
    team_id,
    score
) VALUES
(
    (SELECT id FROM games LIMIT 1 OFFSET 0),
    get_team_id('Thunder Hawks'),
    0
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 0),
    get_team_id('Rockets'),
    0
);

-- Live game - 3 teams
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'disc_golf',
    'in_progress',
    NOW() - INTERVAL '30 minutes',
    NULL
);

-- Associate teams with the live game
INSERT INTO game_teams (
    game_id,
    team_id,
    score
) VALUES
(
    (SELECT id FROM games LIMIT 1 OFFSET 1),
    get_team_id('Thunder Hawks'),
    15
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 1),
    get_team_id('Rockets'),
    12
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 1),
    get_team_id('Booger Beans'),
    8
);

-- Completed game - 2 teams
INSERT INTO games (
    sport,
    game_state,
    scheduled_at,
    location_id
) VALUES (
    'basketball',
    'completed',
    NOW() - INTERVAL '2 hours',
    NULL
);

-- Associate teams with the completed game
INSERT INTO game_teams (
    game_id,
    team_id,
    score
) VALUES
(
    (SELECT id FROM games LIMIT 1 OFFSET 2),
    get_team_id('Thunder Hawks'),
    95
),
(
    (SELECT id FROM games LIMIT 1 OFFSET 2),
    get_team_id('Rockets'),
    87
);

-- Game actions for the live game
INSERT INTO game_actions (
    game_id,
    type,
    point_value,
    details,
    occurred_at,
    occurred_by
) VALUES
-- Game start
(
    (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1),
    'GAME_START',
    NULL,
    '{"message": "Game started"}',
    NOW() - INTERVAL '30 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN game_teams gt ON tm.team_id = gt.team_id
     WHERE gt.game_id = (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1)
     LIMIT 1)
),
-- Some score actions for Thunder Hawks
(
    (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1),
    'SCORE',
    5,
    '{"description": "Team scored"}',
    NOW() - INTERVAL '25 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Thunder Hawks' LIMIT 1)
),
(
    (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1),
    'SCORE',
    3,
    '{"description": "Team scored"}',
    NOW() - INTERVAL '20 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Thunder Hawks' LIMIT 1)
),
-- Some score actions for Rockets
(
    (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1),
    'SCORE',
    4,
    '{"description": "Team scored"}',
    NOW() - INTERVAL '18 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Rockets' LIMIT 1)
),
-- Some score actions for Booger Beans
(
    (SELECT id FROM games WHERE game_state = 'in_progress' LIMIT 1),
    'SCORE',
    2,
    '{"description": "Team scored"}',
    NOW() - INTERVAL '15 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Booger Beans' LIMIT 1)
);

-- Game actions for the completed game
INSERT INTO game_actions (
    game_id,
    type,
    point_value,
    details,
    occurred_at,
    occurred_by
) VALUES
-- Game start
(
    (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1),
    'GAME_START',
    NULL,
    '{"message": "Game started"}',
    NOW() - INTERVAL '2 hours',
    (SELECT tm.id FROM team_members tm
     JOIN game_teams gt ON tm.team_id = gt.team_id
     WHERE gt.game_id = (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1)
     LIMIT 1)
),
-- Multiple score actions throughout the game
(
    (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1),
    'SCORE',
    25,
    '{"description": "Thunder Hawks scored"}',
    NOW() - INTERVAL '1 hour 30 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Thunder Hawks' LIMIT 1)
),
(
    (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1),
    'SCORE',
    20,
    '{"description": "Rockets scored"}',
    NOW() - INTERVAL '1 hour 25 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN teams t ON tm.team_id = t.id
     WHERE t.name = 'Rockets' LIMIT 1)
),
-- Game end
(
    (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1),
    'GAME_END',
    NULL,
    '{"message": "Game ended", "final_scores": {"Thunder Hawks": 95, "Rockets": 87}}',
    NOW() - INTERVAL '10 minutes',
    (SELECT tm.id FROM team_members tm
     JOIN game_teams gt ON tm.team_id = gt.team_id
     WHERE gt.game_id = (SELECT id FROM games WHERE game_state = 'completed' LIMIT 1)
     LIMIT 1)
);
