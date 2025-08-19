import { mockLocations } from "../_base.locations.$locationId._index/route.loader";

import { generateLocationOGImage } from "./.server/og-generator";

import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { locationId } = params;

  if (!locationId) {
    throw new Response("Location ID is required", { status: 400 });
  }

  // Get location data
  const location = mockLocations[locationId];

  if (!location) {
    throw new Response("Location not found", { status: 404 });
  }

  try {
    // Get base URL for assets
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Generate OG image using the modular generator
    const buffer = await generateLocationOGImage(location, baseUrl);

    // Return PNG response with proper headers
    return new Response(buffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    throw new Response("Internal Server Error", { status: 500 });
  }
}
