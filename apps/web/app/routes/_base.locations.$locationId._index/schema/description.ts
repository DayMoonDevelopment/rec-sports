import type { SchemaContext } from "./types";

export function generateDescription(context: SchemaContext): string {
  const { location } = context;
  const sportsText = location.sportTypes.join(", ");
  
  return `Play ${sportsText} at ${location.name} in ${location.city}, ${location.state}.`;
}