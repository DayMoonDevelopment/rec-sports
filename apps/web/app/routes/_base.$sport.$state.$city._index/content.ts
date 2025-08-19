import startCase from "lodash/startCase";

import { SportFacilityType } from "~/lib/global.types";

export function createContent({
  sport,
  state,
  city,
}: {
  sport: string;
  state: string;
  city: string;
}) {
  const facilityType =
    SportFacilityType[
      sport.replaceAll(" ", "-") as keyof typeof SportFacilityType
    ];

  const facilityTypePlural = facilityType + "s";

  const stateFriendly = startCase(state);
  const cityFriendly = startCase(city);

  return {
    hero: {
      headline: `Find the perfect ${facilityType} to play ${sport} in ${cityFriendly}`,
      deck: `Discover ${facilityTypePlural} to play on and people to play with right in your local community.`,
      imgSrc: `/sport/og-${sport}.png`,
      imgAlt: `Use Rec to find the perfect spot to play ${sport} in ${cityFriendly}, ${stateFriendly}`,
      cta: `Get updated when Rec launches in ${cityFriendly}!`,
    },
    content: `
        <h3>Finding places to play ${sport} with friends shouldn't be so hard!</h3>

        <p>Searching Google for “a ${facilityType} in ${cityFriendly} to play ${sport} with friends” often misses important details like availability or construction.</p>

        <p>It can be hard to meet new people unless you're already in the right Facebook groups. And the worst thing to happen is when show up to your favorite spot and the ${facilityTypePlural} are full.</p>

        <h3>Rec makes it easier to find ${facilityTypePlural} in ${cityFriendly}.</h3>

        <p>Find a spot to play ${sport} that fit your needs. Look up courts by a specific location, availability, or even current traffic.</p>

        <p>Quickly and easily alert others of issues like construction, closures, or other issues that might impact your ability to play.</p>

        <h3>Your next favorite spot to play ${sport} in ${cityFriendly} is closer than you think.</h3>
    `,
    hub: {
      imgSrc: `/sport/display-icon-${sport}.svg`,
      imgAlt: `Play ${sport} with the Rec Sports app`,
      headline: `Rec is your all-in-one community ${sport} hub.`,
      items: [
        {
          emoji: "🌐",
          headline: `Live Traffic`,
          deck: `See how busy a location is in real-time.`,
        },
        {
          emoji: "👋",
          headline: `Meet Others`,
          deck: `Connect with other ${sport} players in ${cityFriendly}, ${stateFriendly}.`,
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
    allSports: {
      headline: `Looking for more than just ${sport}?`,
      deck: `Find a place to play any sport in ${cityFriendly}`,
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
  };
}
