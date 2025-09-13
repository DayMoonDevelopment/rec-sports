import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Export main classes and types for programmatic use
export { AlgoliaLocationSync } from "./sync";
export type {
  AlgoliaLocationDocument,
  LocationRow,
  SyncConfig,
  SyncStats,
} from "./types";

// If this file is run directly, execute the CLI
if (require.main === module) {
  // Import and run CLI directly
  import("./cli")
    .then((cli) => {
      return cli.main();
    })
    .catch((error) => {
      console.error("Failed to run CLI:", error);
      process.exit(1);
    });
}
