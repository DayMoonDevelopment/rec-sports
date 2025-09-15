import { Marker } from "react-native-maps";

interface LocationMarkerProps {
  id?: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onPress: () => void;
}

export function LocationMarker({ coordinate, onPress }: LocationMarkerProps) {
  return <Marker coordinate={coordinate} title="Location" onPress={onPress} />;
}
