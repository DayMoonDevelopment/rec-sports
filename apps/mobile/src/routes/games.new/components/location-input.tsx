import { View, Text, Pressable } from "react-native";
import { useCallback } from "react";

import { useCreateGameForm } from "../create-game-context";
import { SportIcon } from "~/components/sport-icon";
import { TreeIcon } from "~/icons/tree";
import { CrossIcon } from "~/icons/cross";
import { SearchIcon } from "~/icons/search";
import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";
import { sportLabel } from "~/lib/utils";

export function LocationInput() {
  const {
    selectedSport,
    selectedLocation,
    setSelectedLocation,
    setLocationName,
    openLocationSelection,
  } = useCreateGameForm();

  const handleRemoveLocation = useCallback(() => {
    setSelectedLocation(null);
    setLocationName("");
  }, [setSelectedLocation, setLocationName]);

  const handleOpenSearch = useCallback(() => {
    openLocationSelection();
  }, [openLocationSelection]);

  if (!selectedSport) return null;

  return (
    <View className="space-y-3">
      <Text className="text-lg font-semibold text-foreground">Location</Text>

      {selectedLocation ? (
        <View className="bg-card border border-border rounded-3xl p-4">
          <View className="flex-row items-start gap-3">
            <View className="bg-green-100 dark:bg-green-800 p-2 rounded-xl">
              <TreeIcon className="size-6 text-green-700 dark:text-green-500" />
            </View>

            <View className="flex-1">
              <Text className="text-foreground font-semibold text-base mb-1">
                {selectedLocation.name}
              </Text>

              {selectedLocation.address && (
                <Text className="text-muted-foreground text-sm mb-3">
                  {selectedLocation.address.street &&
                    `${selectedLocation.address.street}, `}
                  {selectedLocation.address.city},{" "}
                  {selectedLocation.address.stateCode}
                </Text>
              )}

              {selectedLocation.sports &&
                selectedLocation.sports.length > 0 && (
                  <View className="flex-row flex-wrap gap-1">
                    {selectedLocation.sports.slice(0, 2).map((sport) => (
                      <Badge key={sport} variant={sport} size="sm">
                        <BadgeIcon Icon={SportIcon} sport={sport} />
                        <BadgeText>{sportLabel(sport)}</BadgeText>
                      </Badge>
                    ))}
                    {selectedLocation.sports.length > 2 && (
                      <Badge variant="secondary" size="sm">
                        <BadgeText>
                          +{selectedLocation.sports.length - 2}
                        </BadgeText>
                      </Badge>
                    )}
                  </View>
                )}
            </View>

            <Pressable
              className="bg-secondary p-2 rounded-full active:opacity-50"
              onPress={handleRemoveLocation}
            >
              <CrossIcon className="size-4 text-foreground" />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={handleOpenSearch}
          className="p-3 bg-card border border-muted rounded-lg flex-row items-center gap-3 active:opacity-75"
        >
          <SearchIcon className="size-5 text-muted-foreground" />
          <Text className="text-muted-foreground flex-1">
            Search for a location...
          </Text>
        </Pressable>
      )}
    </View>
  );
}
