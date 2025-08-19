# 🗄️ Rec Sports Database

The PostgreSQL database configuration and migration system for [Rec Sports](../../README.md) - powering location data, user management, and community features.

Built with **PostgreSQL**, **PostGIS**, **Supabase**, and automated migrations for reliable data management.

---

## 🚀 Getting Started

### Prerequisites

- **[Supabase CLI](https://supabase.com/docs/guides/cli)** - For local database management
- **[Docker](https://docker.com)** - Required by Supabase for local services

### Installation

```bash
# Install Supabase CLI
# macOS
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Install package dependencies
bun install
```

### Quick Start

```bash
# Start local Supabase services
supabase start

# Initialize database with migrations and seeds
bun dev:init

# Generate TypeScript types from schema
bun typegen
```

### Available Commands

```bash
supabase start            # Start local PostgreSQL and services
supabase stop             # Stop all local services
supabase status           # Show service status and URLs
supabase db reset         # Reset database with all migrations
bun dev:init             # Reset database and run seeds
bun typegen              # Generate TypeScript types
```

---

## 🏗️ Architecture

### Core Technologies

- **[PostgreSQL 15](https://postgresql.org)** - Primary relational database
- **[PostGIS](https://postgis.net)** - Geographic data extensions
- **[Supabase](https://supabase.com)** - Database platform and authentication
- **Row-Level Security** - Fine-grained access control
- **Real-time Subscriptions** - Live data updates

### Database Services

When running locally, Supabase provides:

- **PostgreSQL** - Database server on port `54322`
- **Supabase Studio** - Database UI at `http://localhost:54323`
- **Auth Server** - Authentication at `http://localhost:54321`
- **Edge Functions** - Serverless functions at `http://localhost:54321`
- **Inbucket** - Email testing at `http://localhost:54324`

### Key Features

- **🗺️ Geographic Data** - PostGIS for location-based queries
- **🔐 Authentication** - Supabase Auth with social providers
- **🔒 Row-Level Security** - Automatic data access control
- **📡 Real-time** - Live updates via Supabase Realtime
- **🔄 Migrations** - Version-controlled schema changes
- **🌱 Seeding** - Automated test data generation

---

## 📊 Database Schema

### Core Tables

```sql
-- Users (managed by Supabase Auth)
auth.users
├── id (uuid, primary key)
├── email (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- Sports venues and facilities
public.location
├── id (text, primary key) -- Hash ID
├── name (text)
├── latitude (numeric)
├── longitude (numeric)
├── sports (text[]) -- Array of supported sports
├── address (text)
├── amenities (text[])
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- User ratings for locations
public.location_rating
├── id (uuid, primary key)
├── location_id (text, foreign key)
├── user_id (uuid, foreign key)
├── rating (integer) -- 1-5 scale
├── comment (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

-- Community condition reports
public.location_condition_report
├── id (uuid, primary key)
├── location_id (text, foreign key)
├── user_id (uuid, foreign key)
├── condition (text) -- 'excellent', 'good', 'fair', 'poor'
├── description (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Geographic Features

```sql
-- PostGIS extensions for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Spatial index for fast geographic queries
CREATE INDEX location_geography_idx ON location 
USING GIST (ST_MakePoint(longitude, latitude));

-- Example geographic query
SELECT * FROM location 
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint(-87.6298, 41.8781)::geography, -- Chicago coordinates
  1000 -- 1km radius
);
```

---

## 🔄 Migrations

### Migration System

Supabase uses SQL migration files for schema versioning:

```
supabase/migrations/
├── 20250818184531_configure_supabase.sql    # Initial setup
├── 20250818184739_hash_ids.sql              # Hash ID system
└── 20250818184759_locations.sql             # Location tables
```

### Creating Migrations

```bash
# Create a new migration
supabase migrations new add_user_preferences

# Edit the generated SQL file
# supabase/migrations/[timestamp]_add_user_preferences.sql

# Apply migrations
supabase db reset
```

### Migration Best Practices

1. **Backward Compatible** - Use `ADD COLUMN` instead of `ALTER COLUMN`
2. **Rollback Safe** - Include `DROP` statements when appropriate
3. **Descriptive Names** - Clear migration file names
4. **Test Locally** - Always test migrations before deployment

---

## 🌱 Seed Data

### Seeding System

The database includes seed data for development and testing:

```
supabase/seeds/
└── 00_locations.seed.sql    # Sample sports venue data
```

### Sample Seed Data

```sql
-- Insert sample locations across major cities
INSERT INTO location (id, name, latitude, longitude, sports, address) VALUES
('tennis-court-chicago-1', 'Lincoln Park Tennis Courts', 41.9316, -87.6358, 
 ARRAY['tennis'], '2045 N Lincoln Park W, Chicago, IL'),
('basketball-court-nyc-1', 'Riverside Basketball Courts', 40.7831, -73.9712,
 ARRAY['basketball'], 'Riverside Dr & W 103rd St, New York, NY');
```

### Running Seeds

```bash
# Reset database and run all seeds
bun dev:init

# Or manually via Supabase CLI
supabase db reset
```

---

## 🔐 Security

### Row-Level Security (RLS)

All tables use RLS policies for automatic access control:

```sql
-- Enable RLS on location_rating table
ALTER TABLE location_rating ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own ratings
CREATE POLICY "Users can manage own ratings" ON location_rating
  FOR ALL USING (auth.uid() = user_id);

-- Everyone can read location data
CREATE POLICY "Public location access" ON location
  FOR SELECT USING (true);
```

### Authentication Integration

- **JWT Validation** - Automatic user context in policies
- **Social Providers** - Apple, Google sign-in support
- **Email Authentication** - Traditional email/password
- **Session Management** - Secure token refresh

---

## 📡 Real-time Features

### Supabase Realtime

Enable real-time subscriptions on specific tables:

```sql
-- Enable realtime for location condition reports
ALTER PUBLICATION supabase_realtime ADD TABLE location_condition_report;
```

### Client Usage

```typescript
// Subscribe to new condition reports
const subscription = supabase
  .from('location_condition_report')
  .on('INSERT', payload => {
    console.log('New condition report:', payload.new);
  })
  .subscribe();
```

---

## 🔧 Development

### Local Development Workflow

1. **Start Services** - `supabase start`
2. **Reset Database** - `bun dev:init` (when schema changes)
3. **Generate Types** - `bun typegen` (after schema changes)
4. **Run API** - Start the API server to connect
5. **Access Studio** - `http://localhost:54323` for database UI

### Environment Configuration

```bash
# Generated by Supabase CLI
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Type Generation

Automatic TypeScript type generation from the database schema:

```bash
# Generate types
bun typegen

# Output: supabase/supabase.types.ts
```

Example generated types:

```typescript
export interface Database {
  public: {
    Tables: {
      location: {
        Row: {
          id: string;
          name: string;
          latitude: number;
          longitude: number;
          sports: string[];
          // ...
        };
        Insert: {
          id: string;
          name: string;
          // ...
        };
      };
    };
  };
}
```

---

## 🧪 Testing

### Test Database

Supabase provides an isolated test environment:

```bash
# Reset to clean state for testing
supabase db reset

# Run tests against local database
bun test
```

### Data Validation

```sql
-- Constraints ensure data integrity
ALTER TABLE location_rating 
ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE location 
ADD CONSTRAINT valid_coordinates CHECK (
  latitude >= -90 AND latitude <= 90 AND
  longitude >= -180 AND longitude <= 180
);
```

---

## 🚀 Production

### Supabase Cloud

For production deployment:

1. **Create Project** on [supabase.com](https://supabase.com)
2. **Link Project** - `supabase link --project-ref your-ref`
3. **Push Migrations** - `supabase db push`
4. **Configure Environment** - Update API connection strings

### Backup & Recovery

```bash
# Export database schema
supabase db dump --schema-only > schema.sql

# Export data
supabase db dump --data-only > data.sql

# Restore from backup
psql -d postgres -f schema.sql
psql -d postgres -f data.sql
```

---

## 📊 Monitoring

### Database Metrics

Supabase provides built-in monitoring:

- **Query Performance** - Slow query detection
- **Connection Pool** - Connection usage metrics
- **Storage Usage** - Database size tracking
- **Real-time Usage** - Subscription metrics

### Health Checks

```sql
-- Basic connectivity test
SELECT 1;

-- PostGIS functionality test
SELECT PostGIS_Version();

-- Auth system test
SELECT auth.uid();
```

---

## 📚 Related Documentation

- **[Root Project README](../../README.md)** - Overall project architecture
- **[API Package](../api/README.md)** - NestJS GraphQL API
- **[Types Package](../types/README.md)** - Generated TypeScript types
- **[Supabase Docs](https://supabase.com/docs)** - Platform documentation
- **[PostGIS Manual](https://postgis.net/docs/)** - Geographic extensions
- **[PostgreSQL Docs](https://www.postgresql.org/docs/)** - Database documentation

---

**[🏠 Back to Main Project](../../README.md)**