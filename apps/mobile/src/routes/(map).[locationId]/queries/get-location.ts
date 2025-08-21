import { gql } from "@rec/types";

import type { Location } from "@rec/types";

export const GET_LOCATION = gql<{ location: Location | null }, { id: string }>`
  query GetLocation($id: String!) {
    location(id: $id) {
      id
      name
      address {
        street
        city
        county
        state
        stateCode
        country
        postalCode
      }
      geo {
        latitude
        longitude
      }
      sports
    }
  }
`;
