import { APPLE_MAPS_KEY } from "~/lib/.server/apple.constants";
import { GOOGLE_MAPS_KEY } from "~/lib/.server/google.constants";

import type { LoaderFunctionArgs } from "react-router";

export type MapProvider = "apple" | "google";

export interface LocationData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  description?: string;
  amenities?: string[];
  hours?: {
    [key: string]: string;
  };
  rating?: number;
  totalReviews?: number;
  phone?: string;
  website?: string;
  sportTypes: string[];
  images?: string[];
}

export const mockLocations: { [key: string]: LocationData } = {
  "1": {
    id: "1",
    name: "Downtown Sports Complex",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    latitude: 30.2672,
    longitude: -97.7431,
    description:
      "A premier sports facility located in the heart of downtown Austin, featuring multiple courts and fields for various sports activities.",
    amenities: [
      "Parking Available",
      "Restrooms",
      "Concessions",
      "Equipment Rental",
      "Locker Rooms",
      "Lighting for Night Games",
    ],
    hours: {
      Monday: "6:00 AM - 10:00 PM",
      Tuesday: "6:00 AM - 10:00 PM",
      Wednesday: "6:00 AM - 10:00 PM",
      Thursday: "6:00 AM - 10:00 PM",
      Friday: "6:00 AM - 11:00 PM",
      Saturday: "7:00 AM - 11:00 PM",
      Sunday: "7:00 AM - 9:00 PM",
    },
    rating: 4.5,
    totalReviews: 127,
    phone: "(512) 555-0123",
    website: "https://downtownsportscomplex.com",
    sportTypes: ["Basketball", "Tennis", "Volleyball", "Soccer"],
    images: ["/sport/hero-basketball.png", "/sport/hero-tennis.png"],
  },
  "2": {
    id: "2",
    name: "Riverside Park Courts",
    address: "456 River Drive",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    latitude: 30.2395,
    longitude: -97.7465,
    description:
      "Beautiful outdoor courts along the Colorado River with scenic views and well-maintained facilities.",
    amenities: [
      "Free Parking",
      "Restrooms",
      "Water Fountains",
      "Picnic Areas",
      "Lighting",
      "Dog Friendly Area",
    ],
    hours: {
      Monday: "Sunrise - Sunset",
      Tuesday: "Sunrise - Sunset",
      Wednesday: "Sunrise - Sunset",
      Thursday: "Sunrise - Sunset",
      Friday: "Sunrise - Sunset",
      Saturday: "Sunrise - Sunset",
      Sunday: "Sunrise - Sunset",
    },
    rating: 4.2,
    totalReviews: 89,
    phone: "(512) 555-0456",
    sportTypes: ["Tennis", "Pickleball", "Basketball"],
    images: ["/sport/hero-tennis.png", "/sport/hero-pickleball.png"],
  },
  "3": {
    id: "3",
    name: "Westside Athletic Center",
    address: "789 Oak Hill Road",
    city: "Austin",
    state: "TX",
    zipCode: "78735",
    latitude: 30.2849,
    longitude: -97.8648,
    description:
      "Modern indoor facility with state-of-the-art equipment and professional-grade courts for serious athletes.",
    amenities: [
      "Covered Parking",
      "Locker Rooms",
      "Pro Shop",
      "Coaching Available",
      "Air Conditioning",
      "Fitness Center Access",
    ],
    hours: {
      Monday: "5:00 AM - 11:00 PM",
      Tuesday: "5:00 AM - 11:00 PM",
      Wednesday: "5:00 AM - 11:00 PM",
      Thursday: "5:00 AM - 11:00 PM",
      Friday: "5:00 AM - 12:00 AM",
      Saturday: "6:00 AM - 12:00 AM",
      Sunday: "6:00 AM - 10:00 PM",
    },
    rating: 4.8,
    totalReviews: 203,
    phone: "(512) 555-0789",
    website: "https://westsideac.com",
    sportTypes: ["Basketball", "Volleyball", "Badminton", "Squash"],
    images: ["/sport/hero-basketball.png", "/sport/hero-volleyball.png"],
  },
};

export async function mapLoader(
  request: Request,
): Promise<{ mapProvider: MapProvider }> {
  const userAgent = request.headers.get("user-agent") || "";
  let mapProvider: MapProvider = "google";

  if (
    /iPhone|iPad|iPod|Macintosh/.test(userAgent) &&
    /Safari/.test(userAgent)
  ) {
    mapProvider = "apple";
  } else if (/Android/.test(userAgent) || /Chrome/.test(userAgent)) {
    mapProvider = "google";
  }

  return { mapProvider };
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { locationId } = params;

  if (!locationId) {
    throw new Response("Location ID is required", { status: 400 });
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const location = mockLocations[locationId];

  if (!location) {
    throw new Response("Location not found", {
      status: 404,
      statusText: `Location with ID '${locationId}' does not exist`,
    });
  }

  // Get map provider based on user agent
  const { mapProvider } = await mapLoader(request);

  // Pass API keys to the client based on the selected provider
  const mapConfig = {
    googleMapsKey: GOOGLE_MAPS_KEY,
    appleMapsKey: APPLE_MAPS_KEY,
  };

  return { location, mapProvider, mapConfig };
}
