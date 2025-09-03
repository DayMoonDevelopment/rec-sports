-- Games Schema - Clean & Complete
-- Supports teams, games, events with game periods/segments

--
-- Create table definitions
CREATE TABLE teams (
    id text PRIMARY KEY DEFAULT nanoid('tm'),
    name text NULL, -- NULL for individual players, use display name from user
    team_type text NOT NULL CHECK (team_type IN ('individual', 'group')),
    sport_tags text ARRAY,
    created_at timestamp with time zone DEFAULT now(),
    created_up uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid NULL REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE teams IS 'Teams participate in games and are made up of members.';
COMMENT ON COLUMN teams.team_type IS 'For a solo play, a user would have a team where they are the only member (individual) and all other teams are denoted as "groups"';
COMMENT ON COLUMN teams.sport_tags IS 'Tagging system for easy lookup. Not intended for access control';

CREATE TABLE team_members (
    id text PRIMARY KEY DEFAULT nanoid('tmmb'),
    team_id text NOT NULL REFERENCES teams ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    created_up uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid NULL REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE team_members IS 'Assigns a user to a team.';

CREATE TABLE games (
    id text PRIMARY KEY DEFAULT nanoid('gm'),
    sport text NOT NULL,
    game_state text NOT NULL DEFAULT 'upcoming' CHECK (game_state IN ('upcoming', 'in_progress', 'completed')),
    scheduled_at timestamp with time zone NULL,
    location_id text NULL REFERENCES locations ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_up uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid NULL REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE games IS 'Tracks a specific game played for a specific sport';
COMMENT ON COLUMN games.game_state IS '[upcoming] the game has yet to start. [in_progress] the game is active, [completed] the game is finished';
COMMENT ON COLUMN games.scheduled_at IS 'Drives UI to describe if an upcoming game is INTENDING to start at a specific time. Not for auto-starting games. Use game_actions to start/stop a game';

CREATE TABLE game_teams (
    id text PRIMARY KEY DEFAULT nanoid('gmtm'),
    game_id text NOT NULL REFERENCES games ON DELETE CASCADE,
    team_id text NOT NULL REFERENCES teams ON DELETE CASCADE,
    score integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    created_up uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid NULL REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE game_teams IS 'Allows any number of teams to be represented as participants of a game. Sport-specific limits should be handled by API business logic';
COMMENT ON COLUMN game_teams.score IS 'Aggregated from game_actions as a part of the heavy-write, light-read principle for data storage';

CREATE TABLE game_actions (
    id text PRIMARY KEY DEFAULT nanoid('gmac'),
    game_id text NOT NULL REFERENCES games ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('GAME_START', 'GAME_END', 'SCORE')),
    point_value numeric NULL, -- Points for SCORE events, NULL for GAME_START/GAME_END
    details jsonb NULL, -- Additional event details (e.g., period info, descriptions)
    occurred_at timestamp with time zone DEFAULT now(),
    occurred_by text NULL REFERENCES team_members ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid NULL REFERENCES auth.users ON DELETE SET NULL
);
COMMENT ON TABLE game_actions IS 'Determines the flow of the gameplay as is tracked by users in realtime';
COMMENT ON COLUMN game_actions.type IS '[GAME_START/GAME_END] manages game timers. [SCORE] manages team scores';
COMMENT ON COLUMN game_actions.point_value IS 'Action-specific column for the SCORE action.';
COMMENT ON COLUMN game_actions.occurred_by IS 'Team can be inferred by the player who triggered the action.';

--
-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION user_is_in_team(team_id_param text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_id = team_id_param
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION user_is_in_game(game_id_param text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM game_teams gt
        JOIN team_members tm ON gt.team_id = tm.team_id
        WHERE gt.game_id = game_id_param
        AND tm.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

--
-- Add indexes to tables
CREATE INDEX teams_type_sport_idx ON teams(team_type, sport_tags);
CREATE INDEX team_members_team_idx ON team_members(team_id);
CREATE INDEX team_members_user_idx ON team_members(user_id);
CREATE INDEX games_state_idx ON games(game_state);
CREATE INDEX games_location_idx ON games(location_id);
CREATE INDEX games_scheduled_idx ON games(scheduled_at);
CREATE INDEX game_teams_game_idx ON game_teams(game_id);
CREATE INDEX game_teams_team_idx ON game_teams(team_id);
CREATE INDEX game_teams_game_team_idx ON game_teams(game_id, team_id);
CREATE INDEX game_actions_game_idx ON game_actions(game_id);
CREATE INDEX game_actions_game_occurred_idx ON game_actions(game_id, occurred_at);
CREATE INDEX game_actions_type_idx ON game_actions(type);
CREATE INDEX game_actions_occurred_idx ON game_actions(occurred_at);
CREATE INDEX game_actions_occurred_by_idx ON game_actions(occurred_by);

--
-- Table constraints
ALTER TABLE team_members ADD CONSTRAINT team_members_unique UNIQUE (team_id, user_id);
ALTER TABLE game_teams ADD CONSTRAINT game_teams_unique UNIQUE (game_id, team_id);

--
-- RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;

-- RLS policies: Anyone can read, writing protected by game/team participation
-- Teams policies
CREATE POLICY "teams_read" ON teams FOR SELECT USING (TRUE);
CREATE POLICY "teams_insert" ON teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "teams_update" ON teams FOR UPDATE USING (user_is_in_team(id));
CREATE POLICY "teams_delete" ON teams FOR DELETE USING (user_is_in_team(id));

-- Team members policies
CREATE POLICY "team_members_read" ON team_members FOR SELECT USING (TRUE);
CREATE POLICY "team_members_insert" ON team_members FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
        user_id = auth.uid() OR -- Users can add themselves
        user_is_in_team(team_id) -- Team members can add others
    )
);
CREATE POLICY "team_members_update" ON team_members FOR UPDATE USING (user_is_in_team(team_id));
CREATE POLICY "team_members_delete" ON team_members FOR DELETE USING (
    user_id = auth.uid() OR -- Users can remove themselves
    user_is_in_team(team_id) -- Team members can remove others
);

-- Games policies
CREATE POLICY "games_read" ON games FOR SELECT USING (TRUE);
CREATE POLICY "games_insert" ON games FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "games_update" ON games FOR UPDATE USING (user_is_in_game(id));
CREATE POLICY "games_delete" ON games FOR DELETE USING (user_is_in_game(id));

-- Game teams policies
CREATE POLICY "game_teams_read" ON game_teams FOR SELECT USING (TRUE);
CREATE POLICY "game_teams_insert" ON game_teams FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
        user_is_in_game(game_id) OR -- Game participants can add teams
        user_is_in_team(team_id) -- Team members can join games
    )
);
CREATE POLICY "game_teams_update" ON game_teams FOR UPDATE USING (
    user_is_in_game(game_id) OR user_is_in_team(team_id)
);
CREATE POLICY "game_teams_delete" ON game_teams FOR DELETE USING (
    user_is_in_game(game_id) OR user_is_in_team(team_id)
);

-- Game actions policies
CREATE POLICY "game_actions_read" ON game_actions FOR SELECT USING (TRUE);
CREATE POLICY "game_actions_insert" ON game_actions FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND user_is_in_game(game_id)
);
CREATE POLICY "game_actions_update" ON game_actions FOR UPDATE USING (
    user_is_in_game(game_id) AND created_by = auth.uid()
);
CREATE POLICY "game_actions_delete" ON game_actions FOR DELETE USING (
    user_is_in_game(game_id) AND created_by = auth.uid()
);

--
-- Triggers to automatically update updated_at on all tables
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_by_columns();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_by_columns();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_by_columns();

CREATE TRIGGER update_game_teams_updated_at
    BEFORE UPDATE ON game_teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_by_columns();

CREATE TRIGGER update_game_actions_updated_at
    BEFORE UPDATE ON game_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_by_columns();
