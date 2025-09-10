import { GameStatus } from "~/gql/types";
import { CircleSmallIcon } from "~/icons/circle-small";

import { Badge, BadgeIcon, BadgeText } from "~/ui/badge";

interface GameStatusBadgeProps {
  status: GameStatus;
}

export function GameStatusBadge({ status }: GameStatusBadgeProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case GameStatus.InProgress:
        return {
          text: "LIVE",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
        };
      case GameStatus.Completed:
        return {
          text: "FINAL",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          dotColor: "bg-gray-400",
        };
      case GameStatus.Upcoming:
        return {
          text: "UPCOMING",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          dotColor: "bg-blue-500",
        };
      default:
        return {
          text: "UNKNOWN",
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          dotColor: "bg-gray-400",
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <Badge>
      <BadgeIcon Icon={CircleSmallIcon} filled className="animate-pulse" />
      <BadgeText>{statusInfo.text}</BadgeText>
    </Badge>
  );
}
