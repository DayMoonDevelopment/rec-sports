import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";

import type { LocationNodeFragment } from "./queries/get-search-locations.generated";

interface LocationItemProps {
  location: LocationNodeFragment;
}

export function LocationItem({ location }: LocationItemProps) {
  return (
    <Link asChild href={`/locations/${location.id}`}>
      <Pressable className="mx-4 mb-3 active:opacity-75">
        <View className="bg-card border border-border rounded-3xl p-4">
          <View className="flex-row items-start gap-3">
            {/* Tree Icon */}
            <View className="bg-green-100 dark:bg-green-800 p-2 rounded-xl">
              <TreeIcon className="size-6 text-green-700 dark:text-green-500" />
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className="text-foreground font-semibold text-base mb-1">
                {location.name}
              </Text>

              {location.address && (
                <Text className="text-muted-foreground text-sm mb-3">
                  {location.address.street && `${location.address.street}, `}
                  {location.address.city}, {location.address.stateCode}
                </Text>
              )}

              {/* Sport Badges */}
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
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
