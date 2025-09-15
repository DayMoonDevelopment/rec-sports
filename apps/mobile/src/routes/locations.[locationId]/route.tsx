import { View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@apollo/client";

import { useMap } from "~/components/map.context";

import { GetLocationDocument } from "./queries/get-location.generated";
import { RelatedLocations } from "./_related-locations";
import { LocationHeader } from "./components/location-header";
import { LocationAddress } from "./components/location-address";
import { LocationFacilities } from "./components/location-facilities";
import { LocationLoading } from "./components/location-loading";
import { LocationError } from "./components/location-error";

import type { MapPolygon } from "~/components/map.context";

export function Component() {
  const { locationId } = useLocalSearchParams<{
    locationId: string;
    lat?: string;
    lng?: string;
  }>();
  const { zoomOut, animateToBounds, setMarkers, setPolygons } = useMap();

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

        // Set bounds if location has bounds
        let bounds: MapPolygon[] = [];
        if (data.location.bounds && data.location.bounds.length > 0) {
          bounds.push({
            variant: "default",
            coordinates: data.location.bounds,
            id: locationId,
          });
          animateToBounds(data.location.bounds);
        }

        // add facility bounds after so they render on top of location bounds
        facilities
          .filter((facility) => facility.bounds.length)
          .forEach((facility) =>
            bounds.push({
              id: facility.id,
              coordinates: facility.bounds,
              variant: facility.sport,
            }),
          );

        setPolygons(bounds);
      }
    },
  });

  const location = data?.location;

  function handleClose() {
    setPolygons([]); // Clear polygon bounds
    setMarkers([]); // Clear markers
    zoomOut(1);

    // Check if there are screens in the navigation stack to go back to
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no screens in stack, reset to the index route
      router.replace("/locations");
    }
  }

  if (loading && !location) {
    return <LocationLoading />;
  }

  if (error && !location) {
    return <LocationError />;
  }

  if (!location) {
    return null;
  }

  return (
    <BottomSheetScrollView>
      <View className="py-4 px-4">
        <LocationHeader name={location.name} onClose={handleClose} />

        {location.address && <LocationAddress address={location.address} />}

        <LocationFacilities sports={location.sports} />
      </View>

      <RelatedLocations reference={location} />
    </BottomSheetScrollView>
  );
}
