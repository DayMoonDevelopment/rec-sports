import { gql } from "@rec/types";

import type { LocationsResponse, Region } from "@rec/types";

export const GET_MAP_LOCATIONS = gql<
  { locations: LocationsResponse },
  { query?: string; offset?: number; limit?: number; region?: Region }
>`
  query SearchLocations(
    $query: String
    $region: Region
    $offset: Int
    $limit: Int
  ) {
    locations(query: $query, region: $region, offset: $offset, limit: $limit) {
      nodes {
        id
        name
        address {
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
      hasMore
      totalCount
    }
  }
`;
