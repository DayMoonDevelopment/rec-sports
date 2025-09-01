import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "~/lib/supabase";

// Minimal broadcast payload - just the essential data
interface GameEventBroadcast {
  id: string;
  created_at: string;
  value: number; // points value
  type: string; // event type
  team_id: string | null;
  game_id: string;
}

// Broadcast event types
type BroadcastEventType = 'game_event_created' | 'game_event_updated' | 'game_event_deleted';

interface UseGameEventsBroadcastProps {
  gameId: string;
  onBroadcast?: (event: BroadcastEventType, payload: GameEventBroadcast) => void;
}

export function useGameEventsBroadcast({ gameId, onBroadcast }: UseGameEventsBroadcastProps) {
  const [isConnected, setIsConnected] = useState(false);

  // Handle incoming broadcast events
  const handleBroadcastEvent = useCallback(
    (payload: { event: string; payload: GameEventBroadcast }) => {
      console.log("Game event broadcast received:", payload);
      
      const { event, payload: eventData } = payload;
      
      if (eventData.game_id !== gameId) {
        return; // Ignore events for other games
      }

      // Call the callback with the event type and data
      if (onBroadcast) {
        onBroadcast(event as BroadcastEventType, eventData);
      }
    },
    [gameId, onBroadcast]
  );

  // Set up broadcast subscription
  useEffect(() => {
    console.log("Setting up game events broadcast subscription for game:", gameId);

    // Set up broadcast channel for all game event types
    const channel = supabaseClient
      .channel(`game-events-broadcast-${gameId}`)
      .on("broadcast", { event: "game_event_created" }, handleBroadcastEvent)
      .on("broadcast", { event: "game_event_updated" }, handleBroadcastEvent)
      .on("broadcast", { event: "game_event_deleted" }, handleBroadcastEvent)
      .subscribe((status) => {
        console.log(`Broadcast subscription status: ${status}`);
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Cleanup
    return () => {
      console.log("Cleaning up game events broadcast subscription for game:", gameId);
      supabaseClient.removeChannel(channel);
      setIsConnected(false);
    };
  }, [gameId, handleBroadcastEvent]);

  // Function to send broadcast messages
  const sendBroadcast = useCallback(
    async (eventType: BroadcastEventType, payload: Omit<GameEventBroadcast, 'game_id'>) => {
      try {
        const fullPayload = {
          ...payload,
          game_id: gameId,
        };

        await supabaseClient
          .channel(`game-events-broadcast-${gameId}`)
          .send({
            type: 'broadcast',
            event: eventType,
            payload: fullPayload,
          });

        console.log(`Broadcast sent: ${eventType}`, fullPayload);
      } catch (error) {
        console.error(`Failed to send broadcast: ${eventType}`, error);
        throw error;
      }
    },
    [gameId]
  );

  return {
    isConnected,
    sendBroadcast,
  };
}