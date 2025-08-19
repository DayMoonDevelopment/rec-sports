import type { LocationFeatureSpecification, SchemaContext } from "./types";

export function generateAmenityFeatures(context: SchemaContext): LocationFeatureSpecification[] | undefined {
  const { location } = context;
  
  if (!location.amenities || location.amenities.length === 0) {
    return undefined;
  }

  return location.amenities.map(amenity => ({
    "@type": "LocationFeatureSpecification",
    name: amenity
  }));
}