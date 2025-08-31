export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
};

export type Address = {
  __typename: 'Address';
  city: Scalars['String']['output'];
  id: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  stateCode: Scalars['String']['output'];
  street: Scalars['String']['output'];
  street2: Maybe<Scalars['String']['output']>;
};

export type BoundingBox = {
  northEast: PointInput;
  southWest: PointInput;
};

export type CenterPoint = {
  point: PointInput;
  radiusMiles: Scalars['Float']['input'];
};

export type CreateGameInput = {
  locationId?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  sport: Scalars['String']['input'];
  team1Id?: InputMaybe<Scalars['String']['input']>;
  team2Id?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTeamInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  sportTags?: InputMaybe<Array<Scalars['String']['input']>>;
  teamType: TeamType;
};

export type Game = {
  __typename: 'Game';
  completedAt: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  events: Array<GameEvent>;
  gameState: GameState;
  id: Scalars['ID']['output'];
  location: Maybe<Location>;
  scheduledAt: Maybe<Scalars['DateTime']['output']>;
  sport: Scalars['String']['output'];
  startedAt: Maybe<Scalars['DateTime']['output']>;
  team1: Maybe<Team>;
  team1Score: Scalars['Int']['output'];
  team2: Maybe<Team>;
  team2Score: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  winnerTeam: Maybe<Team>;
};

export type GameEvent = {
  __typename: 'GameEvent';
  createdAt: Scalars['DateTime']['output'];
  eventKey: Maybe<Scalars['String']['output']>;
  eventType: Scalars['String']['output'];
  gameId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  occurredAt: Scalars['DateTime']['output'];
  periodName: Maybe<Scalars['String']['output']>;
  periodNumber: Scalars['Int']['output'];
  points: Scalars['Int']['output'];
  team: Maybe<Team>;
  userId: Maybe<Scalars['String']['output']>;
};

/** The state of a game */
export enum GameState {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Scheduled = 'SCHEDULED'
}

export type GamesResponse = {
  __typename: 'GamesResponse';
  hasMore: Scalars['Boolean']['output'];
  nodes: Array<Game>;
  totalCount: Scalars['Int']['output'];
};

export type Location = {
  __typename: 'Location';
  address: Maybe<Address>;
  geo: Point;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sports: Array<Sport>;
};

export type LocationsResponse = {
  __typename: 'LocationsResponse';
  hasMore: Scalars['Boolean']['output'];
  nodes: Array<Location>;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  createGame: Game;
  createTeam: Team;
  signInWithApple: UserAuth;
  signInWithGoogle: UserAuth;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationSignInWithAppleArgs = {
  input: SignInAppleInput;
};


export type MutationSignInWithGoogleArgs = {
  input: SignInGoogleInput;
};

export type Point = {
  __typename: 'Point';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type PointInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Query = {
  __typename: 'Query';
  game: Maybe<Game>;
  games: GamesResponse;
  location: Maybe<Location>;
  locations: LocationsResponse;
  team: Maybe<Team>;
};


export type QueryGameArgs = {
  id: Scalars['String']['input'];
};


export type QueryGamesArgs = {
  gameState?: InputMaybe<GameState>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sport?: InputMaybe<Scalars['String']['input']>;
  teamId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLocationArgs = {
  id: Scalars['String']['input'];
};


export type QueryLocationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Region>;
  searchMode?: InputMaybe<Scalars['String']['input']>;
  similarityThreshold?: InputMaybe<Scalars['Float']['input']>;
  sports?: InputMaybe<Array<Sport>>;
};


export type QueryTeamArgs = {
  id: Scalars['String']['input'];
};

export type Region = {
  boundingBox?: InputMaybe<BoundingBox>;
  centerPoint?: InputMaybe<CenterPoint>;
};

export type Session = {
  __typename: 'Session';
  accessToken: Scalars['String']['output'];
  expiresAt: Scalars['Int']['output'];
  expiresIn: Scalars['Int']['output'];
  refreshToken: Scalars['String']['output'];
  tokenType: Scalars['String']['output'];
};

export type SignInAppleInput = {
  identityToken: Scalars['String']['input'];
  nonce: Scalars['String']['input'];
};

export type SignInGoogleInput = {
  idToken: Scalars['String']['input'];
  nonce: Scalars['String']['input'];
};

/** Sports available at locations */
export enum Sport {
  Baseball = 'BASEBALL',
  Basketball = 'BASKETBALL',
  DiscGolf = 'DISC_GOLF',
  Football = 'FOOTBALL',
  Golf = 'GOLF',
  Hockey = 'HOCKEY',
  Kickball = 'KICKBALL',
  Pickleball = 'PICKLEBALL',
  Soccer = 'SOCCER',
  Softball = 'SOFTBALL',
  Tennis = 'TENNIS',
  Ultimate = 'ULTIMATE',
  Volleyball = 'VOLLEYBALL'
}

export type Team = {
  __typename: 'Team';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  members: Array<TeamMember>;
  name: Maybe<Scalars['String']['output']>;
  sportTags: Maybe<Array<Scalars['String']['output']>>;
  teamType: TeamType;
  updatedAt: Scalars['DateTime']['output'];
};

export type TeamMember = {
  __typename: 'TeamMember';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  role: Maybe<Scalars['String']['output']>;
  teamId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

/** The type of team - individual player or team */
export enum TeamType {
  Individual = 'INDIVIDUAL',
  Team = 'TEAM'
}

export type User = {
  __typename: 'User';
  id: Scalars['ID']['output'];
};

export type UserAuth = {
  __typename: 'UserAuth';
  session: Session;
  user: User;
};
