-- Games Schema - Clean & Complete
-- Supports teams, games, events with game periods/segments

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id text PRIMARY KEY DEFAULT nanoid('tem'),
    name text NULL, -- NULL for individual players, use display name from user
    team_type text NOT NULL CHECK (team_type IN ('individual', 'team')),
    sport_tags text ARRAY,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id text PRIMARY KEY DEFAULT nanoid('tmb'),
    team_id text NOT NULL REFERENCES teams ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    role text NULL, -- 'captain', 'player', etc.
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create games table  
CREATE TABLE IF NOT EXISTS games (
    id text PRIMARY KEY DEFAULT nanoid('gam'),
    team_1_id text NULL REFERENCES teams ON DELETE SET NULL,
    team_2_id text NULL REFERENCES teams ON DELETE SET NULL,
    sport text NOT NULL,
    game_state text NOT NULL DEFAULT 'scheduled' CHECK (game_state IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_at timestamp with time zone NULL,
    started_at timestamp with time zone NULL,
    completed_at timestamp with time zone NULL,
    location_id text NULL REFERENCES locations ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create game_events table - single source of truth for all game actions
CREATE TABLE IF NOT EXISTS game_events (
    id text PRIMARY KEY DEFAULT nanoid('gev'),
    game_id text NOT NULL REFERENCES games ON DELETE CASCADE,
    team_id text NULL REFERENCES teams ON DELETE SET NULL,
    user_id uuid NULL REFERENCES auth.users ON DELETE SET NULL,
    event_type text NOT NULL, -- 'score', 'penalty', 'timeout', 'substitution', etc.
    event_key text NULL, -- Optional: 'three_pointer', 'free_throw', 'yellow_card', etc.
    points integer DEFAULT 0, -- Points awarded/deducted for this event
    period_number integer DEFAULT 1, -- 1st half, 2nd quarter, 3rd set, etc.
    period_name text NULL, -- 'Q1', '1st Half', 'Set 1', 'Overtime', etc.
    occurred_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- Add simple score columns (no computed columns, just regular fields)
ALTER TABLE games ADD COLUMN team_1_score integer DEFAULT 0;
ALTER TABLE games ADD COLUMN team_2_score integer DEFAULT 0;
ALTER TABLE games ADD COLUMN winner_team_id text NULL REFERENCES teams ON DELETE SET NULL;

-- Simple function to update game scores when events change
CREATE OR REPLACE FUNCTION update_game_scores_simple()
RETURNS trigger AS $$
DECLARE
    game_record RECORD;
    t1_score integer := 0;
    t2_score integer := 0;
    winner_id text := NULL;
BEGIN
    -- Get the game_id from the event
    DECLARE
        target_game_id text;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            target_game_id := OLD.game_id;
        ELSE
            target_game_id := NEW.game_id;
        END IF;

        -- Get game info
        SELECT * INTO game_record FROM games WHERE id = target_game_id;
        
        -- Calculate scores by summing points for each team
        SELECT 
            COALESCE(SUM(CASE WHEN team_id = game_record.team_1_id THEN points ELSE 0 END), 0),
            COALESCE(SUM(CASE WHEN team_id = game_record.team_2_id THEN points ELSE 0 END), 0)
        INTO t1_score, t2_score
        FROM game_events 
        WHERE game_id = target_game_id;

        -- Determine winner (only for completed games)
        IF game_record.game_state = 'completed' THEN
            IF t1_score > t2_score AND game_record.team_1_id IS NOT NULL THEN
                winner_id := game_record.team_1_id;
            ELSIF t2_score > t1_score AND game_record.team_2_id IS NOT NULL THEN
                winner_id := game_record.team_2_id;
            ELSIF game_record.team_1_id IS NULL AND game_record.team_2_id IS NOT NULL THEN
                winner_id := game_record.team_2_id;
            ELSIF game_record.team_2_id IS NULL AND game_record.team_1_id IS NOT NULL THEN
                winner_id := game_record.team_1_id;
            END IF;
        END IF;

        -- Update the scores
        UPDATE games 
        SET 
            team_1_score = t1_score,
            team_2_score = t2_score,
            winner_team_id = winner_id,
            updated_at = now()
        WHERE id = target_game_id;
    END;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update scores when game events change
CREATE TRIGGER update_scores_on_events
    AFTER INSERT OR UPDATE OR DELETE ON game_events
    FOR EACH ROW
    EXECUTE FUNCTION update_game_scores_simple();

-- Essential indexes
CREATE INDEX IF NOT EXISTS teams_type_sport_idx ON teams(team_type, sport_tags);
CREATE INDEX IF NOT EXISTS team_members_team_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_idx ON team_members(user_id);
CREATE INDEX IF NOT EXISTS games_teams_idx ON games(team_1_id, team_2_id);
CREATE INDEX IF NOT EXISTS games_state_idx ON games(game_state);
CREATE INDEX IF NOT EXISTS games_winner_idx ON games(winner_team_id);
CREATE INDEX IF NOT EXISTS games_scheduled_idx ON games(scheduled_at);
CREATE INDEX IF NOT EXISTS game_events_game_team_idx ON game_events(game_id, team_id);
CREATE INDEX IF NOT EXISTS game_events_game_period_idx ON game_events(game_id, period_number);
CREATE INDEX IF NOT EXISTS game_events_type_idx ON game_events(event_type);
CREATE INDEX IF NOT EXISTS game_events_occurred_idx ON game_events(occurred_at);

-- Essential constraints
ALTER TABLE team_members ADD CONSTRAINT team_members_unique UNIQUE (team_id, user_id);
ALTER TABLE games ADD CONSTRAINT games_different_teams CHECK (team_1_id IS NULL OR team_2_id IS NULL OR team_1_id != team_2_id);

-- Simple RLS policies (basic read access)
CREATE POLICY "teams_read" ON teams FOR SELECT USING (TRUE);
CREATE POLICY "team_members_read" ON team_members FOR SELECT USING (TRUE);  
CREATE POLICY "games_read" ON games FOR SELECT USING (TRUE);
CREATE POLICY "game_events_read" ON game_events FOR SELECT USING (TRUE);

-- Enable Supabase Realtime for live game updates
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE game_events;