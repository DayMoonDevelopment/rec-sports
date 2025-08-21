import { Sport } from "@rec/types";

import type { Svg, SvgProps } from "react-native-svg";

import { BaseballIcon } from "../icons/baseball";
import { BasketballIcon } from "../icons/basketball";
import { DiscGolfIcon } from "../icons/disc-golf";
import { FootballIcon } from "../icons/football";
import { GolfIcon } from "../icons/golf";
import { HockeyIcon } from "../icons/hockey";
import { KickballIcon } from "../icons/kickball";
import { PickleballIcon } from "../icons/pickleball";
import { SoccerIcon } from "../icons/soccer";
import { SoftballIcon } from "../icons/softball";
import { TennisIcon } from "../icons/tennis";
import { DiscIcon } from "../icons/disc";
import { VolleyballIcon } from "../icons/volleyball";

import { CircleIcon } from "../icons/circle";

export function SportIcon({ sport, ...props }: SvgProps & { sport: Sport }) {
  switch (sport) {
    case Sport.Baseball:
      return <BaseballIcon {...props} />;
    case Sport.Basketball:
      return <BasketballIcon {...props} />;
    case Sport.DiscGolf:
      return <DiscGolfIcon filled {...props} />;
    case Sport.Football:
      return <FootballIcon filled {...props} />;
    case Sport.Golf:
      return <GolfIcon {...props} />;
    case Sport.Hockey:
      return <HockeyIcon {...props} />;
    case Sport.Kickball:
      return <KickballIcon filled {...props} />;
    case Sport.Pickleball:
      return <PickleballIcon {...props} />;
    case Sport.Soccer:
      return <SoccerIcon filled {...props} />;
    case Sport.Softball:
      return <SoftballIcon filled {...props} />;
    case Sport.Tennis:
      return <TennisIcon {...props} />;
    case Sport.Ultimate:
      return <DiscIcon filled {...props} />;
    case Sport.Volleyball:
      return <VolleyballIcon {...props} />;
    default:
      return <CircleIcon {...props} />;
  }
}
