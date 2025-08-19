export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
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
};

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  county?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type BoundingBox = {
  northEast: PointInput;
  southWest: PointInput;
};

export type CenterPoint = {
  point: PointInput;
  radiusMiles: Scalars['Float']['input'];
};

export type Location = {
  __typename?: 'Location';
  address?: Maybe<Address>;
  geo: Point;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sports: Array<Sport>;
};

export type LocationsResponse = {
  __typename?: 'LocationsResponse';
  hasMore: Scalars['Boolean']['output'];
  nodes: Array<Location>;
  totalCount: Scalars['Int']['output'];
};

export type Page = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type Point = {
  __typename?: 'Point';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type PointInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  location?: Maybe<Location>;
  locations: LocationsResponse;
};


export type QueryLocationArgs = {
  id: Scalars['String']['input'];
};


export type QueryLocationsArgs = {
  page?: InputMaybe<Page>;
  query?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Region>;
  sports?: InputMaybe<Array<Sport>>;
};

export type Region = {
  boundingBox?: InputMaybe<BoundingBox>;
  centerPoint?: InputMaybe<CenterPoint>;
};

/** Sports available at locations */
export enum Sport {
  Baseball = 'BASEBALL',
  Basketball = 'BASKETBALL',
  DiscGolf = 'DISC_GOLF',
  Football = 'FOOTBALL',
  Golf = 'GOLF',
  Hockey = 'HOCKEY',
  Pickleball = 'PICKLEBALL',
  Soccer = 'SOCCER',
  Tennis = 'TENNIS',
  Ultimate = 'ULTIMATE',
  Volleyball = 'VOLLEYBALL'
}
