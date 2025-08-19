import { SPORT_CONTENT } from "./content";

import type { LoaderFunctionArgs } from "react-router";

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.sport || !Object.keys(SPORT_CONTENT).includes(params.sport)) {
    throw new Response("Not Found", { status: 404 });
  }

  const sport = SPORT_CONTENT[params.sport as keyof typeof SPORT_CONTENT];

  return { ...sport, currentSport: params.sport };
}
