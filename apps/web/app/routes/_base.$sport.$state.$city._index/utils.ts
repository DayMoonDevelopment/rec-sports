import get from "lodash/get";
import kebabCase from "lodash/kebabCase";
import toLower from "lodash/toLower";

import { Sport, StateCode, StateSlug } from "~/lib/global.types";
/**
 * Validates the provided sport string against the known Sport values.
 * Throws a 404 Response if the sport is not found.
 *
 * @param sport - The sport string to validate.
 */
export function validateSport(sport: string) {
  if (!Object.keys(Sport).includes(sport)) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "internalErrorCode: SP404X8K2",
    });
  }
}

/**
 * Validates the provided sport, state, and city parameters from the route.
 * Throws a 404 Response if any of the parameters are missing.
 *
 * @param params - The route parameters object.
 */
export function validateParams(
  sport: string | undefined,
  city: string | undefined,
  state: string | undefined,
) {
  if (!sport || !state || !city) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "internalErrorCode: PM404Y9J3",
    });
  }
}

/**
 * Validates the provided sport, state, and city parameters from the route.
 * Handles redirects for 2-letter state codes and non-kebab-case state names.
 *
 * @param sport - The sport string to validate.
 * @param state - The state string to validate.
 * @param city - The city string to validate.
 * @throws {Response} A 404 Response if the state is not found, or a 308 Permanent Redirect Response if the state needs to be redirected.
 */
export function validateState(sport: string, state: string, city: string) {
  const stateSlug = get(StateSlug, toLower(state));

  // If the state is not found, throw a 404 Response
  if (!stateSlug) {
    throw new Response("Not Found", {
      status: 404,
      statusText: "internalErrorCode: SS404X8K2",
    });
  }

  // If the state is not kebab-case, throw a 308 Permanent Redirect Response
  if (state !== StateSlug[stateSlug]) {
    throw new Response("Permanent Redirect", {
      status: 308,
      statusText: "internalErrorCode: SS308Y9J3",
      headers: {
        Location: `/${sport}/${stateSlug}/${city}`,
      },
    });
  }
}

export async function validateUSCityState(
  city: string,
  state: string,
): Promise<boolean> {
  try {
    const normalizedCity = kebabCase(city);
    const stateCode = get(StateCode, toLower(state));
    const username = process.env.GEONAMES_USERNAME;
    const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(normalizedCity)}&adminCode1=${stateCode}&maxRows=1&username=${username}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.geonames.length > 0 && data.geonames[0].adminCode1 === state;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error validating city/state:", error);
    throw new Response("Not Found", {
      status: 404,
      statusText: "internalErrorCode: CS404X8K5",
    });
  }
}
