import type { AggregateRating, SchemaContext } from "./types";

export function generateAggregateRating(context: SchemaContext): AggregateRating | undefined {
  const { location } = context;
  
  if (!location.rating || !location.totalReviews) {
    return undefined;
  }

  return {
    "@type": "AggregateRating",
    ratingValue: location.rating,
    reviewCount: location.totalReviews,
    bestRating: 5,
    worstRating: 1
  };
}