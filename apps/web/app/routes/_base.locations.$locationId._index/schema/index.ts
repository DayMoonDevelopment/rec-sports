import { generateAddress } from "./address";
import { generateAggregateRating } from "./aggregate-rating";
import { generateAmenityFeatures } from "./amenity-features";
import { generateDescription } from "./description";
import { generateGeoCoordinates } from "./geo-coordinates";
import { generateOpeningHours } from "./opening-hours";
import { generateSportTypes } from "./sport-types";

import type { SchemaContext, SportsActivityLocationSchema } from "./types";

export function generateLocationSchema(context: SchemaContext): SportsActivityLocationSchema {
  const { location } = context;

  const schema: SportsActivityLocationSchema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: location.name,
    description: generateDescription(context),
    address: generateAddress(context),
    geo: generateGeoCoordinates(context)
  };

  // Add optional properties only if they exist
  const telephone = location.phone;
  if (telephone) {
    schema.telephone = telephone;
  }

  const url = location.website;
  if (url) {
    schema.url = url;
  }

  const openingHours = generateOpeningHours(context);
  if (openingHours) {
    schema.openingHours = openingHours;
  }

  const aggregateRating = generateAggregateRating(context);
  if (aggregateRating) {
    schema.aggregateRating = aggregateRating;
  }

  const amenityFeature = generateAmenityFeatures(context);
  if (amenityFeature) {
    schema.amenityFeature = amenityFeature;
  }

  const additionalProperty = generateSportTypes(context);
  if (additionalProperty) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
}

// Re-export all utilities for direct access if needed
export { generateAddress } from "./address";
export { generateGeoCoordinates } from "./geo-coordinates";
export { generateOpeningHours } from "./opening-hours";
export { generateAggregateRating } from "./aggregate-rating";
export { generateAmenityFeatures } from "./amenity-features";
export { generateSportTypes } from "./sport-types";
export { generateDescription } from "./description";
export * from "./types";