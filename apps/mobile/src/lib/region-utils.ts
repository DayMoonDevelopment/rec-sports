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