import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@apollo/client";

import { useMap } from "~/components/map.context";

import { CrossIcon } from "~/icons/cross";

import { Badge, BadgeText, getSportBadgeVariant } from "~/ui/badge";

import { GET_LOCATION } from "./queries/get-location";

export function Component() {
  const { locationId, locationData } = useLocalSearchParams<{
    locationId: string;
    locationData?: string;
  }>();
  const { setFocusedMarkerId, hideMarkerCallout, zoomOut } = useMap();

  // Use Apollo query to fetch location by ID
  const { data, loading, error } = useQuery(GET_LOCATION, {
    variables: { id: locationId },
    skip: !locationId,
  });

  const location = data?.location;

  function handleClose() {
    // Check if there are screens in the navigation stack to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no screens in stack, reset to the index route
      router.replace("/(map)");
    }
  }

  if (error || !location) {
    return (
      <BottomSheetScrollView className="px-4">
        <View className="flex-1 justify-center items-center py-8">
          <Text className="text-foreground text-lg font-medium">
            {"There was an error fetching the location"}
          </Text>
        </View>
      </BottomSheetScrollView>
    );
  }

  return (
    <BottomSheetScrollView className="px-4">
      <View className="py-4">
        <View className="flex flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-3xl font-bold text-foreground pt-3">
            {location.name}
          </Text>

          <Pressable
            className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
            onPress={handleClose}
          >
            <CrossIcon height={22} width={22} />
          </Pressable>
        </View>

        {location.address ? (
          <Text className="text-foreground/70 text-base mb-4">
            {`${location.address.street} ${location.address.city}, ${location.address.state} ${location.address.zip}`}
          </Text>
        ) : null}

        {location.sports && location.sports.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Sports Available
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {location.sports.map((sport, index) => (
                <Badge
                  key={index}
                  variant={getSportBadgeVariant(sport)}
                  size="default"
                >
                  <BadgeText>{sport}</BadgeText>
                </Badge>
              ))}
            </View>
          </View>
        )}

        {location.geo && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Location
            </Text>
            <Text className="text-foreground/70 text-sm">
              Latitude: {location.geo.latitude.toFixed(6)}
            </Text>
            <Text className="text-foreground/70 text-sm">
              Longitude: {location.geo.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>
    </BottomSheetScrollView>
  );
}
