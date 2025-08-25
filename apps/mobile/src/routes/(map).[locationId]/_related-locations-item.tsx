import { View, Text, Pressable, Dimensions } from "react-native";

import { sportLabel } from "~/lib/utils";
import { SportIcon } from "~/components/sport-icon";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";

import type { Location } from "@rec/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

interface RelatedLocationItemProps {
  location: Location;
  onPress: (location: Location) => void;
}

export function RelatedLocationItem({
  location,
  onPress,
}: RelatedLocationItemProps) {
  return (
    <Pressable
      onPress={() => onPress(location)}
      className="active:opacity-75"
      style={{ width: CARD_WIDTH }}
    >
      <View className="bg-card border border-border rounded-3xl p-4">
        <Text
          className="text-lg font-semibold text-foreground mb-2"
          numberOfLines={1}
        >
          {location.name}
        </Text>

        {location.address && (
          <Text
            className="text-sm text-muted-foreground mb-3"
            numberOfLines={2}
          >
            {[
              location.address.street,
              location.address.city,
              location.address.stateCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
        )}

        {location.sports && location.sports.length > 0 && (
          <View className="flex-row flex-wrap gap-1">
            {location.sports.slice(0, 2).map((sport) => (
              <Badge key={sport} variant={sport} size="sm">
                <BadgeIcon Icon={SportIcon} sport={sport} />
                <BadgeText>{sportLabel(sport)}</BadgeText>
              </Badge>
            ))}
            {location.sports.length > 2 && (
              <Badge variant="secondary" size="sm">
                <BadgeText>+{location.sports.length - 2}</BadgeText>
              </Badge>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
