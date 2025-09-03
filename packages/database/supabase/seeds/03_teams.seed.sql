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
    get_user_id('user3@example.com')
);

-- Create a team that can have a user added to it later
INSERT INTO teams (
    name,
    team_type,
    sport_tags
) VALUES (
    'Booger Beans',
    'group',
    ARRAY['basketball', 'tennis', 'pickleball']
);

INSERT INTO team_members (
    team_id,
    user_id
) VALUES
(
    get_team_id('Booger Beans'),
    get_user_id('user4@example.com')
),
(
    get_team_id('Booger Beans'),
    get_user_id('user5@example.com')
),
(
    get_team_id('Booger Beans'),
    get_user_id('user6@example.com')
);
