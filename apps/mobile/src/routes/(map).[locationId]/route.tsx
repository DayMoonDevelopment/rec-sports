import { View, Text, Pressable } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import { sportLabel } from "~/lib/utils";

import { useMap } from "~/components/map.context";
import { SportIcon } from "~/components/sport-icon";

import { CrossIcon } from "~/icons/cross";
import { TreeIcon } from "~/icons/tree";
import { LoaderIcon } from "~/icons/loader";

import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";

import { GET_LOCATION } from "./queries/get-location";

export function Component() {
  const { locationId } = useLocalSearchParams<{
    locationId: string;
  }>();
  const { setFocusedMarkerId, hideMarkerCallout, zoomOut, animateToLocation } =
    useMap();

  // Use Apollo query to fetch location by ID
  const { data, loading, error } = useQuery(GET_LOCATION, {
    variables: { id: locationId },
    skip: !locationId,
  });

  const location = data?.location;

  // Focus on the location when it loads
  useEffect(() => {
    if (location && locationId) {
      setFocusedMarkerId(locationId);
      animateToLocation(location.geo.latitude, location.geo.longitude);
    }
  }, [location, locationId, setFocusedMarkerId, animateToLocation]);

  function handleClose() {
    hideMarkerCallout(locationId);
    setFocusedMarkerId(null);
    zoomOut(5);

    // Check if there are screens in the navigation stack to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no screens in stack, reset to the index route
      router.replace("/(map)");
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-8 px-4">
        <Text className="text-foreground text-lg font-medium">
          {"There was an error fetching the location"}
        </Text>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View className="justify-center items-center py-8 px-4 min-h-48">
        <View className="animate-spin">
          <LoaderIcon height={24} width={24} />
        </View>
      </View>
    );
  }

  return (
    <BottomSheetScrollView className="px-4">
      <View className="py-4">
        <View className="flex flex-row items-start justify-between gap-2">
          <View className="flex-1 flex flex-col gap-1">
            <View className="bg-green-100 p-2 rounded-xl self-start">
              <TreeIcon height={32} width={32} />
            </View>

            <Text className="flex-1 text-3xl font-bold text-foreground pt-3">
              {location.name}
            </Text>
          </View>

          <Pressable
            className="size-14 bg-secondary rounded-full items-center justify-center active:opacity-50 transition-opacity"
            onPress={handleClose}
          >
            <CrossIcon height={22} width={22} />
          </Pressable>
        </View>

        {location.address ? (
          <View className="flex-1 mb-4">
            <Text className="text-muted-foreground text-base">
              {location.address.street}
            </Text>
            <Text className="text-muted-foreground text-base">
              {`${location.address.city}, ${location.address.stateCode} ${location.address.postalCode}`}
            </Text>
          </View>
        ) : null}

        {location.sports && location.sports.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Sports Available
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {location.sports.map((sport, index) => {
                return (
                  <Badge key={index} variant={sport} size="default">
                    <BadgeIcon Icon={SportIcon} sport={sport} />
                    <BadgeText>{sportLabel(sport)}</BadgeText>
                  </Badge>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </BottomSheetScrollView>
  );
}
