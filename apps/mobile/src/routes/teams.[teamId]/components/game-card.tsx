import { View, Text } from "react-native";
import { SportIcon } from "../../../components/sport-icon";
import { Sport } from "~/gql/types";
import { GameStatusIndicator } from "./game-status-indicator";

import type { GamePreviewNodeFragment } from "../queries/get-team.generated";

function Card({
  sport,
  children,
  location,
  game,
}: {
  children: React.ReactNode;
  sport: Sport;
  location?: {
    name: string;
    address: {
      street: string;
      city: string;
      stateCode: string;
      postalCode: string;
    } | null;
  } | null;
  game: GamePreviewNodeFragment;
}) {
  const locationText =
    location?.name ||
    (location?.address
      ? `${location.address.street}, ${location.address.city}`
      : null);

  return (
    <View className="flex flex-col justify-between gap-2 bg-card rounded-2xl p-4 w-[45vw] border border-border">
      {children}

      <View className="flex-col gap-2 pt-3 border-t border-border">
        <View className="flex-row items-center justify-between">
          <SportIcon sport={sport} className="size-4" />
          <GameStatusIndicator
            status={game.status}
            scheduledAt={game.scheduledAt}
            startedAt={game.startedAt}
            endedAt={game.endedAt}
          />
        </View>

        {locationText && (
          <Text
            className="text-xs text-muted-foreground ml-2 flex-1"
            numberOfLines={1}
          >
            {locationText}
          </Text>
        )}
      </View>
    </View>
  );
}

export function GameCard({ game }: { game: GamePreviewNodeFragment }) {
  const teams = game.teams || [];
  const teamCount = teams.length;

  const renderSingleTeam = () => (
    <Card sport={game.sport} location={game.location} game={game}>
      <View className="mb-3">
        <Text className="text-card-foreground font-semibold text-base">
          {teams[0]?.team.name || "Unknown Team"}
        </Text>
        <Text className="text-lg font-bold text-primary">
          {teams[0]?.score || 0}
        </Text>
      </View>
    </Card>
  );

  const renderMultipleTeams = () => (
    <Card sport={game.sport} location={game.location} game={game}>
      <View>
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
            {`+${teamCount - 2} more team${teamCount > 3 ? "s" : ""}`}
          </Text>
        )}
      </View>
    </Card>
  );

  if (teamCount === 1) {
    return renderSingleTeam();
  } else {
    return renderMultipleTeams();
  }
}
