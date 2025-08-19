// Map sport names to badge file names
export const SPORT_BADGE_MAP: Record<string, string> = {
  Baseball: "baseball.png",
  Basketball: "basketball.png",
  Football: "football.png",
  "Frisbee Golf": "frisbee-golf.png",
  Golf: "golf.png",
  Hockey: "hockey.png",
  Kickball: "kickball.png",
  Pickleball: "pickleball.png",
  Soccer: "soccer.png",
  Softball: "softball.png",
  Tennis: "tennis.png",
  "Ultimate Frisbee": "ultimate-frisbee.png",
  Volleyball: "volleyball.png",
};

// Configuration for sport badge positioning
export const SPORT_BADGE_CONFIG = {
  spacing: 46, // Vertical spacing between badges
  rightMargin: 19, // Distance from right edge
  topMargin: 19, // Distance from top edge
} as const;

// Helper function to get available sports with badges
export function getAvailableSports(sportTypes: string[]): string[] {
  return sportTypes
    .filter((sport: string) => SPORT_BADGE_MAP[sport])
    .sort();
}