// Import database types from the shared database package
import type { Tables } from "../../database/supabase/+types";

// Database location row type
export type LocationRow = Tables<"locations">;

// Algolia document structure
export interface AlgoliaLocationDocument extends Record<string, unknown> {
  objectID: string;
  name: string;
  address: {
    id: string;
    street: string;
    street2?: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
  } | null;
  _geoloc: {
    lat: number;
    lng: number;
  };
  sports: string[];
  // Metadata for sync tracking
  _syncedAt: string;
  _updatedAt: string;
}

// Sync configuration
export interface SyncConfig {
  batchSize: number;
  debug: boolean;
  fullSync: boolean;
  incrementalSync: boolean;
}

// Sync statistics
export interface SyncStats {
  totalProcessed: number;
  successfulUpserts: number;
  failedUpserts: number;
  deletions: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}
