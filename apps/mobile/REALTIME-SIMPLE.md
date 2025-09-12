# Simplified Game Realtime Features

## Overview

The mobile app uses **direct Supabase Realtime** for game events, providing true real-time updates with minimal latency. This approach:

- ✅ Shows live events directly from Supabase realtime payloads
- ✅ Calculates scores in real-time by aggregating event points
- ✅ Eliminates unnecessary API round-trips
- ✅ Provides sub-second update latency

## Simple Architecture

### Database Setup

- Realtime enabled on `game_actions` table
- Events contain `points` field for score calculation

### Mobile Implementation

1. **Supabase Context** (`src/context/supabase.tsx`):
   - Manages Supabase client connection
   - Provides connection status to components

2. **Single Realtime Hook** (`src/hooks/use-game-events-realtime.ts`):
   - Subscribes only to `game_actions` for the current game
   - Loads initial events from Supabase
   - Updates event list directly from realtime payloads
   - Calculates live scores by aggregating event points

3. **No Apollo Integration**:
   - Events come directly from Supabase
   - Basic game info (teams, location) still uses GraphQL (one-time fetch)
   - No cache invalidation or polling needed

## Usage

### Game Detail Screen

Components use the focused realtime hook:

```tsx
// Get events and live scores directly from Supabase
const { events, scores, isRealtimeConnected } = useGameEventsRealtime(
  gameId,
  team1Id,
  team2Id,
);

// Basic game info from GraphQL (one-time fetch)
const { data } = useQuery(GetGameDocument, {
  variables: { id: gameId },
  fetchPolicy: "cache-first", // No polling
});
```

### What's Real-time vs Static

- **Real-time**: Events list, live scores, realtime connection status
- **Static**: Game info (teams, location, sport) - fetched once via GraphQL

### Connection Status

- **Green dot**: Connected and receiving real-time event updates
- **Red dot**: Realtime connection is down (events won't update live)

## Environment Setup

Add to your `.env` file:

```bash
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How It Works

1. **Initial Load**:
   - Fetch basic game info via GraphQL (teams, location, etc.)
   - Load initial events directly from Supabase `game_actions` table
2. **Realtime Subscription**:
   - Subscribe to `game_actions` changes for the specific game
   - Filter: `game_id=eq.${gameId}`
3. **Live Updates**:
   - New events appear instantly in the events list
   - Scores update automatically by aggregating event points
   - No API calls or cache invalidation needed
4. **Cleanup**:
   - Subscription cleaned up when leaving game screen

## Benefits of This Approach

- **Faster**: Direct data from realtime (no API round-trip)
- **Simpler**: Single subscription, no cache management
- **More Reliable**: Fewer moving parts, less likely to break
- **Lower Latency**: Sub-second updates vs multi-second polling
- **Less Resource Usage**: No unnecessary API calls

## Testing

To test realtime functionality:

1. Open the same game on multiple devices
2. Add events through the database or API
3. Events should appear instantly on all clients
4. Scores should update automatically

## Troubleshooting

**No realtime updates:**

1. Check the connection dot in the events header (should be green)
2. Verify environment variables are set correctly
3. Ensure database has `ALTER PUBLICATION supabase_realtime ADD TABLE game_actions;`

**Events not showing:**

1. Check browser console for Supabase errors
2. Verify the `game_id` matches between the game and events
3. Check that events exist in the `game_actions` table
