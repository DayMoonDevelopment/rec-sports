import { createContext, useContext, useRef, ReactNode, useCallback } from "react";
import MapView, { Marker } from "react-native-maps";

interface MarkerRef {
  id: string;
  ref: React.RefObject<Marker>;
}

interface MapContextType {
  mapRef: React.RefObject<MapView>;
  markerRefs: React.MutableRefObject<MarkerRef[]>;
  addMarkerRef: (id: string, ref: React.RefObject<Marker>) => void;
  removeMarkerRef: (id: string) => void;
  showMarkerCallout: (id: string) => void;
}

const MapContext = createContext<MapContextType | null>(null);

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<MarkerRef[]>([]);

  const addMarkerRef = useCallback((id: string, ref: React.RefObject<Marker>) => {
    // Remove existing ref if it exists
    markerRefs.current = markerRefs.current.filter(m => m.id !== id);
    // Add new ref
    markerRefs.current.push({ id, ref });
  }, []);

  const removeMarkerRef = useCallback((id: string) => {
    markerRefs.current = markerRefs.current.filter(m => m.id !== id);
  }, []);

  const showMarkerCallout = useCallback((id: string) => {
    const markerRef = markerRefs.current.find(m => m.id === id);
    if (markerRef?.ref.current) {
      markerRef.ref.current.showCallout();
    }
  }, []);

  return (
    <MapContext.Provider value={{ mapRef, markerRefs, addMarkerRef, removeMarkerRef, showMarkerCallout }}>
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