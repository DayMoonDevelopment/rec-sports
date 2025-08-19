import {
  APIProvider as GoogleMapsAPIProvider,
  Map as GoogleMaps,
  Marker as GoogleMarker,
} from "@vis.gl/react-google-maps";
import { Map as MapKit, Marker } from "mapkit-react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import type { Route } from "./+types/route";

export function Map() {
  const { location, mapConfig, mapProvider } =
    useLoaderData<Route.ComponentProps["loaderData"]>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  if (mapProvider === "apple") {
    return (
      <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
        <MapKit
          token={mapConfig.appleMapsKey}
          initialRegion={{
            centerLatitude: location.latitude,
            centerLongitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            latitude={location.latitude}
            longitude={location.longitude}
            title={location.name}
            subtitle={location.address}
          />
        </MapKit>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
      <GoogleMapsAPIProvider apiKey={mapConfig.googleMapsKey}>
        <GoogleMaps
          defaultZoom={15}
          defaultCenter={{ lat: location.latitude, lng: location.longitude }}
        >
          <GoogleMarker
            position={{ lat: location.latitude, lng: location.longitude }}
            title={location.name}
          />
        </GoogleMaps>
      </GoogleMapsAPIProvider>
    </div>
  );
}
