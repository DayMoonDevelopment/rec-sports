import {
  brand,
  publisher,
  waitlistAction,
  isPartOf,
  inLanguage,
  generateBreadcrumb,
  creator,
  spatialCoverage,
  aboutMobileApp,
  speakable,
} from "~/lib/schema";

import type { MetaFunction } from "react-router";


export const meta: MetaFunction = () => {
  return [
    // Config
    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.recsports.app",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    // General meta tags
    {
      title:
        "Rec Sports – Find the Best Spots to Play Sports in Your Community",
    },
    {
      name: "description",
      content:
        "Discover local sports amenities and connect with players in your area. Get updated locations, availability, and join pickup games effortlessly. Get started now!",
    },
    {
      name: "keywords",
      content:
        "pickup games, local sports activities, community sports hub, sports amenities locator, recreational sports games, find sports facilities, soccer pickup games, basketball courts, tennis court availability, pickleball games, baseball fields, football pickup games, volleyball nets, ultimate frisbee groups, softball leagues, kickball games, find open sports courts, avoid crowded sports fields, play sports without a team, up-to-date sports amenities, check sports field availability, meet players for pickup games, join local sports groups, find teammates for sports, real-time sports court availability, live sports field updates, sports facilities with lights for night games, rate sports locations, contribute sports location updates, report issues at sports facilities",
    },
    // Open Graph
    {
      property: "og:title",
      content: "Rec Sports – Your Community Sports Hub",
    },
    {
      property: "og:description",
      content:
        "Explore and play sports in your community with ease. Get updated information on locations, availability, and more with Rec. Join the waitlist now!",
    },
    {
      property: "og:url",
      content: "https://www.recsports.app",
    },
    {
      property: "og:image",
      content: "https://www.recsports.app/meta/og_image.png",
    },
    {
      property: "og:image:alt",
      content:
        "Rec Sports helps you find the best spots to play sports in your community",
    },
    // Twitter
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:site",
      content: "https://www.recsports.app",
    },
    {
      property: "twitter:title",
      content: "Rec Sports – Find Sports Locations in Your Community",
    },
    {
      property: "twitter:description",
      content:
        "Join Rec to explore and connect with sports facilities and players. Real-time updates, user reviews, and community alerts. Get started today!",
    },
    {
      property: "twitter:image",
      content: "https://www.recsports.app/meta/og_image.png",
    },
    {
      property: "twitter:image:alt",
      content:
        "Rec Sports helps you find the best spots to play sports in your community",
    },
    // Schema
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Rec Sports",
        description:
          "Find sports locations, connect with players, and stay updated on community sports facilities with Rec.",
        brand,
        publisher,
        isPartOf,
        inLanguage,
        generateBreadcrumb,
        creator,
        spatialCoverage,
        aboutMobileApp,
        speakable,
        potentialAction: waitlistAction,
        image: "https://www.recsports.app/meta/og_image.png",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://www.recsports.app",
        },
        about: {
          "@type": "Thing",
          name: "Community Sports Hub",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: "https://www.recsports.app/meta/og_image.png",
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://www.recsports.app",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Join Waitlist",
              item: "https://www.recsports.app/#waitlist",
            },
          ],
        },
        audience: {
          "@type": "Audience",
          audienceType: "Recreational Sports Enthusiasts",
          geographicArea: {
            "@type": "AdministrativeArea",
            name: "United States",
          },
        },
        datePublished: "2024-11-18",
        dateModified: new Date().toISOString().split("T")[0],
        keywords: [
          "pickup games",
          "local sports activities",
          "community sports hub",
          "soccer",
          "basketball",
          "tennis",
          "pickleball",
          "baseball",
          "football",
          "volleyball",
          "ultimate frisbee",
          "softball",
          "kickball",
          "sports facilities",
        ],
      },
    },
  ];
};
