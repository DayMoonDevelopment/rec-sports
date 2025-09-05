import { useEffect, useState } from "react";
import { GameStatus } from "~/gql/types";

interface UseGameClockProps {
  status: GameStatus;
  startedAt?: string | null;
  endedAt?: string | null;
}

export function useGameClock({ status, startedAt, endedAt }: UseGameClockProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === GameStatus.InProgress && startedAt) {
      const startTime = new Date(startedAt).getTime();

      const updateElapsed = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000); // Convert to seconds
        setElapsedTime(elapsed);
      };

      // Update immediately
      updateElapsed();

      // Update every second
      interval = setInterval(updateElapsed, 1000);
    } else if (status === GameStatus.Completed && startedAt && endedAt) {
      // For completed games, show the final time
      const startTime = new Date(startedAt).getTime();
      const endTime = new Date(endedAt).getTime();
      const finalElapsed = Math.floor((endTime - startTime) / 1000);
      setElapsedTime(finalElapsed);
    } else {
      // For upcoming games or games without start time
      setElapsedTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, startedAt, endedAt]);

  // Format elapsed time as hh:mm:ss
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isRunning: status === GameStatus.InProgress && !!startedAt,
  };
}
