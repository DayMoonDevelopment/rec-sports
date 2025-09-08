import { Sport } from "~/gql/types";

export type ScoreType = {
  actionKey: string;
  label: string;
  value: number;
};

export type SportScoringConfig = {
  scoreTypes: ScoreType[];
  addScoreButtonLabel: string;
  defaultScoreType?: string;
};

const sportConfigs: Record<Sport, SportScoringConfig> = {
  [Sport.Football]: {
    scoreTypes: [
      { actionKey: "TOUCHDOWN", label: "Touchdown", value: 6 },
      {
        actionKey: "TOUCHDOWN_CONVERSION",
        label: "Touchdown + Extra Point",
        value: 7,
      },
      { actionKey: "EXTRA_POINT", label: "Extra Point", value: 1 },
      { actionKey: "FIELD_GOAL", label: "Field Goal", value: 3 },
      { actionKey: "SAFETY", label: "Safety", value: 2 },
    ],
    addScoreButtonLabel: "Add Score",
  },
  [Sport.Basketball]: {
    scoreTypes: [
      { actionKey: "FREE_THROW", label: "Free Throw", value: 1 },
      { actionKey: "FIELD_GOAL", label: "2-pointer", value: 2 },
      { actionKey: "THREE_POINTER", label: "3-pointer", value: 3 },
    ],
    addScoreButtonLabel: "Add Score",
  },
  [Sport.Baseball]: {
    scoreTypes: [{ actionKey: "RUN", label: "Run", value: 1 }],
    addScoreButtonLabel: "Add Run",
    defaultScoreType: "RUN",
  },
  [Sport.Softball]: {
    scoreTypes: [{ actionKey: "RUN", label: "Run", value: 1 }],
    addScoreButtonLabel: "Add Run",
    defaultScoreType: "RUN",
  },
  [Sport.Soccer]: {
    scoreTypes: [{ actionKey: "GOAL", label: "Goal", value: 1 }],
    addScoreButtonLabel: "Add Goal",
    defaultScoreType: "GOAL",
  },
  [Sport.Hockey]: {
    scoreTypes: [{ actionKey: "GOAL", label: "Goal", value: 1 }],
    addScoreButtonLabel: "Add Goal",
    defaultScoreType: "GOAL",
  },
  [Sport.Tennis]: {
    scoreTypes: [{ actionKey: "POINT", label: "Point", value: 1 }],
    addScoreButtonLabel: "Add Point",
    defaultScoreType: "POINT",
  },
  [Sport.Volleyball]: {
    scoreTypes: [{ actionKey: "POINT", label: "Point", value: 1 }],
    addScoreButtonLabel: "Add Point",
    defaultScoreType: "POINT",
  },
  [Sport.Pickleball]: {
    scoreTypes: [{ actionKey: "POINT", label: "Point", value: 1 }],
    addScoreButtonLabel: "Add Point",
    defaultScoreType: "POINT",
  },
  [Sport.Ultimate]: {
    scoreTypes: [{ actionKey: "POINT", label: "Point", value: 1 }],
    addScoreButtonLabel: "Add Point",
    defaultScoreType: "POINT",
  },
  [Sport.Kickball]: {
    scoreTypes: [{ actionKey: "RUN", label: "Run", value: 1 }],
    addScoreButtonLabel: "Add Run",
    defaultScoreType: "RUN",
  },
  [Sport.DiscGolf]: {
    scoreTypes: [{ actionKey: "STROKE", label: "Stroke", value: 1 }],
    addScoreButtonLabel: "Add Stroke",
    defaultScoreType: "STROKE",
  },
  [Sport.Golf]: {
    scoreTypes: [{ actionKey: "STROKE", label: "Stroke", value: 1 }],
    addScoreButtonLabel: "Add Stroke",
    defaultScoreType: "STROKE",
  },
};

export function getSportScoringConfig(sport: Sport): SportScoringConfig {
  return (
    sportConfigs[sport] || {
      scoreTypes: [{ actionKey: "POINT", label: "Point", value: 1 }],
      addScoreButtonLabel: "Add Score",
      defaultScoreType: "POINT",
    }
  );
}

export function getDefaultScoreType(sport: Sport): ScoreType {
  const config = getSportScoringConfig(sport);
  const defaultKey = config.defaultScoreType;

  if (defaultKey) {
    return (
      config.scoreTypes.find((type) => type.actionKey === defaultKey) ||
      config.scoreTypes[0]
    );
  }

  return config.scoreTypes[0];
}

export function hasMultipleScoreTypes(sport: Sport): boolean {
  return getSportScoringConfig(sport).scoreTypes.length > 1;
}
