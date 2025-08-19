import type { PropertyValue, SchemaContext } from "./types";

export function generateSportTypes(context: SchemaContext): PropertyValue[] | undefined {
  const { location } = context;
  
  if (!location.sportTypes || location.sportTypes.length === 0) {
    return undefined;
  }

  return location.sportTypes.map(sport => ({
    "@type": "PropertyValue",
    name: "Sport Type",
    value: sport
  }));
}