export const brand = {
  "@type": "Brand",
  name: "Rec Sports",
  description:
    "Rec Sports is a mobile and web app that connects you with sports communities and activities.",
  url: "https://www.recsports.app",
  sameAs: [
    "https://bsky.app/profile/recsportsapp.bsky.social/",
    "https://www.facebook.com/recsportsapp/",
    "https://www.instagram.com/recsportsapp/",
    "https://www.linkedin.com/showcase/recsportsapp/",
    "https://www.pinterest.com/recsportsapp/",
    "https://www.threads.net/@recsportsapp",
    "https://www.tiktok.com/@recsportsapp",
    "https://x.com/recsportsapp",
    "https://twitter.com/recsportsapp",
    "https://www.youtube.com/@recsportsapp",
  ],
  parentOrganization: {
    "@type": "Organization",
    name: "Parent Company Name",
    url: "https://www.parentcompany.com",
  },
};

export const publisher = {
  "@type": "Organization",
  name: "Day Moon Development",
  url: "https://daymoon.io",
  logo: "https://cdn.prod.website-files.com/65dcedec6bb43b8df7697530/65ddc7179bd10de82b536f9f_wordmark_vanilla.svg",
};

export const waitlistAction = {
  "@type": "RegisterAction",
  target: {
    "@type": "EntryPoint",
    urlTemplate: "https://www.recsports.app/#waitlist",
    actionPlatform: [
      "http://schema.org/DesktopWebPlatform",
      "http://schema.org/MobileWebPlatform",
    ],
  },
  name: "Join Waitlist",
  description: "Sign up for early access to Rec Sports",
};

export const isPartOf = {
  "@type": "WebSite",
  name: "Rec Sports",
  url: "https://www.recsports.app",
};

export const inLanguage = "en-US";

export function generateBreadcrumb(routes: { name: string; slug: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.recsports.app",
      },
      ...routes.map((route, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: route.name,
        item: `https://www.recsports.app/${route.slug}`,
      })),
    ],
  };
}

export const creator = [
  {
    "@type": "Person",
    name: "Caleb Panza",
    url: "https://daymoon.io",
    //   image: "https://yourwebsite.com/root/caleb.png", // todo
    jobTitle: "Co-founder",
  },
  {
    "@type": "Person",
    name: "Matthew Rothenberger",
    url: "https://daymoon.io",
    //   image: "https://yourwebsite.com/root/jared.png", // todo
    jobTitle: "Co-founder",
  },
];

export const spatialCoverage = {
  "@type": "Place",
  name: "United States",
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
};

export const aboutMobileApp = {
  "@type": "MobileApplication",
  name: "Rec Sports App",
  operatingSystem: "iOS, Android",
  applicationCategory: "Sports",
  url: "https://www.recsports.app",
  description:
    "A mobile app that helps you find local places to play sports with others.",
};

export const speakable = {
  "@type": "SpeakableSpecification",
  xpath: [
    "/html/head/title",
    "/html/head/meta[@name='description']",
    "/html/body/*[@data-speakable='true']",
  ],
};
