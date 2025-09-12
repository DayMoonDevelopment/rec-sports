import { View } from "react-native";
import { Marker } from "react-native-maps";
import { cva } from "class-variance-authority";

import { sportLabel } from "~/lib/utils";

import { SportIcon } from "~/components/sport-icon";

import { Sport } from "~/gql/types";

interface SportMarkerProps {
  id?: string;
  sport: Sport;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  markerRef: React.RefObject<any>;
}

const markerStyles = cva(
  "size-10 items-center justify-center rounded-full border-2 border-background shadow",
  {
    variants: {
      sport: {
        [Sport.Baseball]: "bg-sport-baseball",
        [Sport.Kickball]: "bg-sport-kickball",
        [Sport.Basketball]: "bg-sport-basketball",
        [Sport.Pickleball]: "bg-sport-pickleball",
        [Sport.Tennis]: "bg-sport-tennis",
        [Sport.Golf]: "bg-sport-golf",
        [Sport.DiscGolf]: "bg-sport-disc-golf",
        [Sport.Hockey]: "bg-sport-hockey",
        [Sport.Softball]: "bg-sport-softball",
        [Sport.Soccer]: "bg-sport-soccer",
        [Sport.Football]: "bg-sport-football",
        [Sport.Volleyball]: "bg-sport-volleyball",
        [Sport.Ultimate]: "bg-sport-ultimate",
        default: "bg-foreground",
      },
    },
    defaultVariants: {
      sport: "default",
    },
  },
);

export function SportMarker({
  sport,
  coordinate,
  markerRef,
}: SportMarkerProps) {
  const title = `${sportLabel(sport)} facility`;

  return (
    <Marker ref={markerRef} coordinate={coordinate} title={title}>
      <View className={markerStyles({ sport })}>
        <SportIcon sport={sport} className="text-background size-6" />
      </View>
    </Marker>
  );
}
