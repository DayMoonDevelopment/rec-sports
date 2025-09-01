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

import { GetLocationDocument } from "./queries/get-location.generated";
import { RelatedLocations } from "./_related-locations";

export function Component() {
  const { locationId, lat, lng } = useLocalSearchParams<{
    locationId: string;
    lat?: string;
    lng?: string;
  }>();
  const { setFocusedMarkerId, hideMarkerCallout, zoomOut, animateToLocation } =
    useMap();

  // Use Apollo query to fetch location by ID
  const { data, loading, error } = useQuery(GetLocationDocument, {
    fetchPolicy: "cache-and-network",
    variables: { id: locationId },
    skip: !locationId,
    onCompleted: (data) => {
      // Only animate from query if no lat/lng provided via params
      if (data.location && !lat && !lng) {
        animateToLocation(
          data.location.geo.latitude,
          data.location.geo.longitude,
        );
      }
    },
  });

  const location = data?.location;

  // Focus on the location when it loads
  useEffect(() => {
    if (locationId) {
      setFocusedMarkerId(locationId);

      // If lat/lng provided via params, animate immediately
      if (lat && lng) {
        animateToLocation(parseFloat(lat), parseFloat(lng));
      } else if (location) {
        // Otherwise use location data from query
        animateToLocation(location.geo.latitude, location.geo.longitude);
      }
    }
  }, [location, locationId, lat, lng, setFocusedMarkerId, animateToLocation]);

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

  if (error || !location) {
    return (
      <View className="flex-1 justify-center items-center py-8 px-4">
        <Text className="text-foreground text-lg font-medium">
          {"There was an error fetching the location"}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="justify-center items-center py-8 px-4 min-h-48">
        <View className="animate-spin">
          <LoaderIcon height={24} width={24} />
        </View>
      </View>
    );
  }

  return (
    <BottomSheetScrollView>
      <View className="py-4 px-4">
        <View className="flex flex-row items-start justify-between gap-2">
          <View className="flex-1 flex flex-col gap-1">
            <View className="bg-green-100 dark:bg-green-800 p-2 rounded-xl self-start">
              <TreeIcon className="size-8 text-green-700 dark:text-green-500" />
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
            {location.address ? (
              <Text className="text-muted-foreground text-base">
                {`${location.address.city}, ${location.address.stateCode} ${location.address.postalCode}`}
              </Text>
            ) : null}
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

      <RelatedLocations reference={location} />
    </BottomSheetScrollView>
  );
}
