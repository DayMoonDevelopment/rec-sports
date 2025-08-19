import { createContent } from "./content";
import {
  validateParams,
  validateSport,
  validateState,
  validateUSCityState,
} from "./utils";

import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  validateParams(params.sport, params.city, params.state);
  validateSport(params.sport!);
  validateState(params.sport!, params.state!, params.city!);
  await validateUSCityState(params.city!, params.state!);

  const sport = createContent({
    sport: params.sport!.replace("-", " "),
    state: params.state!,
    city: params.city!,
  });

  return { ...sport, currentSport: params.sport };
}
