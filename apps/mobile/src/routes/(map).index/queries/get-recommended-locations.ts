import { gql } from "@rec/types";

import type { LocationsResponse, Region } from "@rec/types";

export const GET_RECOMMENDED_LOCATIONS = gql<
  { locations: LocationsResponse },
  { limit?: number; region?: Region }
>`
  query GetRecommendedLocations($region: Region, $limit: Int) {
    locations(region: $region, limit: $limit) {
      nodes {
        id
        name
        address {
          street
          city
          county
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
