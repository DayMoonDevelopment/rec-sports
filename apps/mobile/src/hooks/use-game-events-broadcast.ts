import { useApolloClient, useQuery } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { supabaseClient } from "~/lib/supabase";
import { GetGameDocument } from "~/routes/game.[gameId]/queries/get-game.generated";

// Minimal broadcast payload - just the essential data
interface GameEventBroadcast {
  id: string;
  created_at: string;
  value: number; // points value
  type: string; // event type
  team_id: string | null;
  game_id: string;
}

export const useGameEventsBroadcast = (gameId: string) => {
  const apolloClient = useApolloClient();

  // Query game events from Apollo cache/GraphQL - this is our source of truth
  const { data, loading, refetch, startPolling, stopPolling } = useQuery(
    GetGameDocument,
    {
      variables: { id: gameId },
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  );

  // Handle incoming broadcast events
  const handleBroadcastEvent = useCallback(
    (payload: { event: string; payload: GameEventBroadcast }) => {
      console.log("Game event broadcast received:", payload);

      const { event, payload: eventData } = payload;

      if (eventData.game_id !== gameId) {
        return; // Ignore events for other games
      }

      // For simplicity, just refetch the data when we get a broadcast
      // This ensures Apollo cache stays in sync with the database
      // The 30-second polling provides the fallback validation
      refetch();
    },
    [refetch, gameId],
  );

  // Set up broadcast subscription
  useEffect(() => {
    console.log(
      "Setting up game events broadcast subscription for game:",
      gameId,
    );

    // Set up broadcast channel for all game event types
    const channel = supabaseClient
      .channel(`game-events-broadcast-${gameId}`)
      .on("broadcast", { event: "game_event_created" }, handleBroadcastEvent)
      .on("broadcast", { event: "game_event_updated" }, handleBroadcastEvent)
      .on("broadcast", { event: "game_event_deleted" }, handleBroadcastEvent)
      .subscribe();

    // Cleanup
    return () => {
      console.log(
        "Cleaning up game events broadcast subscription for game:",
        gameId,
      );
      supabaseClient.removeChannel(channel);
    };
  }, [gameId, handleBroadcastEvent]);

  // Start polling for validation every 30 seconds
  useEffect(() => {
    if (!loading && data) {
      console.log("Starting 30-second validation polling for game:", gameId);
      startPolling(30000); // Poll every 30 seconds
    }

    return () => {
      console.log("Stopping validation polling for game:", gameId);
      stopPolling();
    };
  }, [loading, data, startPolling, stopPolling, gameId]);

  const game = data?.game;
  const events = game?.events || [];

  // Calculate scores from Apollo cache data
  const scores = {
    team1Score: events
      .filter((event) => event.team?.id === game?.team1?.id)
      .reduce((sum, event) => sum + (event.points || 0), 0),
    team2Score: events
      .filter((event) => event.team?.id === game?.team2?.id)
      .reduce((sum, event) => sum + (event.points || 0), 0),
  };

  return {
    game,
    events,
    scores,
    isLoading: loading,
    refetch,
  };
};
