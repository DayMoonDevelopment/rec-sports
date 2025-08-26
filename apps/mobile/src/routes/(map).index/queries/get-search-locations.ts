import { gql } from "@rec/types";

import type { LocationsResponse, Region } from "@rec/types";

export const GET_SEARCH_LOCATIONS = gql<
  { locations: LocationsResponse },
  { query: string; region?: Region; limit?: number }
>`
  query GetSearchLocations($query: String!, $region: Region, $limit: Int) {
    locations(query: $query, region: $region, limit: $limit) {
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
      totalCount
      hasMore
    }
  }
`;