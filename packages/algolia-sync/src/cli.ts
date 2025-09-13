#!/usr/bin/env node

import { AlgoliaLocationSync } from "./sync";
import type { SyncConfig } from "./types";

// Parse command line arguments
function parseArgs(): SyncConfig & {
  configureIndex?: boolean;
  help?: boolean;
} {
  const args = process.argv.slice(2);

  const config: SyncConfig & { configureIndex?: boolean; help?: boolean } = {
    batchSize: parseInt(process.env.BATCH_SIZE || "1000"),
    debug: process.env.DEBUG === "true",
    fullSync: false,
    incrementalSync: false,
    configureIndex: false,
    help: false,
  };

  for (const arg of args) {
    switch (arg) {
      case "--full":
      case "-f":
        config.fullSync = true;
        break;
      case "--incremental":
      case "-i":
        config.incrementalSync = true;
        break;
      case "--configure":
      case "-c":
        config.configureIndex = true;
        break;
      case "--debug":
      case "-d":
        config.debug = true;
        break;
      case "--help":
      case "-h":
        config.help = true;
        break;
      default:
        if (arg.startsWith("--batch-size=")) {
          config.batchSize = parseInt(arg.split("=")[1]) || 1000;
        } else if (arg.startsWith("--batch-size")) {
          // Handle --batch-size 500 format
          const nextArg = args[args.indexOf(arg) + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            config.batchSize = parseInt(nextArg) || 1000;
          }
        }
        break;
    }
  }

  // Default to incremental if no sync type specified
  if (
    !config.fullSync &&
    !config.incrementalSync &&
    !config.configureIndex &&
    !config.help
  ) {
    config.incrementalSync = true;
  }

  return config;
}

function printHelp(): void {
  console.log(`
🚀 Rec Sports Algolia Sync Tool

USAGE:
  bun sync [OPTIONS]

OPTIONS:
  -f, --full              Perform full sync (rebuild entire index)
  -i, --incremental       Perform incremental sync (default)
  -c, --configure         Configure Algolia index settings
  -d, --debug             Enable debug logging
  --batch-size <number>   Set batch size for processing (default: 1000)
  -h, --help              Show this help message

EXAMPLES:
  bun sync                     # Incremental sync (default)
  bun sync --full              # Full sync
  bun sync --configure         # Configure index settings only
  bun sync --full --debug      # Full sync with debug logging
  bun sync --batch-size 500    # Incremental sync with custom batch size

ENVIRONMENT VARIABLES:
  DATABASE_URL                 PostgreSQL database connection string
  ALGOLIA_APP_ID               Algolia application ID
  ALGOLIA_ADMIN_API_KEY        Algolia admin API key
  ALGOLIA_INDEX_NAME           Algolia index name (default: locations)
  BATCH_SIZE                   Default batch size (default: 1000)
  DEBUG                        Enable debug logging (true/false)
`);
}

async function validateEnvironment(): Promise<void> {
  const required = ["DATABASE_URL", "ALGOLIA_APP_ID", "ALGOLIA_ADMIN_API_KEY"];

  const missing = required.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((env) => console.error(`   ${env}`));
    console.error("\n💡 Copy .env.example to .env and fill in the values");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const config = parseArgs();

  if (config.help) {
    printHelp();
    return;
  }

  try {
    await validateEnvironment();

    const sync = new AlgoliaLocationSync(config);

    if (config.configureIndex) {
      console.log("⚙️  Configuring Algolia index...");
      await sync.configureIndex();
      console.log("✅ Index configuration completed");
      return;
    }

    const stats = await sync.sync();

    // Exit with error code if there were failures
    if (stats.failedUpserts > 0) {
      console.error(`\n❌ Sync completed with ${stats.failedUpserts} failures`);
      process.exit(1);
    } else {
      console.log("\n🎉 Sync completed successfully!");
    }
  } catch (error) {
    console.error("\n💥 Sync failed:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Sync interrupted by user");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Sync terminated");
  process.exit(0);
});

// Export the main function for use by index.ts
export { main };

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
}
