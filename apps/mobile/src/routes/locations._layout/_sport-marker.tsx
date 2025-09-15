import { Marker } from "react-native-maps";
import { cva } from "class-variance-authority";

import { sportLabel } from "~/lib/utils";

import { Sport } from "~/gql/types";

import tennisImg from "./assets/tennis.png";
import baseballImg from "./assets/baseball.png";
import basketballImg from "./assets/basketball.png";
import discGolfImg from "./assets/disc_golf.png";
import footballImg from "./assets/football.png";
import golfImg from "./assets/golf.png";
import hockeyImg from "./assets/hockey.png";
import kickballImg from "./assets/kickball.png";
import pickleballImg from "./assets/pickleball.png";
import soccerImg from "./assets/soccer.png";
import softballImg from "./assets/softball.png";
import ultimateImg from "./assets/ultimate.png";
import volleyballImg from "./assets/volleyball.png";
import defaultImg from "./assets/default.png";

interface SportMarkerProps {
  id?: string;
  sport: Sport;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

function getSportImage(sport: Sport) {
  switch (sport) {
    case Sport.Baseball:
      return baseballImg;
    case Sport.Basketball:
      return basketballImg;
    case Sport.DiscGolf:
      return discGolfImg;
    case Sport.Football:
      return footballImg;
    case Sport.Golf:
      return golfImg;
    case Sport.Hockey:
      return hockeyImg;
    case Sport.Kickball:
      return kickballImg;
    case Sport.Pickleball:
      return pickleballImg;
    case Sport.Soccer:
      return soccerImg;
    case Sport.Softball:
      return softballImg;
    case Sport.Tennis:
      return tennisImg;
    case Sport.Ultimate:
      return ultimateImg;
    case Sport.Volleyball:
      return volleyballImg;
    default:
      return defaultImg;
  }
}

export function SportMarker({ sport, coordinate }: SportMarkerProps) {
  const title = `${sportLabel(sport)} facility`;
  const sportImage = getSportImage(sport);

  return <Marker image={sportImage} coordinate={coordinate} title={title} />;
}
