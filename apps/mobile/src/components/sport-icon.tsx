import { cn } from "~/lib/utils";

import { Sport } from "~/gql/types";

import type { SvgProps } from "react-native-svg";

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

export function SportIcon({
  sport,
  className,
  ...props
}: SvgProps & { sport: Sport }) {
  switch (sport) {
    case Sport.Baseball:
      return (
        <BaseballIcon
          className={cn("text-sport-baseball", className)}
          {...props}
        />
      );
    case Sport.Basketball:
      return (
        <BasketballIcon
          className={cn("text-sport-basketball", className)}
          {...props}
        />
      );
    case Sport.DiscGolf:
      return (
        <DiscGolfIcon
          filled
          className={cn("text-sport-disc-golf", className)}
          {...props}
        />
      );
    case Sport.Football:
      return (
        <FootballIcon
          filled
          className={cn("text-sport-football", className)}
          {...props}
        />
      );
    case Sport.Golf:
      return (
        <GolfIcon className={cn("text-sport-golf", className)} {...props} />
      );
    case Sport.Hockey:
      return (
        <HockeyIcon className={cn("text-sport-hockey", className)} {...props} />
      );
    case Sport.Kickball:
      return (
        <KickballIcon
          filled
          className={cn("text-sport-kickball", className)}
          {...props}
        />
      );
    case Sport.Pickleball:
      return (
        <PickleballIcon
          className={cn("text-sport-pickleball", className)}
          {...props}
        />
      );
    case Sport.Soccer:
      return (
        <SoccerIcon
          filled
          className={cn("text-sport-soccer", className)}
          {...props}
        />
      );
    case Sport.Softball:
      return (
        <SoftballIcon
          filled
          className={cn("text-sport-softball", className)}
          {...props}
        />
      );
    case Sport.Tennis:
      return (
        <TennisIcon className={cn("text-sport-tennis", className)} {...props} />
      );
    case Sport.Ultimate:
      return (
        <DiscIcon
          filled
          className={cn("text-sport-ultimate", className)}
          {...props}
        />
      );
    case Sport.Volleyball:
      return (
        <VolleyballIcon
          className={cn("text-sport-volleyball", className)}
          {...props}
        />
      );
    default:
      return <CircleIcon {...props} />;
  }
}
