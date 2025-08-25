import type { Region } from 'react-native-maps';
import type { BoundingBox, PointInput } from '@rec/types';

/**
 * Converts a react-native-maps Region to a GraphQL BoundingBox
 */
export function regionToBoundingBox(region: Region): BoundingBox {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  
  // Calculate the bounding box corners
  const northEast: PointInput = {
    latitude: latitude + latitudeDelta / 2,
    longitude: longitude + longitudeDelta / 2,
  };
  
  const southWest: PointInput = {
    latitude: latitude - latitudeDelta / 2,
    longitude: longitude - longitudeDelta / 2,
  };
  
  return {
    northEast,
    southWest,
  };
}

/**
 * Adds a buffer percentage to a bounding box (e.g., 0.1 for 10% buffer)
 */
export function addBufferToBoundingBox(boundingBox: BoundingBox, bufferPercentage: number): BoundingBox {
  const { northEast, southWest } = boundingBox;
  
  const latSpan = northEast.latitude - southWest.latitude;
  const lngSpan = northEast.longitude - southWest.longitude;
  
  const latBuffer = latSpan * bufferPercentage;
  const lngBuffer = lngSpan * bufferPercentage;
  
  return {
    northEast: {
      latitude: northEast.latitude + latBuffer,
      longitude: northEast.longitude + lngBuffer,
    },
    southWest: {
      latitude: southWest.latitude - latBuffer,
      longitude: southWest.longitude - lngBuffer,
    },
  };
}

/**
 * Converts a react-native-maps Region to a GraphQL BoundingBox with buffer
 */
export function regionToBoundingBoxWithBuffer(region: Region, bufferPercentage: number = 0.1): BoundingBox {
  const boundingBox = regionToBoundingBox(region);
  return addBufferToBoundingBox(boundingBox, bufferPercentage);
}

/**
 * Converts a GraphQL BoundingBox to a react-native-maps Region
 */
export function boundingBoxToRegion(boundingBox: BoundingBox): Region {
  const { northEast, southWest } = boundingBox;
  
  // Calculate center point and deltas
  const latitude = (northEast.latitude + southWest.latitude) / 2;
  const longitude = (northEast.longitude + southWest.longitude) / 2;
  const latitudeDelta = Math.abs(northEast.latitude - southWest.latitude);
  const longitudeDelta = Math.abs(northEast.longitude - southWest.longitude);
  
  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
}

/**
 * Rounds a region's coordinates to improve cache hit rates
 * Uses adaptive precision based on zoom level (delta size)
 */
export function roundRegionForCaching(region: Region): Region {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  
  // Determine precision based on delta (zoom level)
  // Large deltas (zoomed out) = lower precision, small deltas (zoomed in) = higher precision
  let precision: number;
  const avgDelta = (latitudeDelta + longitudeDelta) / 2;
  
  if (avgDelta >= 10) {
    // Very zoomed out (country/continent level)
    precision = 0; // Round to whole degrees
  } else if (avgDelta >= 1) {
    // Zoomed out (state/region level)
    precision = 1; // Round to 0.1 degrees (~11km)
  } else if (avgDelta >= 0.1) {
    // Medium zoom (city level)
    precision = 2; // Round to 0.01 degrees (~1.1km)
  } else if (avgDelta >= 0.01) {
    // Zoomed in (neighborhood level)
    precision = 3; // Round to 0.001 degrees (~110m)
  } else {
    // Very zoomed in (street level)
    precision = 4; // Round to 0.0001 degrees (~11m)
  }
  
  const multiplier = Math.pow(10, precision);
  
  return {
    latitude: Math.round(latitude * multiplier) / multiplier,
    longitude: Math.round(longitude * multiplier) / multiplier,
    latitudeDelta: Math.round(latitudeDelta * multiplier) / multiplier,
    longitudeDelta: Math.round(longitudeDelta * multiplier) / multiplier,
  };
}