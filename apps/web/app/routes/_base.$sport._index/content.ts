import { SportFacilityType } from "~/lib/global.types";

interface SportContent {
  hero: {
    headline: string;
    deck: string;
    imgSrc: string;
    imgAlt: string;
  };
  allSports: {
    headline: string;
    deck: string;
    items: {
      imgSrc: string;
      imgAlt: string;
      headline: string;
      slug: string;
    }[];
  };
  solution: {
    imgSrc: string;
    imgAlt: string;
    headline: string;
    overline: string;
    deck: string[];
    items: Array<{
      emoji: string;
      headline: string;
      deck: string;
    }>;
  };
  problem: {
    headline: string;
    items: Array<{
      headline: string;
      deck: string;
    }>;
  };
}

interface CreateContentProps {
  sport: string;
}

function createContent({ sport }: CreateContentProps): SportContent {
  const facilityType =
    SportFacilityType[
      sport.replace(" ", "-") as keyof typeof SportFacilityType
    ];

  return {
    hero: {
      headline: `Find the perfect spot to play ${sport} - anytime, anywhere`,
      deck: `Search your local community for ${facilityType}s to play and people to play with.`,
      imgSrc: `/sport/hero-${sport}.png`,
      imgAlt: `Use Rec to find the perfect spot to play ${sport}`,
    },
    allSports: {
      headline: `Want to play more than just ${sport}?`,
      deck: "Play any sport, anywhere, anytime.",
      items: [
        {
          imgSrc: "/sport/baseball.svg",
          imgAlt: "Play Baseball with Rec",
          headline: "Baseball",
          slug: "baseball",
        },
        {
          imgSrc: "/sport/basketball.svg",
          imgAlt: "Play Basketball with Rec",
          headline: "Basketball",
          slug: "basketball",
        },
        {
          imgSrc: "/sport/football.svg",
          imgAlt: "Play Football with Rec",
          headline: "Football",
          slug: "football",
        },
        {
          imgSrc: "/sport/kickball.svg",
          imgAlt: "Play Kickball with Rec",
          headline: "Kickball",
          slug: "kickball",
        },
        {
          imgSrc: "/sport/pickleball.svg",
          imgAlt: "Play Pickleball with Rec",
          headline: "Pickleball",
          slug: "pickleball",
        },
        {
          imgSrc: "/sport/tennis.svg",
          imgAlt: "Play Tennis with Rec",
          headline: "Tennis",
          slug: "tennis",
        },
        {
          imgSrc: "/sport/soccer.svg",
          imgAlt: "Play Soccer with Rec",
          headline: "Soccer",
          slug: "soccer",
        },
        {
          imgSrc: "/sport/softball.svg",
          imgAlt: "Play Softball with Rec",
          headline: "Softball",
          slug: "softball",
        },
        {
          imgSrc: "/sport/ultimate-frisbee.svg",
          imgAlt: "Play Ultimate Frisbee with Rec",
          headline: "Ultimate Frisbee",
          slug: "ultimate-frisbee",
        },
        {
          imgSrc: "/sport/volleyball.svg",
          imgAlt: "Play Volleyball with Rec",
          headline: "Volleyball",
          slug: "volleyball",
        },
      ],
    },
    solution: {
      imgSrc: `/sport/display-icon-${sport}.svg`,
      imgAlt: `Play ${sport} with the Rec Sports app`,
      headline: `Rec is your all-in-one community ${sport} hub.`,
      overline: "Find locations near you to play anytime.",
      deck: [
        `Find ${facilityType}s by location, availability, or even by sport! Your next favorite ${sport} ${facilityType} is just a search away.`,
        "Contribute to the community by alerting others of issues like construction, closures, or other issues that might impact your ability to play.",
      ],
      items: [
        {
          emoji: "🌐",
          headline: `Live Traffic`,
          deck: `See how busy a location is in real-time.`,
        },
        {
          emoji: "👋",
          headline: `Meet Others`,
          deck: `Connect with other ${sport} players in your area.`,
        },
        {
          emoji: "📈",
          headline: `Ratings`,
          deck: `Get information about ${facilityType}s like cleanliness, safety, and how good it is for nighttime play.`,
        },
        {
          emoji: "🔔",
          headline: `Get Notified`,
          deck: `See the latest on new ${facilityType}s, how bus a ${facilityType} is, and who's playing.`,
        },
      ],
    },
    problem: {
      headline: `Playing ${sport} with others shouldn’t be so hard.`,
      items: [
        {
          headline: `You can't always find local ${facilityType}s online.`,
          deck: `Google doesn't always have the information you're looking for. Finding "a ${facilityType} near me to play ${sport} with friends" often miss important details like availability or construction.`,
        },
        {
          headline: `It's hard to find others to play with.`,
          deck: `Connecting with the right people can be difficult. You want to play with other close by and at a similar skill level as you. It's hard to meet new people unless you're not in the right Facebook groups or group chats.`,
        },
        {
          headline: `You show up and the ${facilityType}s are full.`,
          deck: `Connecting with the right people can be difficult. You want to play with other close by and at a similar skill level as you. It's hard to meet new people unless you're not in the right Facebook groups or group chats.`,
        },
      ],
    },
  };
}

export const SPORT_CONTENT: Record<string, SportContent> = {
  baseball: createContent({
    sport: "baseball",
  }),
  kickball: createContent({
    sport: "kickball",
  }),
  basketball: createContent({
    sport: "basketball",
  }),
  pickleball: createContent({
    sport: "pickleball",
  }),
  tennis: createContent({
    sport: "tennis",
  }),
  soccer: createContent({
    sport: "soccer",
  }),
  football: createContent({
    sport: "football",
  }),
  softball: createContent({
    sport: "softball",
  }),
  volleyball: createContent({
    sport: "volleyball",
  }),
  "ultimate-frisbee": createContent({
    sport: "ultimate frisbee",
  }),
};
