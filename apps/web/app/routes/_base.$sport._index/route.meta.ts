import upperFirst from "lodash/upperFirst";

import { SportFacilityType } from "~/lib/global.types";
import {
  aboutMobileApp,
  brand,
  creator,
  generateBreadcrumb,
  inLanguage,
  isPartOf,
  publisher,
  spatialCoverage,
  speakable,
  waitlistAction,
} from "~/lib/schema";

import type { MetaFunction } from "react-router";

export const meta: MetaFunction = ({ params }) => {
  const sport = params.sport || "";
  const facilityType =
    SportFacilityType[sport as keyof typeof SportFacilityType];

  const url = `https://www.recsports.app/${params.sport}`;
  const image = `https://www.recsports.app/sport/og-${sport}.png`;
  const keywords = `${sport} games, local ${sport} activities, community ${sport} hub, ${sport} ${facilityType} locator, ${facilityType} locator, recreational ${sport} games, find ${facilityType}s, ${sport} pickup games, ${facilityType} availability, play ${sport}, ${sport} groups, find open ${facilityType}s, avoid crowded ${facilityType}s, play ${sport} without a team, up-to-date ${facilityType}s, check ${facilityType} availability, meet players for ${sport}, join local ${sport} groups, find teammates for ${sport}, real-time ${facilityType} availability, live ${facilityType} updates, ${facilityType}s with lights for night games, rate ${facilityType}s, contribute ${facilityType} updates, report issues at ${facilityType}s`;

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
      title: `Rec Sports – Find the Best ${upperFirst(
        facilityType,
      )} to Play ${upperFirst(sport)} in Your Community`,
    },
    {
      name: "description",
      content: `Discover local ${facilityType}s and connect with players in your area. Get updated locations, availability, and join pickup ${sport} games effortlessly. Get started now!`,
    },
    {
      name: "keywords",
      content: keywords,
    },
    // Open Graph
    {
      property: "og:title",
      content: `Rec Sports – Your Community ${upperFirst(sport)} Hub`,
    },
    {
      property: "og:description",
      content: `Explore and play ${sport} in your community with ease. Get updated information on ${facilityType}s, availability, and more with Rec. Join the waitlist now!`,
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
      content: `Rec Sports helps you find the best ${facilityType}s to play ${sport} in your community`,
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
      content: `Rec Sports – Find ${upperFirst(
        sport,
      )} ${facilityType}s in Your Community`,
    },
    {
      property: "twitter:description",
      content: `Join Rec to explore ${sport} ${facilityType}s and connect with other players. Real-time updates, user reviews, and community alerts. Get started today!`,
    },
    {
      property: "twitter:image",
      content: image,
    },
    {
      property: "twitter:image:alt",
      content: `Rec Sports helps you find the best ${facilityType}s to play ${sport} in your community`,
    },
    // Schema
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Find Local ${upperFirst(sport)} ${upperFirst(
          facilityType,
        )}s - Rec Sports`,
        description: `Stay updated on ${sport} ${facilityType}s and connect with others in your community with Rec.`,
        keywords,
        publisher,
        brand,
        url,
        isPartOf,
        inLanguage,
        spatialCoverage,
        potentialAction: waitlistAction,
        accessibilityFeature: "fullTextAlternative",
        accessibilityHazard: "noFlashingHazard",
        about: [
          aboutMobileApp,
          {
            "@type": "Thing",
            name: upperFirst(sport),
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
            name: upperFirst(sport),
            slug: sport,
          },
        ]),
        speakable,
        audience: {
          "@type": "Audience",
          audienceType: [
            `${upperFirst(sport)} Players`,
            "Coaches",
            "Sports Enthusiasts",
            "Recreational Sports Athletes",
            "Intramural Sports Athletes",
          ],
          geographicArea: {
            "@type": "AdministrativeArea",
            name: "United States",
          },
        },
        creator,
        datePublished: "2024-11-18",
        dateModified: new Date().toISOString().split("T")[0],
      },
    },
  ];
};
