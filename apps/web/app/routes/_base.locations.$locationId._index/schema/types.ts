import type { LocationData } from "../../route.loader";

export interface SchemaContext {
  location: LocationData;
  locationId: string;
}

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
}

export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export interface AggregateRating {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export interface LocationFeatureSpecification {
  "@type": "LocationFeatureSpecification";
  name: string;
}

export interface PropertyValue {
  "@type": "PropertyValue";
  name: string;
  value: string;
}

export interface SportsActivityLocationSchema {
  "@context": "https://schema.org";
  "@type": "SportsActivityLocation";
  name: string;
  description: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
  telephone?: string;
  url?: string;
  image?: string;
  openingHours?: string[];
  aggregateRating?: AggregateRating;
  amenityFeature?: LocationFeatureSpecification[];
  additionalProperty?: PropertyValue[];
}