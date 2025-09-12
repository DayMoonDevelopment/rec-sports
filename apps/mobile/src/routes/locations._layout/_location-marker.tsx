import { Marker } from "react-native-maps";

interface LocationMarkerProps {
  id?: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  markerRef: React.RefObject<any>;
  onPress: () => void;
}

export function LocationMarker({
  coordinate,
  markerRef,
  onPress,
}: LocationMarkerProps) {
  return (
    <Marker
      ref={markerRef}
      coordinate={coordinate}
      title="Location"
      onPress={onPress}
    />
  );
}
