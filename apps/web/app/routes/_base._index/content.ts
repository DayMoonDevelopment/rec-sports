export type ProblemType = {
  headline: string;
  deck: string;
  items: {
    title: string;
    content: string;
  }[];
};

export type SolutionType = {
  headline: string;
  deck: string;
  bento: {
    [key: string]: {
      title?: string;
      content?: string;
      gridArea: string;
      imgSrc?: string;
      imgAlt?: string;
    };
  };
};

export type HighlightType = {
  headline: string;
};

export type FounderType = {
  name: string;
  title: string;
  headline: string;
  deck: string[];
  image: {
    src: string;
    alt: string;
  };
};

export type WaitlistType = {
  headline: string;
  deck: string;
};

export type HeroType = {
  headline: string;
  deck: string;
};

const hero: HeroType = {
  headline: "Find the perfect spot to play – any sport, anywhere.",
  deck: "Search your local community for pick-up games, leagues, or solo play.",
};

const problem: ProblemType = {
  headline: "Getting into a pickup game shouldn’t be so hard.",
  deck: "Playing pickup games should be easy so you get playing the minute inspiration strikes",
  items: [
    {
      title: "Information online is incorrect.",
      content:
        "Google doesn't always have the information you're looking for. Finding “a field near me to play football with friends” often miss important details like availability or construction.",
    },
    {
      title: "Playing with others is difficult.",
      content:
        "If you're not in the right Facebook groups or group chats, getting a pickup game started right away can take so long that you don't even play.",
    },
    {
      title: "You show up and the courts are full.",
      content:
        "The worst thing that can happen is when you show up to your local pickleball spot and the courts are flooded with people.",
    },
  ],
};

const solution: SolutionType = {
  headline: "Rec is your all-in-one community sports hub.",
  deck: "Stay informed with real-time updates on locations near you from people just like you!",
  bento: {
    locations: {
      title: "Find locations near you to play any sport, any time.",
      content:
        "Look for places to play by location, facility type, or even by sport! Your next best spot is just a search away.",
      gridArea: "l",
      imgSrc: "/root/screenshot.png",
      imgAlt: "Rec Sports mobile app",
    },
    people: {
      title: "Meet people to play with.",
      content:
        "Connect with others in your area to play with so you can jump into a game at any time",
      gridArea: "p",
      imgSrc: "/root/people.png",
      imgAlt: "Join others to play with on the Rec Sports app",
    },
    notifications: {
      title: "Stay updated with the latest information.",
      content:
        "See the latest on new spots, how busy a location is, and who's playing at a location.",
      gridArea: "n",
      imgSrc: "/root/notifications.png",
      imgAlt: "Get notifications on the Rec Sports app",
    },
    alert: {
      title: "Alert others of issues.",
      content:
        "Contribute to the community by alerting others of issues like construction, closures, or other issues that might impact your ability to play.",
      gridArea: "a",
      imgSrc: "/root/alert.png",
      imgAlt: "Alert others of issues on the Rec Sports app",
    },
    cleanliness: {
      title: "Cleanliness scores",
      gridArea: "c",
    },
    traffic: {
      title: "Live Traffic",
      content: "See how busy a location is in real-time",
      gridArea: "t",
      imgSrc: "/root/globe.png",
      imgAlt:
        "Rec Sports keeps you updated with realtime traffic for parks and sports facilities near you",
    },
    sports: {
      gridArea: "s",
      imgSrc: "/root/sports.png",
      imgAlt: "Rec Sports helps you find the best spots to play any sport",
    },
    ratings: {
      title: "Location ratings",
      gridArea: "r",
      imgSrc: "/root/ratings.png",
      imgAlt: "Rec Sports helps you find the best spots to play any sport",
    },
  },
};

const founder: FounderType = {
  name: "Caleb",
  title: "Founder",
  headline: "I'm Caleb, one of the creators of Rec",
  deck: [
    "I wanted to take my wife to play pickleball on her birthday weekend and we ended up driving between towns for over an hour checking multiple spots just to turn right back around and go home… I could have checked Google, but Google didn't have any up-to-date information about these little courts!",
    "We're building Rec to help you in those moments when you want to jump into a pickup game but don't want the hassle of blindly finding places to play and people to play with.",
  ],
  image: {
    src: "/root/caleb.png",
    alt: "Caleb Panza - co-founder of Rec",
  },
};

const waitlist: WaitlistType = {
  headline: "Be the first the play with Rec!",
  deck: "Join the waitlist now and get early access.",
};

export const ROOT_CONTENT = {
  page: {
    hero,
    problem,
    solution,
    founder,
    waitlist,
  },
};
