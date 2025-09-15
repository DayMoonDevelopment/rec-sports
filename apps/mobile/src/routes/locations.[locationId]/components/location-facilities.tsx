import { View, Text } from "react-native";

import { sportLabel } from "~/lib/utils";
import { SportIcon } from "~/components/sport-icon";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";

import type { Sport } from "~/gql/types";

interface LocationFacilitiesProps {
  sports: Sport[];
}

export function LocationFacilities({ sports }: LocationFacilitiesProps) {
  if (!sports || sports.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-foreground mb-2">
        Facilities
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {sports.map((sport, index) => {
          return (
            <Badge key={index} variant={sport} size="default">
              <BadgeIcon Icon={SportIcon} sport={sport} />
              <BadgeText>{sportLabel(sport)}</BadgeText>
            </Badge>
          );
        })}
      </View>
    </View>
  );
}
