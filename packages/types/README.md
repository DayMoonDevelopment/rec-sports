# 📦 @rec/types

Shared TypeScript types and type-safe GraphQL utilities for [Rec Sports](../../README.md) - providing consistent type definitions across all applications.

Generated from the **GraphQL schema** and **database schema** for full type safety throughout the monorepo.

---

## 🎯 Purpose

This package provides:

- **🔄 GraphQL Types** - Auto-generated from API schema
- **🗄️ Database Types** - Auto-generated from Supabase schema  
- **⚡ Type-safe `gql` function** - GraphQL operations with full intellisense
- **🔗 Shared Interfaces** - Common types used across apps

---

## 🚀 Installation & Usage

This package is automatically linked in the monorepo workspace.

```typescript
import { 
  gql, 
  Location, 
  LocationsResponse, 
  Sport,
  Database 
} from '@rec/types';
```

### GraphQL Operations

```typescript
// Type-safe GraphQL query definition
const GET_LOCATIONS = gql<
  { locations: LocationsResponse },
  { page?: Page; region?: Region; sports?: Sport[] }
>`
  query GetLocations($page: Page, $region: Region, $sports: [Sport!]) {
    locations(page: $page, region: $region, sports: $sports) {
      nodes {
        id
        name
        latitude
        longitude
        sports
        amenities
      }
      hasMore
      totalCount
    }
  }
`;

// Usage with Apollo Client
const { data, loading, error } = useQuery(GET_LOCATIONS, {
  variables: { 
    page: { limit: 20, offset: 0 },
    region: { north: 42, south: 41, east: -87, west: -88 },
    sports: ['tennis', 'basketball']
  }
});
```

### Database Types

```typescript
// Type-safe database operations
import { Database } from '@rec/types';

type LocationRow = Database['public']['Tables']['location']['Row'];
type LocationInsert = Database['public']['Tables']['location']['Insert'];

// Fully typed database queries
const location: LocationRow = {
  id: 'tennis-court-1',
  name: 'Central Park Tennis Courts',
  latitude: 40.7829,
  longitude: -73.9654,
  sports: ['tennis'],
  amenities: ['lighting', 'restrooms'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};
```

---

## 📊 Available Types

### GraphQL Schema Types

```typescript
// Core entities
interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  sports: Sport[];
  amenities: string[];
  address?: string;
}

interface LocationsResponse {
  nodes: Location[];
  hasMore: boolean;
  totalCount: number;
}

// Input types
interface Region {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface Page {
  limit: number;
  offset: number;
}

// Enums
enum Sport {
  TENNIS = 'tennis',
  BASKETBALL = 'basketball',
  SOCCER = 'soccer',
  PICKLEBALL = 'pickleball',
  VOLLEYBALL = 'volleyball',
  // ... 50+ sports
}
```

### Database Schema Types

```typescript
// Auto-generated from Supabase schema
interface Database {
  public: {
    Tables: {
      location: {
        Row: LocationRow;
        Insert: LocationInsert;
        Update: LocationUpdate;
      };
      location_rating: {
        Row: LocationRatingRow;
        Insert: LocationRatingInsert;
        Update: LocationRatingUpdate;
      };
      // ... all database tables
    };
    Views: {
      // Database views
    };
    Functions: {
      // Database functions
    };
  };
}
```

---

## 🔄 Type Generation

### Automatic Generation

Types are automatically generated as part of the development workflow:

1. **GraphQL types** - Generated when API server starts
2. **Database types** - Generated when database schema changes
3. **Package build** - Types are bundled for distribution

### Manual Generation

```bash
# Generate GraphQL types (from packages/api/)
cd ../api
bun typegen:gql

# Generate database types (from packages/database/)
cd ../database
bun typegen

# Build types package
bun run build
```

### Generated Files

```
src/generated/
├── gql.ts              # GraphQL types and utilities
├── database.types.ts   # Supabase database types
└── index.ts           # Re-exports
```

---

## 🎨 Type-Safe GraphQL

### The `gql` Function

The package exports a type-safe `gql` template literal:

```typescript
// Generic signature
const gql = <TData = any, TVariables = Record<string, any>>(
  query: TemplateStringsArray | string
) => TypedDocumentNode<TData, TVariables>;

// Usage provides full type safety
const query = gql<GetLocationsQuery, GetLocationsVariables>`
  query GetLocations($sports: [Sport!]) {
    locations(sports: $sports) {
      nodes { id name sports }
    }
  }
`;

// TypeScript knows the exact shape of data and variables
const { data } = useQuery(query, {
  variables: { sports: ['tennis'] } // ✅ Type-checked
});

console.log(data.locations.nodes[0].name); // ✅ Type-safe access
```

### Integration with Apollo Client

```typescript
// Fully typed Apollo Client operations
import { useQuery, useMutation } from '@apollo/client';
import { gql, CreateLocationReportMutation } from '@rec/types';

const CREATE_REPORT = gql<CreateLocationReportMutation>`
  mutation CreateLocationReport($input: LocationReportInput!) {
    createLocationReport(input: $input) {
      id
      condition
      description
    }
  }
`;

const [createReport] = useMutation(CREATE_REPORT);

// Variables are type-checked
await createReport({
  variables: {
    input: {
      locationId: 'location-123',
      condition: 'excellent', // ✅ Only valid conditions accepted
      description: 'Courts in great shape!'
    }
  }
});
```

---

## 🛠️ Development

### Package Structure

```
packages/types/
├── src/
│   ├── generated/        # Auto-generated types
│   │   ├── gql.ts       # GraphQL types
│   │   └── database.ts  # Database types
│   └── index.ts         # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

### Build Process

```bash
# Build the package
bun run build

# Output: dist/ directory with compiled types
```

### Type Safety Guarantees

- **GraphQL Operations** - Variables and responses are fully typed
- **Database Queries** - Row types match actual schema
- **Cross-Package** - Consistent types across mobile, web, and API
- **Runtime Safety** - Types are validated at the schema level

---

## 🔗 Integration

### Monorepo Integration

This package is consumed by:

- **📱 Mobile App** (`apps/mobile/`) - React Native with Apollo Client
- **🌐 Web App** (`apps/web/`) - React Router with GraphQL
- **🔗 API Server** (`packages/api/`) - NestJS resolvers and services

### Client Usage Examples

```typescript
// Mobile app (React Native)
import { useQuery } from '@apollo/client';
import { gql, GetNearbyLocationsQuery } from '@rec/types';

// Web app (React Router)
import { LoaderFunctionArgs } from 'react-router';
import { gql, Location } from '@rec/types';

// API server (NestJS)
import { Resolver, Query } from '@nestjs/graphql';
import { Location, LocationsResponse } from '@rec/types';
```

---

## ⚠️ What This Package Does NOT Include

- **Business Logic** - No custom hooks or utilities
- **GraphQL Client** - No Apollo Client configuration
- **Query Documents** - Individual apps define their queries
- **Runtime Validation** - Types are compile-time only
- **State Management** - No Redux, Zustand, or context providers

Each application implements its own business logic using these types as the foundation.

---

## 📚 Related Documentation

- **[Root Project README](../../README.md)** - Overall project architecture
- **[API Package](../api/README.md)** - GraphQL schema source
- **[Database Package](../database/README.md)** - Database schema source
- **[Mobile App](../../apps/mobile/README.md)** - React Native client usage
- **[Web App](../../apps/web/README.md)** - React Router client usage
- **[GraphQL Code Generator](https://the-guild.dev/graphql/codegen)** - Type generation tool

---

**[🏠 Back to Main Project](../../README.md)**