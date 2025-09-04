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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: unknown; output: unknown; }
};

export type AddGameScorePayload = {
  __typename: 'AddGameScorePayload';
  action: GameScoreAction;
  game: Game;
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
  locationId: Scalars['ID']['input'];
  scheduledAt: Scalars['DateTime']['input'];
  sport: Sport;
  teamIds: Array<Scalars['ID']['input']>;
};

export type CreateGamePayload = {
  __typename: 'CreateGamePayload';
  game: Game;
};

export type CreateTeamInput = {
  members: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTeamPayload = {
  __typename: 'CreateTeamPayload';
  team: Team;
};

export type Game = {
  __typename: 'Game';
  actions: GameActionsConnection;
  endedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  location: Maybe<Location>;
  scheduledAt: Maybe<Scalars['DateTime']['output']>;
  sport: Sport;
  startedAt: Maybe<Scalars['DateTime']['output']>;
  status: GameStatus;
  teams: Array<GameTeam>;
};


export type GameActionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Int']['input'];
};

export type GameAction = {
  id: Scalars['ID']['output'];
  occurredAt: Scalars['DateTime']['output'];
};

export type GameActionEdge = {
  __typename: 'GameActionEdge';
  cursor: Scalars['String']['output'];
  node: GameAction;
};

export type GameActionsConnection = {
  __typename: 'GameActionsConnection';
  edges: Array<GameActionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GameScoreAction = GameAction & {
  __typename: 'GameScoreAction';
  id: Scalars['ID']['output'];
  key: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['DateTime']['output'];
  occurredByUser: Maybe<User>;
  occurredToTeam: Team;
  value: Scalars['Float']['output'];
};

export type GameScoreInput = {
  key?: InputMaybe<Scalars['String']['input']>;
  occurredByUserId?: InputMaybe<Scalars['ID']['input']>;
  occurredToTeamId: Scalars['ID']['input'];
  value: Scalars['Float']['input'];
};

/** The status of a game */
export enum GameStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Upcoming = 'UPCOMING'
}

export type GameTeam = {
  __typename: 'GameTeam';
  id: Scalars['ID']['output'];
  score: Scalars['Int']['output'];
  team: Team;
};

export type Location = {
  __typename: 'Location';
  address: Maybe<Address>;
  geo: Point;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sports: Array<Sport>;
};

export type LocationEdge = {
  __typename: 'LocationEdge';
  cursor: Scalars['String']['output'];
  node: Location;
};

export type LocationsConnection = {
  __typename: 'LocationsConnection';
  edges: Array<LocationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  addGameScore: AddGameScorePayload;
  addTeamMember: UpdateTeamPayload;
  createGame: CreateGamePayload;
  createTeam: CreateTeamPayload;
  endGame: UpdateGamePayload;
  removeGameAction: RemoveGameActionPayload;
  removeTeamMember: UpdateTeamPayload;
  signInWithApple: UserAuth;
  signInWithGoogle: UserAuth;
  startGame: UpdateGamePayload;
  updateGameScore: UpdateGameScorePayload;
};


export type MutationAddGameScoreArgs = {
  gameId: Scalars['ID']['input'];
  input: GameScoreInput;
};


export type MutationAddTeamMemberArgs = {
  input: TeamMemberInput;
};


export type MutationCreateGameArgs = {
  input: CreateGameInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationEndGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationRemoveGameActionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveTeamMemberArgs = {
  input: TeamMemberInput;
};


export type MutationSignInWithAppleArgs = {
  input: SignInAppleInput;
};


export type MutationSignInWithGoogleArgs = {
  input: SignInGoogleInput;
};


export type MutationStartGameArgs = {
  gameId: Scalars['ID']['input'];
};


export type MutationUpdateGameScoreArgs = {
  id: Scalars['ID']['input'];
  input: GameScoreInput;
};

export type PageInfo = {
  __typename: 'PageInfo';
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
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
  location: Maybe<Location>;
  locations: LocationsConnection;
  team: Maybe<Team>;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLocationArgs = {
  id: Scalars['String']['input'];
};


export type QueryLocationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Region>;
  searchMode?: InputMaybe<Scalars['String']['input']>;
  similarityThreshold?: InputMaybe<Scalars['Float']['input']>;
  sports?: InputMaybe<Array<Sport>>;
};


export type QueryTeamArgs = {
  id: Scalars['ID']['input'];
};

export type Region = {
  boundingBox?: InputMaybe<BoundingBox>;
  centerPoint?: InputMaybe<CenterPoint>;
};

export type RemoveGameActionPayload = {
  __typename: 'RemoveGameActionPayload';
  gameId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
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
  id: Scalars['ID']['output'];
  members: Maybe<Array<User>>;
  name: Scalars['String']['output'];
};

export type TeamMemberInput = {
  teamId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type UpdateGamePayload = {
  __typename: 'UpdateGamePayload';
  game: Game;
};

export type UpdateGameScorePayload = {
  __typename: 'UpdateGameScorePayload';
  action: GameScoreAction;
};

export type UpdateTeamPayload = {
  __typename: 'UpdateTeamPayload';
  team: Team;
};

export type User = {
  __typename: 'User';
  id: Scalars['ID']['output'];
};

export type UserAuth = {
  __typename: 'UserAuth';
  session: Session;
  user: User;
};
