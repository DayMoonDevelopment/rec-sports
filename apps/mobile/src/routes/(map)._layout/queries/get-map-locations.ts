import { gql } from "@rec/types";

import type { LocationsResponse, Page, Region } from "@rec/types";

export const GET_MAP_LOCATIONS = gql<
  { locations: LocationsResponse },
  { query?: string; page?: Page; region?: Region }
>`
  query SearchLocations($query: String, $page: Page, $region: Region) {
    locations(query: $query, page: $page, region: $region) {
      nodes {
        id
        name
        address {
          street
          city
          county
          state
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
