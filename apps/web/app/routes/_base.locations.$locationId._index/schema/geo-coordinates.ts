import type { GeoCoordinates, SchemaContext } from "./types";

export function generateGeoCoordinates(context: SchemaContext): GeoCoordinates {
  const { location } = context;
  
  return {
    "@type": "GeoCoordinates",
    latitude: location.latitude,
    longitude: location.longitude
  };
}