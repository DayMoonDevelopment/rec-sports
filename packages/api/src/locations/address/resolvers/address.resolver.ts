import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { createHash } from 'crypto';

import { Address } from '../models/address.model';

const STATE_CODE_TO_NAME: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
  PR: 'Puerto Rico',
  VI: 'U.S. Virgin Islands',
  GU: 'Guam',
  AS: 'American Samoa',
  MP: 'Northern Mariana Islands',
};

@Resolver(() => Address)
export class AddressResolver {
  @ResolveField(() => String)
  id(@Parent() address: Address): string {
    // Create a consistent object for hashing
    const addressData = {
      street: address.street || '',
      street2: address.street2 || '',
      city: address.city || '',
      stateCode: address.stateCode || '',
      postalCode: address.postalCode || '',
    };

    // Create a deterministic string from the address data
    const addressString = JSON.stringify(
      addressData,
      Object.keys(addressData).sort(),
    );

    // Create SHA-256 hash and take first 12 characters (6 bytes = 48 bits)
    // This gives us very low collision probability while keeping it short
    const hash = createHash('sha256')
      .update(addressString)
      .digest('hex')
      .substring(0, 12);

    return `adr_${hash}`;
  }

  @ResolveField(() => String, { nullable: true })
  state(@Parent() address: Address): string | null {
    if (!address.stateCode) {
      return null;
    }

    const normalizedStateCode = address.stateCode.trim().toUpperCase();

    // Look up the state code in our mapping to get the full name
    return STATE_CODE_TO_NAME[normalizedStateCode] || address.stateCode;
  }
}
