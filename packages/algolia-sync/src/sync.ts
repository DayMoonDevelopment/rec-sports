import type { SearchClient } from "algoliasearch";
import { algoliasearch } from "algoliasearch";
import { Kysely, PostgresDialect } from "kysely";
import type { KyselifyDatabase } from "kysely-supabase";
import { Pool } from "pg";
import type { Database } from "../../database/supabase/+types";
import type {
  AlgoliaLocationDocument,
  LocationRow,
  SyncConfig,
  SyncStats,
} from "./types";

type KyselyDatabase = KyselifyDatabase<Database>;

export class AlgoliaLocationSync {
  private db: Kysely<KyselyDatabase>;
  private algolia: SearchClient;
  private indexName: string;
  private config: SyncConfig;

  constructor(config: SyncConfig) {
    this.config = config;
    this.indexName = process.env.ALGOLIA_INDEX_NAME || "locations";

    // Initialize Kysely database connection
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    this.db = new Kysely<KyselyDatabase>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });

    // Initialize Algolia client
    this.algolia = algoliasearch(
      process.env.ALGOLIA_APP_ID!,
      process.env.ALGOLIA_ADMIN_API_KEY!,
    );
  }

  /**
   * Main sync method - performs full or incremental sync
   */
  async sync(): Promise<SyncStats> {
    const stats: SyncStats = {
      totalProcessed: 0,
      successfulUpserts: 0,
      failedUpserts: 0,
      deletions: 0,
      startTime: new Date(),
    };

    try {
      this.log("🚀 Starting Algolia sync...");

      if (this.config.fullSync) {
        await this.fullSync(stats);
      } else {
        await this.incrementalSync(stats);
      }

      stats.endTime = new Date();
      stats.duration = stats.endTime.getTime() - stats.startTime.getTime();

      this.logStats(stats);
      return stats;
    } catch (error) {
      this.log("❌ Sync failed:", error);
      throw error;
    }
  }

  /**
   * Full sync - rebuilds entire Algolia index using paginated queries
   */
  private async fullSync(stats: SyncStats): Promise<void> {
    this.log("📋 Performing full sync...");

    // Clear existing index
    this.log("🗑️  Clearing existing index...");
    await this.algolia.clearObjects({
      indexName: this.indexName,
    });

    // Get total count first for progress tracking
    const totalCount = await this.getLocationCount();
    stats.totalProcessed = totalCount;
    this.log(`📊 Found ${totalCount} total locations to sync`);

    if (totalCount === 0) {
      this.log("ℹ️  No locations found in database");
      return;
    }

    // Process with pagination to avoid large queries
    const queryBatchSize = Math.min(this.config.batchSize * 2, 2000); // Query batch size
    const algoliaBatchSize = this.config.batchSize; // Algolia batch size
    let processedCount = 0;
    let offset = 0;

    while (offset < totalCount) {
      try {
        // Fetch batch of locations with pagination
        const locations = await this.getLocationsBatch(offset, queryBatchSize);

        if (locations.length === 0) {
          break; // No more records
        }

        // Process Algolia batches within the DB batch
        for (let i = 0; i < locations.length; i += algoliaBatchSize) {
          const algoliaBatch = locations.slice(i, i + algoliaBatchSize);
          const algoliaDocuments = algoliaBatch.map(
            this.transformLocationToAlgolia.bind(this),
          );

          try {
            await this.algolia.saveObjects({
              indexName: this.indexName,
              objects: algoliaDocuments,
            });
            stats.successfulUpserts += algoliaBatch.length;
            processedCount += algoliaBatch.length;

            const batchNum = Math.floor(processedCount / algoliaBatchSize);
            const totalBatches = Math.ceil(totalCount / algoliaBatchSize);
            this.log(
              `✅ Synced batch ${batchNum}/${totalBatches} (${algoliaBatch.length} records) - Progress: ${Math.round((processedCount / totalCount) * 100)}%`,
            );
          } catch (error) {
            stats.failedUpserts += algoliaBatch.length;
            this.log(
              `❌ Failed to sync Algolia batch at offset ${offset + i}:`,
              error,
            );
          }
        }

        offset += locations.length;

        // Small delay between DB batches to avoid overwhelming the database
        if (offset < totalCount) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        this.log(`❌ Failed to fetch DB batch at offset ${offset}:`, error);
        // Skip this batch and continue
        offset += queryBatchSize;
        stats.failedUpserts += Math.min(
          queryBatchSize,
          totalCount - offset + queryBatchSize,
        );
      }
    }

    this.log(`📈 Full sync completed: ${processedCount} locations processed`);
  }

  /**
   * Incremental sync - only sync updated records with pagination
   */
  private async incrementalSync(stats: SyncStats): Promise<void> {
    this.log("🔄 Performing incremental sync...");

    // Get locations updated since last sync (last 24 hours by default)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      // First get count of updated locations
      const updatedCount = await this.getUpdatedLocationCount(since);

      if (updatedCount === 0) {
        this.log("ℹ️  No locations to sync");
        return;
      }

      stats.totalProcessed = updatedCount;
      this.log(`📦 Found ${updatedCount} updated locations to sync`);

      // Process with pagination for large incremental updates
      const queryBatchSize = Math.min(this.config.batchSize * 2, 1000);
      const algoliaBatchSize = this.config.batchSize;
      let processedCount = 0;
      let offset = 0;

      while (offset < updatedCount) {
        try {
          // Fetch batch of updated locations
          const updatedLocations = await this.getUpdatedLocationsBatch(
            since,
            offset,
            queryBatchSize,
          );

          if (updatedLocations.length === 0) {
            break;
          }

          // Process Algolia batches within the DB batch
          for (let i = 0; i < updatedLocations.length; i += algoliaBatchSize) {
            const algoliaBatch = updatedLocations.slice(
              i,
              i + algoliaBatchSize,
            );
            const algoliaDocuments = algoliaBatch.map(
              this.transformLocationToAlgolia.bind(this),
            );

            try {
              await this.algolia.saveObjects({
                indexName: this.indexName,
                objects: algoliaDocuments,
              });
              stats.successfulUpserts += algoliaBatch.length;
              processedCount += algoliaBatch.length;

              const batchNum = Math.floor(processedCount / algoliaBatchSize);
              const totalBatches = Math.ceil(updatedCount / algoliaBatchSize);
              this.log(
                `✅ Updated batch ${batchNum}/${totalBatches} (${algoliaBatch.length} records) - Progress: ${Math.round((processedCount / updatedCount) * 100)}%`,
              );
            } catch (error) {
              stats.failedUpserts += algoliaBatch.length;
              this.log(
                `❌ Failed to update Algolia batch at offset ${offset + i}:`,
                error,
              );
            }
          }

          offset += updatedLocations.length;

          // Small delay between batches
          if (offset < updatedCount) {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        } catch (error) {
          this.log(
            `❌ Failed to fetch updated locations batch at offset ${offset}:`,
            error,
          );
          offset += queryBatchSize;
          stats.failedUpserts += Math.min(
            queryBatchSize,
            updatedCount - offset + queryBatchSize,
          );
        }
      }

      this.log(
        `📈 Incremental sync completed: ${processedCount} locations processed`,
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch updated locations: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get total count of locations
   */
  private async getLocationCount(): Promise<number> {
    try {
      const result = await this.db
        .selectFrom("locations")
        .select(this.db.fn.count("id").as("count"))
        .executeTakeFirst();

      return Number(result?.count || 0);
    } catch (error) {
      throw new Error(
        `Failed to get location count: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get batch of locations with pagination
   */
  private async getLocationsBatch(
    offset: number,
    limit: number,
  ): Promise<LocationRow[]> {
    try {
      const locations = await this.db
        .selectFrom("locations")
        .selectAll()
        .orderBy("id") // Ensure consistent ordering for pagination
        .limit(limit)
        .offset(offset)
        .execute();

      return locations;
    } catch (error) {
      throw new Error(
        `Failed to fetch locations batch: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get count of updated locations since timestamp
   */
  private async getUpdatedLocationCount(since: Date): Promise<number> {
    try {
      const result = await this.db
        .selectFrom("locations")
        .select(this.db.fn.count("id").as("count"))
        .where("updated_at", ">=", since.toISOString())
        .executeTakeFirst();

      return Number(result?.count || 0);
    } catch (error) {
      throw new Error(
        `Failed to get updated location count: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get batch of updated locations with pagination
   */
  private async getUpdatedLocationsBatch(
    since: Date,
    offset: number,
    limit: number,
  ): Promise<LocationRow[]> {
    try {
      const locations = await this.db
        .selectFrom("locations")
        .selectAll()
        .where("updated_at", ">=", since.toISOString())
        .orderBy("updated_at") // Order by update time for consistent pagination
        .orderBy("id") // Secondary order for ties
        .limit(limit)
        .offset(offset)
        .execute();

      return locations;
    } catch (error) {
      throw new Error(
        `Failed to fetch updated locations batch: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Get all locations (legacy method - now uses pagination internally)
   */
  private async getAllLocations(): Promise<LocationRow[]> {
    // This method is kept for backward compatibility but now uses pagination
    const allLocations: LocationRow[] = [];
    const batchSize = 1000;
    let offset = 0;

    while (true) {
      const batch = await this.getLocationsBatch(offset, batchSize);
      if (batch.length === 0) break;

      allLocations.push(...batch);
      offset += batchSize;

      // Safety check to prevent infinite loops
      if (allLocations.length > 100000) {
        this.log(
          "⚠️  Warning: Very large dataset detected. Consider using full sync instead.",
        );
        break;
      }
    }

    return allLocations;
  }

  /**
   * Transform database location to Algolia document
   */
  private transformLocationToAlgolia(
    location: LocationRow,
  ): AlgoliaLocationDocument {
    // Create address object if we have the required fields
    const address =
      location.street && location.city && location.state && location.postal_code
        ? {
            id: this.generateAddressId(location),
            street: location.street,
            street2: undefined, // Database doesn't have street2 field yet
            city: location.city,
            state: this.getFullStateName(location.state),
            stateCode: location.state,
            postalCode: location.postal_code,
          }
        : null;

    return {
      objectID: location.id,
      name: location.name || "Unknown Location",
      address,
      _geoloc: {
        lat: location.lat,
        lng: location.lon,
      },
      sports: (location.sport_tags || []).map((tag) => tag.toUpperCase()),
      _syncedAt: new Date().toISOString(),
      _updatedAt:
        location.updated_at || location.created_at || new Date().toISOString(),
    };
  }

  /**
   * Generate consistent address ID (matching the API's approach)
   */
  private generateAddressId(location: LocationRow): string {
    const addressData = {
      street: location.street || "",
      city: location.city || "",
      stateCode: location.state || "",
      postalCode: location.postal_code || "",
    };

    const addressString = JSON.stringify(
      addressData,
      Object.keys(addressData).sort(),
    );

    // Simple hash for demo purposes - in production, use crypto.createHash
    let hash = 0;
    for (let i = 0; i < addressString.length; i++) {
      const char = addressString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return `adr_${Math.abs(hash).toString(16).padStart(12, "0").substring(0, 12)}`;
  }

  /**
   * Convert state code to full state name
   */
  private getFullStateName(stateCode: string): string {
    const stateNames: Record<string, string> = {
      AL: "Alabama",
      AK: "Alaska",
      AZ: "Arizona",
      AR: "Arkansas",
      CA: "California",
      CO: "Colorado",
      CT: "Connecticut",
      DE: "Delaware",
      FL: "Florida",
      GA: "Georgia",
      HI: "Hawaii",
      ID: "Idaho",
      IL: "Illinois",
      IN: "Indiana",
      IA: "Iowa",
      KS: "Kansas",
      KY: "Kentucky",
      LA: "Louisiana",
      ME: "Maine",
      MD: "Maryland",
      MA: "Massachusetts",
      MI: "Michigan",
      MN: "Minnesota",
      MS: "Mississippi",
      MO: "Missouri",
      MT: "Montana",
      NE: "Nebraska",
      NV: "Nevada",
      NH: "New Hampshire",
      NJ: "New Jersey",
      NM: "New Mexico",
      NY: "New York",
      NC: "North Carolina",
      ND: "North Dakota",
      OH: "Ohio",
      OK: "Oklahoma",
      OR: "Oregon",
      PA: "Pennsylvania",
      RI: "Rhode Island",
      SC: "South Carolina",
      SD: "South Dakota",
      TN: "Tennessee",
      TX: "Texas",
      UT: "Utah",
      VT: "Vermont",
      VA: "Virginia",
      WA: "Washington",
      WV: "West Virginia",
      WI: "Wisconsin",
      WY: "Wyoming",
      DC: "District of Columbia",
      PR: "Puerto Rico",
      VI: "U.S. Virgin Islands",
      GU: "Guam",
      AS: "American Samoa",
      MP: "Northern Mariana Islands",
    };

    return stateNames[stateCode?.toUpperCase()] || stateCode;
  }

  /**
   * Configure Algolia index settings for optimal search
   */
  async configureIndex(): Promise<void> {
    this.log("⚙️  Configuring Algolia index settings...");

    await this.algolia.setSettings({
      indexName: this.indexName,
      indexSettings: {
        // Searchable attributes in order of importance
        searchableAttributes: [
          "name",
          "address.city",
          "address.state",
          "address.street",
          "sports",
        ],
        // Attributes for faceting (filtering)
        attributesForFaceting: ["sports", "address.stateCode", "address.city"],
        // Custom ranking (secondary sort)
        customRanking: [
          "desc(_syncedAt)", // Prefer recently synced
        ],
        // Geo settings
        attributeForDistinct: "objectID",
        // Results configuration
        hitsPerPage: 25,
        maxValuesPerFacet: 100,
        // Typo tolerance
        typoTolerance: true,
        minWordSizefor1Typo: 3,
        minWordSizefor2Typos: 7,
        // Highlight and snippet
        attributesToHighlight: ["name", "address.city", "address.street"],
        attributesToSnippet: ["name:20"],
      },
    });

    this.log("✅ Index settings configured");
  }

  /**
   * Delete a location from Algolia by ID
   */
  async deleteLocation(locationId: string): Promise<void> {
    try {
      await this.algolia.deleteObject({
        indexName: this.indexName,
        objectID: locationId,
      });
      this.log(`🗑️  Deleted location ${locationId} from Algolia`);
    } catch (error) {
      this.log(`❌ Failed to delete location ${locationId}:`, error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await this.db.destroy();
  }

  private log(message: string, ...args: any[]): void {
    if (this.config.debug || process.env.DEBUG === "true") {
      console.log(`[${new Date().toISOString()}] ${message}`, ...args);
    }
  }

  private logStats(stats: SyncStats): void {
    console.log("\n📊 Sync Statistics:");
    console.log(`   Total processed: ${stats.totalProcessed}`);
    console.log(`   ✅ Successful: ${stats.successfulUpserts}`);
    console.log(`   ❌ Failed: ${stats.failedUpserts}`);
    console.log(`   🗑️  Deleted: ${stats.deletions}`);
    console.log(`   ⏱️  Duration: ${stats.duration}ms`);
    console.log(`   🏁 Completed at: ${stats.endTime?.toISOString()}\n`);
  }
}
