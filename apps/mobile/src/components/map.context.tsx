import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import MapView, { Marker } from "react-native-maps";
import { roundRegionForCaching } from "~/lib/region-utils";

import type { ReactNode } from "react";
import type { Region } from "react-native-maps";

interface MarkerRef {
  id: string;
  ref: React.RefObject<typeof Marker>;
}

interface LocationData {
  id: string;
  name: string;
  geo: {
    latitude: number;
    longitude: number;
  };
  address?: {
    id: string;
    street: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
  } | null;
  sports: Array<string>;
}

interface MapContextType {
  mapRef: React.RefObject<MapView>;
  markerRefs: React.MutableRefObject<MarkerRef[]>;
  addMarkerRef: (id: string, ref: React.RefObject<typeof Marker>) => void;
  removeMarkerRef: (id: string) => void;
  showMarkerCallout: (id: string) => void;
  hideMarkerCallout: (id: string) => void;
  animateToLocation: (latitude: number, longitude: number) => void;
  zoomOut: (multiplier?: number) => void;
  focusedMarkerId: string | null;
  setFocusedMarkerId: (id: string | null) => void;
  currentRegion: Region | null;
  onRegionChange: (region: Region) => void;
  locations: LocationData[];
  setLocations: (locations: LocationData[]) => void;
}

const MapContext = createContext<MapContextType | null>(null);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<MarkerRef[]>([]);
  const [focusedMarkerId, setFocusedMarkerId] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);

  const addMarkerRef = useCallback(
    (id: string, ref: React.RefObject<typeof Marker>) => {
      // Remove existing ref if it exists
      markerRefs.current = markerRefs.current.filter((m) => m.id !== id);
      // Add new ref
      markerRefs.current.push({ id, ref });
    },
    [],
  );

  const removeMarkerRef = useCallback((id: string) => {
    markerRefs.current = markerRefs.current.filter((m) => m.id !== id);
  }, []);

  const showMarkerCallout = useCallback((id: string) => {
    const markerRef = markerRefs.current.find((m) => m.id === id);
    if (markerRef?.ref.current) {
      (markerRef.ref.current as any).showCallout();
    }
  }, []);

  const hideMarkerCallout = useCallback((id: string) => {
    const markerRef = markerRefs.current.find((m) => m.id === id);
    if (markerRef?.ref.current) {
      (markerRef.ref.current as any).hideCallout();
    }
  }, []);

  const animateToLocation = useCallback(
    (latitude: number, longitude: number) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    },
    [],
  );

  const onRegionChange = useCallback((region: Region) => {
    const roundedRegion = roundRegionForCaching(region);
    setCurrentRegion(roundedRegion);
  }, []);

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
        markerRefs,
        addMarkerRef,
        removeMarkerRef,
        showMarkerCallout,
        hideMarkerCallout,
        animateToLocation,
        zoomOut,
        focusedMarkerId,
        setFocusedMarkerId,
        currentRegion,
        onRegionChange,
        locations,
        setLocations,
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
