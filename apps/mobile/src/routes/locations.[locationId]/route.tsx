import { View, Text, Pressable, Linking, Platform } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@apollo/client";

import { sportLabel } from "~/lib/utils";

import { useMap } from "~/components/map.context";
import { SportIcon } from "~/components/sport-icon";

import { CrossIcon } from "~/icons/cross";
import { LoaderIcon } from "~/icons/loader";

import { Badge, BadgeText, BadgeIcon } from "~/ui/badge";

import { GetLocationDocument } from "./queries/get-location.generated";
import { RelatedLocations } from "./_related-locations";

import type { MapPolygon } from "~/components/map.context";

export function Component() {
  const { locationId } = useLocalSearchParams<{
    locationId: string;
    lat?: string;
    lng?: string;
  }>();
  const {
    hideMarkerCallout,
    zoomOut,
    animateToBounds,
    setMarkers,
    setPolygons,
  } = useMap();

  // Use Apollo query to fetch location by ID
  const { data, loading, error } = useQuery(GetLocationDocument, {
    fetchPolicy: "cache-and-network",
    variables: { id: locationId },
    skip: !locationId,
    onCompleted: (data) => {
      if (data.location) {
        // Create facility markers for individual sports fields/courts within the location
        const facilities = data.location.facilities || [];
        const facilityMarkers = facilities.map((facility) => ({
          id: facility.id,
          geo: facility.geo,
          displayType: facility.sport,
        }));

        // Set only the facility markers on the map (not the location itself)
        setMarkers(facilityMarkers);
        let bounds: MapPolygon[] = facilities
          .filter((facility) => facility.bounds.length)
          .map((facility) => ({
            id: facility.id,
            coordinates: facility.bounds,
            variant: facility.sport,
          }));

        // Set bounds if location has bounds
        if (data.location.bounds && data.location.bounds.length > 0) {
          bounds.push({
            variant: "default",
            coordinates: data.location.bounds,
            id: locationId,
          });
          animateToBounds(data.location.bounds);
        }

        setPolygons(bounds);
      }
    },
  });

  const location = data?.location;

  async function handleGetDirections() {
    if (!location?.address) return;

    const { street, street2, city, stateCode, postalCode } = location.address;
    const addressParts = [street, street2, city, stateCode, postalCode].filter(
      Boolean,
    );
    const fullAddress = addressParts.join(", ");
    const encodedAddress = encodeURIComponent(fullAddress);

    // Try different URL schemes in order of preference
    const urlsToTry = [
      // Universal geo: URI that works across platforms and respects user's default map app
      `geo:0,0?q=${encodedAddress}`,
      // Platform-specific fallbacks
      Platform.OS === "ios"
        ? `maps://?q=${encodedAddress}`
        : `geo:${encodedAddress}`,
      // Google Maps as backup (works on both platforms)
      `comgooglemaps://?q=${encodedAddress}`,
      // Web fallback
      `https://maps.google.com/?q=${encodedAddress}`,
    ];

    // Try each URL scheme until one works
    for (const url of urlsToTry) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return; // Success, exit early
        }
      } catch (error) {
        // Continue to next URL scheme
        continue;
      }
    }

    // If all else fails, open in browser
    const webUrl = `https://maps.google.com/?q=${encodedAddress}`;
    Linking.openURL(webUrl).catch(() => {
      console.warn("Failed to open maps application");
    });
  }

  function handleClose() {
    hideMarkerCallout(locationId);

    setPolygons([]); // Clear polygon bounds
    setMarkers([]); // Clear markers
    zoomOut(2);

    // Check if there are screens in the navigation stack to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no screens in stack, reset to the index route
      router.replace("/locations");
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
          <Pressable
            className="flex-1 mb-4 active:opacity-50 transition-opacity"
            onPress={handleGetDirections}
          >
            {[
              location.address.street,
              location.address.street2,
              `${location.address.city}, ${location.address.stateCode} ${location.address.postalCode}`,
            ]
              .filter(Boolean)
              .map((addressPart, index) => (
                <Text
                  className="text-muted-foreground text-base"
                  key={`address-part-${index}`}
                >
                  {addressPart}
                </Text>
              ))}
          </Pressable>
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
