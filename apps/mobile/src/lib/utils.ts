import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Sport } from "~/gql/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Sport enum value to a human-readable string label
 * @param sport - The Sport enum value
 * @param formatter - Optional function to format the string (e.g., capitalize, uppercase, etc.)
 * @returns The formatted sport label
 */
export function sportLabel(
  sport: Sport,
  formatter?: (label: string) => string,
): string {
  const labels: Record<Sport, string> = {
    [Sport.Baseball]: "Baseball",
    [Sport.Basketball]: "Basketball",
    [Sport.DiscGolf]: "Disc Golf",
    [Sport.Football]: "Football",
    [Sport.Golf]: "Golf",
    [Sport.Hockey]: "Hockey",
    [Sport.Kickball]: "Kickball",
    [Sport.Pickleball]: "Pickleball",
    [Sport.Soccer]: "Soccer",
    [Sport.Softball]: "Softball",
    [Sport.Tennis]: "Tennis",
    [Sport.Ultimate]: "Ultimate",
    [Sport.Volleyball]: "Volleyball",
  };

  const label = labels[sport];
  return formatter ? formatter(label) : label;
}
