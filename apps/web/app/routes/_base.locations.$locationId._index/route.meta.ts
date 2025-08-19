import { generateDescription, generateLocationSchema } from "./schema";

import type { LocationData } from "./route.loader";
import type { MetaFunction } from "react-router";

interface RouteData {
  location: LocationData;
}

export const meta: MetaFunction<typeof import("./route.loader").loader> = ({
  data,
  params,
}) => {
  if (!data?.location) {
    return [
      { title: "Location Not Found | Rec Sports" },
      {
        name: "description",
        content: "The requested location could not be found.",
      },
    ];
  }

  const { location } = data as RouteData;

  if (!params.locationId) {
    throw new Error("Location ID is required");
  }

  const context = { location, locationId: params.locationId };
  const title = `${location.name} | Rec Sports`;
  const sportsText = location.sportTypes.join(", ");
  const schemaDescription = generateDescription(context);
  const description = `${schemaDescription}${location.description ? ` ${location.description}` : ""}${location.rating && location.totalReviews ? ` Rated ${location.rating}/5 stars with ${location.totalReviews} reviews.` : ""}`;

  // Generate dynamic OG image URL
  const ogImageUrl = `https://recsports.app/locations/${params.locationId}/og.png`;

  // Generate structured data JSON-LD using schema utilities
  const structuredData = generateLocationSchema(context);

  // Add image to structured data
  structuredData.image = ogImageUrl;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content: `${location.name}, ${location.city}, ${location.state}, sports facility, ${sportsText}, recreation, athletics${location.amenities ? `, ${location.amenities.join(", ")}` : ""}`,
    },

    // Open Graph tags
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "business.business" },
    {
      property: "og:url",
      content: `https://recsports.app/locations/${params.locationId}`,
    },
    { property: "og:site_name", content: "Rec Sports" },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    {
      property: "og:image:alt",
      content: `${location.name} - ${location.city}, ${location.state} - ${sportsText}`,
    },

    // Business-specific Open Graph tags
    {
      property: "business:contact_data:street_address",
      content: location.address,
    },
    { property: "business:contact_data:locality", content: location.city },
    { property: "business:contact_data:region", content: location.state },
    {
      property: "business:contact_data:postal_code",
      content: location.zipCode,
    },
    ...(location.phone
      ? [
          {
            property: "business:contact_data:phone_number",
            content: location.phone,
          },
        ]
      : []),
    ...(location.website
      ? [
          {
            property: "business:contact_data:website",
            content: location.website,
          },
        ]
      : []),

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImageUrl },
    {
      name: "twitter:image:alt",
      content: `${location.name} - ${location.city}, ${location.state} - ${sportsText}`,
    },

    // Additional SEO tags
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Rec Sports" },
    { property: "article:author", content: "Rec Sports" },

    // Local business schema hints
    { name: "geo.placename", content: `${location.city}, ${location.state}` },
    { name: "geo.region", content: location.state },
    { name: "ICBM", content: `${location.latitude},${location.longitude}` },

    // Canonical URL
    {
      tagName: "link",
      rel: "canonical",
      href: `https://recsports.app/locations/${params.locationId}`,
    },

    // JSON-LD Structured Data
    {
      tagName: "script",
      type: "application/ld+json",
      children: JSON.stringify(structuredData),
    },
  ];
};
