import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";

import type { LocationNodeFragment } from "../queries/get-search-locations.generated";

// Algolia location record structure (GeoHit)
interface AlgoliaLocationRecord {
  objectID: string;
  name: string;
  sports?: string[];
  address?: {
    id?: string;
    street?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    postalCode?: string;
  };
  _geoloc: {
    lat: number;
    lng: number;
  };
  [key: string]: any; // Allow additional Algolia properties
}

interface LocationItemProps {
  location: LocationNodeFragment | AlgoliaLocationRecord;
}

// Helper to check if location is from Algolia
function isAlgoliaLocation(
  location: LocationNodeFragment | AlgoliaLocationRecord,
): location is AlgoliaLocationRecord {
  return "objectID" in location;
}

export function LocationItem({ location }: LocationItemProps) {
  // Normalize data structure for both GraphQL and Algolia
  const locationId = isAlgoliaLocation(location)
    ? location.objectID
    : location.id;
  const locationName = location.name;
  const locationAddress = location.address;
  const locationSports = location.sports;

  return (
    <Link asChild href={`/locations/${locationId}`}>
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
                {locationName}
              </Text>

              {locationAddress && (
                <Text className="text-muted-foreground text-sm mb-3">
                  {locationAddress.street && `${locationAddress.street}, `}
                  {locationAddress.city}, {locationAddress.stateCode}
                </Text>
              )}

              {/* Sport Badges */}
              {locationSports && locationSports.length > 0 && (
                <View className="flex-row flex-wrap gap-1">
                  {locationSports.slice(0, 2).map((sport) => (
                    <Badge key={sport} variant={sport as any} size="sm">
                      <BadgeIcon Icon={SportIcon} sport={sport as any} />
                      <BadgeText>{sportLabel(sport as any)}</BadgeText>
                    </Badge>
                  ))}
                  {locationSports.length > 2 && (
                    <Badge variant="secondary" size="sm">
                      <BadgeText>+{locationSports.length - 2}</BadgeText>
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
