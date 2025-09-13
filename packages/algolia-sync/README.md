# Rec Sports Algolia Sync

A simple utility to sync location data from Supabase to Algolia for enhanced search capabilities.

## Features

- **Full Sync**: Rebuild entire Algolia index from scratch
- **Incremental Sync**: Only sync locations updated in the last 24 hours
- **Batch Processing**: Process large datasets efficiently in configurable batches
- **Index Configuration**: Automatically configure Algolia index settings for optimal search
- **Robust Error Handling**: Detailed logging and error reporting
- **CLI Interface**: Easy-to-use command-line interface

## Installation

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
```

## Environment Setup

Configure the following environment variables in `.env`:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Algolia Configuration
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_api_key
ALGOLIA_INDEX_NAME=locations

# Optional Configuration
BATCH_SIZE=1000
DEBUG=false
```

## Usage

### Command Line Interface

```bash
# Incremental sync (default - syncs last 24 hours of changes)
bun sync

# Full sync (rebuilds entire index)
bun sync --full

# Configure Algolia index settings
bun sync --configure

# Debug mode with verbose logging
bun sync --debug

# Custom batch size
bun sync --batch-size 500

# Get help
bun sync --help
```

### Programmatic Usage

```typescript
import { AlgoliaLocationSync } from '@rec-sports/algolia-sync';

const sync = new AlgoliaLocationSync({
  batchSize: 1000,
  debug: true,
  fullSync: true,
  incrementalSync: false,
});

// Perform sync
const stats = await sync.sync();
console.log('Sync completed:', stats);

// Configure index
await sync.configureIndex();

// Delete specific location
await sync.deleteLocation('location-id');
```

## Data Structure

The sync process transforms Supabase location data into Algolia documents with the following structure:

```typescript
{
  objectID: string;           // Location ID
  name: string;               // Location name
  address: {                  // Structured address
    id: string;
    street: string;
    city: string;
    state: string;            // Full state name
    stateCode: string;        // 2-letter state code
    postalCode: string;
  } | null;
  _geoloc: {                  // Geo coordinates for Algolia
    lat: number;
    lng: number;
  };
  sports: string[];           // Available sports (uppercase)
  bounds: Array<{             // Location boundaries
    latitude: number;
    longitude: number;
  }>;
  facilities?: Array<{        // Associated facilities
    id: string;
    sport: string;
    geo: { latitude: number; longitude: number; };
    bounds: Array<{ latitude: number; longitude: number; }>;
  }>;
  _syncedAt: string;          // Sync timestamp
  _updatedAt: string;         // Last update timestamp
}
```

## Algolia Index Configuration

The sync tool automatically configures your Algolia index with optimal settings:

- **Searchable Attributes**: name, address.city, address.state, address.street, sports
- **Faceting**: sports, address.stateCode, address.city
- **Geo Search**: Enabled via `_geoloc` attribute
- **Typo Tolerance**: Enabled with smart defaults
- **Custom Ranking**: Recently synced locations preferred

## Monitoring and Logging

The tool provides detailed statistics after each sync:

```
📊 Sync Statistics:
   Total processed: 1,234
   ✅ Successful: 1,230
   ❌ Failed: 4
   🗑️  Deleted: 0
   ⏱️  Duration: 15,432ms
   🏁 Completed at: 2024-01-15T10:30:00.000Z
```

## Development

```bash
# Build TypeScript
bun run build

# Development mode with watch
bun run dev

# Run sync in development
bun run sync

# Run tests (if added)
bun test
```

## Deployment

This package can be:

1. **Scheduled Job**: Run via cron or CI/CD pipeline
2. **Database Trigger**: Execute on location updates
3. **Manual Operation**: Run as needed for data migrations

Example cron job:
```bash
# Run incremental sync every hour
0 * * * * cd /path/to/project && bun run sync >> /var/log/algolia-sync.log 2>&1

# Run full sync daily at 2 AM
0 2 * * * cd /path/to/project && bun run sync --full >> /var/log/algolia-sync.log 2>&1
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure all required env vars are set
2. **Permission Errors**: Verify Supabase service role key has read access
3. **Algolia Rate Limits**: Reduce batch size if hitting rate limits
4. **Memory Issues**: Reduce batch size for large datasets

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
bun sync --debug
# or
DEBUG=true bun sync
```

## Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Test with both full and incremental sync modes
