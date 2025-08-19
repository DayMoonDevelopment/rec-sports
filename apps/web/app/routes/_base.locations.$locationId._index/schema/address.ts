import type { PostalAddress, SchemaContext } from "./types";

export function generateAddress(context: SchemaContext): PostalAddress {
  const { location } = context;
  
  return {
    "@type": "PostalAddress",
    streetAddress: location.address,
    addressLocality: location.city,
    addressRegion: location.state,
    postalCode: location.zipCode
  };
}