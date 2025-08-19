import sharp from "sharp";

import {
  createCompositeImage,
  fetchImageBuffer,
  type CompositeImageItem,
} from "./image-utils";
import {
  getAvailableSports,
  SPORT_BADGE_CONFIG,
  SPORT_BADGE_MAP,
} from "./sport-badges";
import {
  createCityStateTextSVG,
  createLocationNameSVG,
  TEXT_CONFIG,
} from "./text-rendering";

import type { LocationData } from "../../_base.locations.$locationId._index/route.loader";

// Main OG image generation function
export async function generateLocationOGImage(
  location: LocationData,
  baseUrl: string,
): Promise<Buffer> {
  // Load base image from public directory
  const baseImageUrl = `${baseUrl}/location/base.png`;
  const baseImageBuffer = await fetchImageBuffer(baseImageUrl);
  const baseImage = sharp(baseImageBuffer);

  // Get base image metadata
  const baseMetadata = await baseImage.metadata();
  const baseWidth = baseMetadata.width || 1200;

  // Get available sports and create sport badges
  const availableSports = getAvailableSports(location.sportTypes);
  const sportBadgeItems = await createSportBadgeItems(
    availableSports,
    baseUrl,
    baseWidth,
  );

  // Create text elements
  const cityStateText = `${location.city}, ${location.state}`;
  const cityStateTextSVG = createCityStateTextSVG(
    cityStateText,
    TEXT_CONFIG.cityState.x,
    TEXT_CONFIG.cityState.y,
    TEXT_CONFIG.cityState.fontSize,
    TEXT_CONFIG.cityState.maxWidth,
    TEXT_CONFIG.cityState.color,
  );

  const locationNameSVG = createLocationNameSVG(
    location.name,
    TEXT_CONFIG.locationName.x,
    TEXT_CONFIG.locationName.y,
    TEXT_CONFIG.locationName.fontSize,
    TEXT_CONFIG.locationName.maxWidth,
    TEXT_CONFIG.locationName.maxHeight,
    TEXT_CONFIG.locationName.color,
  );

  // Combine all composite elements
  const allCompositeItems: CompositeImageItem[] = [
    ...sportBadgeItems,
    {
      input: cityStateTextSVG,
      top: 0,
      left: 0,
    },
    {
      input: locationNameSVG,
      top: 0,
      left: 0,
    },
  ];

  // Create final composite image
  return await createCompositeImage(baseImageBuffer, allCompositeItems);
}

// Helper function to create sport badge composite items
async function createSportBadgeItems(
  availableSports: string[],
  baseUrl: string,
  baseWidth: number,
): Promise<CompositeImageItem[]> {
  const compositeItems: CompositeImageItem[] = [];
  const { spacing, rightMargin, topMargin } = SPORT_BADGE_CONFIG;

  for (let i = 0; i < availableSports.length; i++) {
    const sport = availableSports[i];
    const badgeFileName = SPORT_BADGE_MAP[sport];
    const badgeUrl = `${baseUrl}/location/${badgeFileName}`;

    try {
      // Fetch badge image from public directory
      const badgeBuffer = await fetchImageBuffer(badgeUrl);
      const badge = sharp(badgeBuffer);
      const badgeMetadata = await badge.metadata();

      // Position from top-right corner
      const left = baseWidth - (badgeMetadata.width || 150) - rightMargin;
      const top = topMargin + i * spacing;

      compositeItems.push({
        input: badgeBuffer,
        left,
        top,
      });
    } catch (error) {
      // Skip missing badge files
      console.warn(`Badge not found for sport: ${sport}`, { cause: error });
    }
  }

  return compositeItems;
}
