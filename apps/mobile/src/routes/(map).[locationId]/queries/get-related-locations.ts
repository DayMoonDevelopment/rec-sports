import { gql } from "@rec/types";

import type { LocationsResponse } from "@rec/types";

export const GET_RELATED_LOCATIONS = gql<
  { relatedLocations: LocationsResponse },
  { latitude: number; longitude: number }
>`
  query GetRelatedLocations($latitude: Float!, $longitude: Float!) {
    relatedLocations: locations(
      region: {
        centerPoint: {
          point: { latitude: $latitude, longitude: $longitude }
          radiusMiles: 5
        }
      }
      limit: 6
    ) {
      nodes {
        id
        name
        address {
          id
          street
          city
          state
          stateCode
          postalCode
        }
        geo {
          latitude
          longitude
        }
        sports
      }
    }
  }
`;
