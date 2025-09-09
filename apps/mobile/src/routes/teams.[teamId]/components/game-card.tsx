import { View, Text } from "react-native";
import { SportIcon } from "../../../components/sport-icon";
import { formatDistanceToNow } from "date-fns";
import { Sport } from "~/gql/types";

import type { GamePreviewNodeFragment } from "../queries/get-team.generated";

function Card({
  sport,
  status,
  children,
}: {
  children: React.ReactNode;
  sport: Sport;
  status: string;
}) {
  return (
    <View className="bg-card rounded-2xl p-4 w-48 mx-2 border border-border">
      <View className="flex-row items-center justify-between mb-3">
        <SportIcon sport={sport} className="size-4" />
        <Text className="text-xs text-muted-foreground">{status}</Text>
      </View>
      {children}
    </View>
  );
}

export function GameCard({ game }: { game: GamePreviewNodeFragment }) {
  const teams = game.teams || [];
  const teamCount = teams.length;

  const formatDate = (dateString: unknown) => {
    if (!dateString || typeof dateString !== "string") return null;
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return null;
    }
  };

  const renderSingleTeam = () => (
    <Card sport={game.sport} status={game.status}>
      <View className="mb-3">
        <Text className="text-card-foreground font-semibold text-base">
          {teams[0]?.team.name || "Unknown Team"}
        </Text>
        <Text className="text-lg font-bold text-primary">
          {teams[0]?.score || 0}
        </Text>
      </View>

      <View className="border-t border-border pt-2">
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {game.location?.name || "Location TBD"}
        </Text>
        {formatDate(game.scheduledAt) && (
          <Text className="text-xs text-muted-foreground">
            {formatDate(game.scheduledAt)}
          </Text>
        )}
      </View>
    </Card>
  );

  const renderTwoTeams = () => (
    <Card sport={game.sport} status={game.status}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text
            className="text-card-foreground font-medium text-sm"
            numberOfLines={1}
          >
            {teams[0]?.team.name || "Team 1"}
          </Text>
          <Text className="text-lg font-bold text-primary">
            {teams[0]?.score || 0}
          </Text>
        </View>

        <View className="mx-2">
          <Text className="text-muted-foreground font-bold">-</Text>
        </View>

        <View className="flex-1 items-end">
          <Text
            className="text-card-foreground font-medium text-sm"
            numberOfLines={1}
          >
            {teams[1]?.team.name || "Team 2"}
          </Text>
          <Text className="text-lg font-bold text-primary">
            {teams[1]?.score || 0}
          </Text>
        </View>
      </View>

      <View className="border-t border-border pt-2">
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {game.location?.name || "Location TBD"}
        </Text>
        {formatDate(game.scheduledAt) && (
          <Text className="text-xs text-muted-foreground">
            {formatDate(game.scheduledAt)}
          </Text>
        )}
      </View>
    </Card>
  );

  const renderMultipleTeams = () => (
    <Card sport={game.sport} status={game.status}>
      <View className="mb-3">
        <Text className="text-card-foreground font-medium text-sm mb-2">
          {teamCount} Teams
        </Text>

        {/* Show top 2 teams with highest scores */}
        {teams
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, 2)
          .map((team, index) => (
            <View
              key={team.id}
              className="flex-row justify-between items-center"
            >
              <Text
                className="text-card-foreground text-xs flex-1"
                numberOfLines={1}
              >
                {team.team.name}
              </Text>
              <Text className="text-primary font-semibold ml-2">
                {team.score || 0}
              </Text>
            </View>
          ))}

        {teamCount > 2 && (
          <Text className="text-muted-foreground text-xs mt-1">
            +{teamCount - 2} more teams
          </Text>
        )}
      </View>

      <View className="border-t border-border pt-2">
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {game.location?.name || "Location TBD"}
        </Text>
        {formatDate(game.scheduledAt) && (
          <Text className="text-xs text-muted-foreground">
            {formatDate(game.scheduledAt)}
          </Text>
        )}
      </View>
    </Card>
  );

  if (teamCount === 1) {
    return renderSingleTeam();
  } else if (teamCount === 2) {
    return renderTwoTeams();
  } else {
    return renderMultipleTeams();
  }
}
