import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import MapView from "react-native-maps";
import { roundRegionForCaching } from "~/lib/region-utils";

import type { ReactNode } from "react";
import type { Region } from "react-native-maps";
import type { Sport } from "~/gql/types";

interface MapMarker {
  id: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  displayType: "location" | Sport;
}

export interface MapPolygon {
  id: string;
  coordinates: { latitude: number; longitude: number }[];
  variant: "default" | Sport;
}

interface MapContextType {
  mapRef: React.RefObject<MapView | null>;
  animateToBounds: (bounds: { latitude: number; longitude: number }[]) => void;
  zoomOut: (multiplier?: number) => void;
  currentRegion: Region | null;
  onRegionChange: (region: Region) => void;
  markers: MapMarker[];
  setMarkers: (markers: MapMarker[]) => void;
  polygons: MapPolygon[];
  setPolygons: (polygons: MapPolygon[]) => void;
}

interface MapProviderProps {
  children: ReactNode;
  onRegionChange?: (region: Region) => void;
}

const MapContext = createContext<MapContextType | null>(null);

// Add fixed margin of roughly 100 meters
// 1 degree latitude ≈ 111,000 meters, so 100m ≈ 0.0009 degrees
const one_hundreds_meters = 0.0009;
const marginDegrees = one_hundreds_meters / 4;

export function MapProvider({
  children,
  onRegionChange: onRegionChangeCallback,
}: MapProviderProps) {
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [polygons, setPolygons] = useState<MapPolygon[]>([]);



  const animateToBounds = useCallback(
    (bounds: { latitude: number; longitude: number }[]) => {
      if (mapRef.current && bounds.length > 0) {
        // Calculate bounding box
        const latitudes = bounds.map((point) => point.latitude);
        const longitudes = bounds.map((point) => point.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        // Calculate center point
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        const latDelta = maxLat - minLat + marginDegrees;
        const lngDelta = maxLng - minLng + marginDegrees;

        mapRef.current.animateToRegion(
          {
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          },
          1000,
        );
      }
    },
    [],
  );

  const onRegionChange = useCallback(
    (region: Region) => {
      const roundedRegion = roundRegionForCaching(region);
      setCurrentRegion(roundedRegion);
      onRegionChangeCallback?.(roundedRegion);
    },
    [onRegionChangeCallback],
  );

  const zoomOut = useCallback(async (multiplier: number = 5) => {
    if (mapRef.current) {
      try {
        // Get the current region
        const currentRegion = await mapRef.current.getCamera();

        // Calculate new deltas (zoom out by multiplying deltas)
        const newLatitudeDelta =
          (currentRegion.zoom
            ? 0.01 * Math.pow(2, 20 - currentRegion.zoom)
            : 0.01) * multiplier;
        const newLongitudeDelta = newLatitudeDelta;

        mapRef.current.animateToRegion(
          {
            latitude: currentRegion.center.latitude,
            longitude: currentRegion.center.longitude,
            latitudeDelta: newLatitudeDelta,
            longitudeDelta: newLongitudeDelta,
          },
          1000,
        );
      } catch {
        // Fallback: zoom out from current center with default deltas
        console.warn("Could not get current region, using fallback zoom out");
        mapRef.current.animateToRegion(
          {
            latitude: 39.8283, // Default US center
            longitude: -98.5795,
            latitudeDelta: 0.5, // Larger delta for zoomed out view
            longitudeDelta: 0.5,
          },
          1000,
        );
      }
    }
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapRef,
        animateToBounds,
        zoomOut,
        currentRegion,
        onRegionChange,
        markers,
        setMarkers,
        polygons,
        setPolygons,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
