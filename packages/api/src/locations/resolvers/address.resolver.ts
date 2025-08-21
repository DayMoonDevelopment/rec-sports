import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Address } from '../models/address.model';

const STATE_NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  'District of Columbia': 'DC',
  'Puerto Rico': 'PR',
  'U.S. Virgin Islands': 'VI',
  Guam: 'GU',
  'American Samoa': 'AS',
  'Northern Mariana Islands': 'MP',
};

@Resolver(() => Address)
export class AddressResolver {
  @ResolveField(() => String, { nullable: true })
  stateCode(@Parent() address: Address): string | null {
    if (!address.state) {
      return null;
    }

    const normalizedState = address.state.trim();
    
    // If it's already a 2-letter code, return it
    if (normalizedState.length === 2 && /^[A-Z]{2}$/.test(normalizedState)) {
      return normalizedState;
    }

    // Look up the state name in our mapping
    return STATE_NAME_TO_CODE[normalizedState] || null;
  }
}