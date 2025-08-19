import startCase from "lodash/startCase";

import { SportFacilityType } from "~/lib/global.types";
import {
  aboutMobileApp,
  brand,
  creator,
  generateBreadcrumb,
  inLanguage,
  isPartOf,
  publisher,
  speakable,
  waitlistAction,
} from "~/lib/schema";

import type { MetaArgs } from "react-router";

export function meta({ params }: MetaArgs) {
  const city = startCase(params.city || "");
  const state = startCase(params.state || "");
  const sport = params.sport || "";
  const facilityType =
    SportFacilityType[sport as keyof typeof SportFacilityType];

  const locationString = city && state ? `${city}, ${state}` : "your community";
  const url = `https://www.recsports.app/${params.sport}/${params.state}/${params.city}`;
  const image = `https://www.recsports.app/sport/og-${sport}.png`;
  const keywords = `${sport} games in ${city} ${state}, local ${sport} activities, ${sport} in ${city}, ${sport} ${facilityType} locator ${city} ${state}, recreational ${sport} games in ${city}, find ${facilityType}s in ${city}, ${sport} pickup games ${city}, ${facilityType} availability ${state}, play ${sport} ${city}, ${sport} groups ${city}, find open ${facilityType}s ${state}, avoid crowded ${facilityType}s ${city}, play ${sport} without a team ${state}, up-to-date ${facilityType}s ${city}, check ${facilityType} availability ${state}, meet players for ${sport} in ${city}, join local ${sport} groups ${state}, find teammates for ${sport} ${city}, real-time ${facilityType} availability ${state}, live ${facilityType} updates ${city}, ${facilityType}s with lights for night games ${state}, rate ${facilityType}s ${city}, contribute ${facilityType} updates ${state}, report issues at ${facilityType}s ${city}`;

  return [
    // Config
    {
      tagName: "link",
      rel: "canonical",
      href: url,
    },
    {
      name: "robots",
      content: "index, follow",
    },
    // General meta tags
    {
      title: `Rec Sports – Find the Best ${startCase(
        facilityType,
      )} to Play ${startCase(sport)} in ${locationString}`,
    },
    {
      name: "description",
      content: `Discover local ${facilityType}s in ${locationString} and connect with players in the area. Get updated locations, availability, and join pickup ${sport} games effortlessly. Get started now!`,
    },
    {
      name: "keywords",
      content: keywords,
    },
    // Open Graph
    {
      property: "og:title",
      content: `Rec Sports – Your ${startCase(sport)} Hub in ${locationString}`,
    },
    {
      property: "og:description",
      content: `Explore and play ${sport} in ${locationString}. Get updated information on ${facilityType}s, availability, and more with Rec. Join the waitlist now!`,
    },
    {
      property: "og:url",
      content: url,
    },
    {
      property: "og:image",
      content: image,
    },
    {
      property: "og:image:alt",
      content: `Rec Sports helps you find the best ${facilityType}s to play ${sport} in ${locationString}`,
    },
    // Twitter
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:url",
      content: url,
    },
    {
      property: "twitter:title",
      content: `Rec Sports – Find ${startCase(
        sport,
      )} ${facilityType}s in ${locationString}`,
    },
    {
      property: "twitter:description",
      content: `Join Rec to explore ${sport} ${facilityType}s in ${locationString} and connect with other players. Real-time updates, user reviews, and community alerts. Get started today!`,
    },
    {
      property: "twitter:image",
      content: image,
    },
    {
      property: "twitter:image:alt",
      content: `Rec Sports helps you find the best ${facilityType}s to play ${sport} in ${locationString}`,
    },
    // Schema
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Find ${startCase(sport)} ${startCase(
          facilityType,
        )}s in ${locationString} - Rec Sports`,
        description: `Stay updated on ${sport} ${facilityType}s in ${locationString} and connect with others in your community with Rec.`,
        keywords,
        publisher,
        url,
        brand,
        isPartOf,
        inLanguage,
        spatialCoverage: {
          "@type": "Place",
          name: "United States",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
            addressLocality: city,
            addressRegion: state,
          },
        },
        potentialAction: waitlistAction,
        accessibilityFeature: "fullTextAlternative",
        accessibilityHazard: "noFlashingHazard",
        about: [
          aboutMobileApp,
          {
            "@type": "Thing",
            name: startCase(sport),
          },
          {
            "@type": "Thing",
            name: "Recreational Sports",
          },
          {
            "@type": "Thing",
            name: "Intramural Sports",
          },
        ],
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: image,
          width: 1200,
          height: 630,
        },
        breadcrumb: generateBreadcrumb([
          {
            name: startCase(sport),
            slug: sport,
          },
          {
            name: `${city}, ${state}`,
            slug: `${sport}/${state}/${city}`,
          },
        ]),
        speakable,
        audience: {
          "@type": "Audience",
          audienceType: [
            `${startCase(sport)} Players in ${locationString}`,
            "Coaches",
            "Sports Enthusiasts",
            "Recreational Sports Athletes",
            "Intramural Sports Athletes",
          ],
          geographicArea: {
            "@type": "Place",
            name: "United States",
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
              addressLocality: city,
              addressRegion: state,
            },
          },
        },
        creator,
        datePublished: "2024-11-18",
        dateModified: new Date().toISOString().split("T")[0],
      },
    },
  ];
}
