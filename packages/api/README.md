# 🔗 Rec Sports GraphQL API

The NestJS-powered GraphQL API backend for [Rec Sports](../../README.md) - providing real-time sports venue data and community features.

Built with **NestJS**, **Apollo Server**, **PostgreSQL**, and **Supabase** for scalable, type-safe API operations.

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Supabase CLI](https://supabase.com/docs/guides/cli)** - For local database management
- **PostgreSQL** - Database (via Supabase local development)

### Installation & Setup

```bash
# Install dependencies
bun install

# Start local database (first time)
cd ../database
supabase start
bun dev:init

# Generate GraphQL types
bun typegen:gql

# Start development server
bun start:dev
```

The API will be available at `http://localhost:3000/graphql` with GraphQL Playground enabled in development.

### Available Commands

```bash
bun start:dev         # Development server with hot reload
bun start:prod        # Production server
bun build            # Build for production
bun typegen:gql      # Generate GraphQL TypeScript types
bun test             # Run Jest unit tests
bun test:cov         # Run tests with coverage
bun lint             # Run ESLint with auto-fix
```

---

## 🏗️ Architecture

### Core Technologies

- **[NestJS](https://nestjs.com)** - Scalable Node.js framework
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - GraphQL server implementation
- **[PostgreSQL](https://postgresql.org)** - Primary database with PostGIS
- **[Supabase](https://supabase.com)** - Authentication and real-time features
- **[Kysely](https://kysely.dev)** - Type-safe SQL query builder
- **[TypeScript](https://www.typescriptlang.org)** - Full type safety

### Project Structure

```
src/
├── database/              # Database connection and decorators
│   ├── database.decorator.ts
│   ├── database.module.ts
│   └── database.service.ts
├── locations/            # Location-related features
│   ├── dto/             # Data Transfer Objects
│   ├── locations.module.ts
│   ├── locations.resolver.ts
│   ├── locations.service.ts
│   └── ...
├── app.module.ts         # Root application module
├── main.ts              # Application entry point
└── schema.graphql       # GraphQL schema definition
```

### Key Features

- **🗺️ Location Services** - Sports venue discovery and management
- **👥 User Management** - Authentication and user profiles
- **🏃 Sports Data** - Multi-sport facility information
- **⭐ Community Features** - Reviews, ratings, and reports
- **🔐 Secure Authentication** - JWT-based auth with Supabase
- **📍 Geographic Queries** - PostGIS-powered location search

---

## 📊 GraphQL Schema

### Schema-First Development

The API uses a **schema-first** approach with automatic type generation:

1. Define schema in `src/schema.graphql`
2. Generate TypeScript types with `bun typegen:gql`
3. Implement resolvers with full type safety

### Core Types

```graphql
type Location {
  id: ID!
  name: String!
  latitude: Float!
  longitude: Float!
  sports: [Sport!]!
  address: String
  amenities: [String!]!
}

type Query {
  locations(region: Region, sports: [Sport!], page: Page): LocationsResponse!
  location(id: ID!): Location
}

type Mutation {
  createLocationReport(input: LocationReportInput!): LocationReport!
  rateLocation(input: LocationRatingInput!): LocationRating!
}
```

### GraphQL Playground

In development, access the interactive GraphQL Playground at:
`http://localhost:3000/graphql`

---

## 🗄️ Database Integration

### Supabase Setup

The API connects to a local Supabase instance for development:

```bash
# Start local Supabase (from packages/database/)
supabase start

# Reset database with migrations and seeds
supabase db reset

# View local services
supabase status
```

### Database Services

- **PostgreSQL** - Main database on port `54322`
- **Supabase Studio** - Database UI at `http://localhost:54323`
- **Inbucket** - Email testing at `http://localhost:54324`

### Type-Safe Queries

Using Kysely for type-safe database operations:

```typescript
// Example service method
async findLocationsByRegion(region: Region): Promise<Location[]> {
  return this.database
    .selectFrom('location')
    .selectAll()
    .where('latitude', '>=', region.south)
    .where('latitude', '<=', region.north)
    .where('longitude', '>=', region.west)
    .where('longitude', '<=', region.east)
    .execute();
}
```

---

## 🔐 Authentication

### Supabase Authentication

The API integrates with Supabase Auth for secure user management:

- **JWT validation** for protected routes
- **Social sign-in** support (Apple, Google)
- **Row-level security** at database level
- **Real-time subscriptions** for live data

### Authentication Flow

1. Client authenticates with Supabase (mobile/web)
2. Supabase returns JWT token
3. Client includes token in GraphQL requests
4. API validates JWT and extracts user context
5. Resolvers access authenticated user data

### Protected Resolvers

```typescript
@UseGuards(JwtAuthGuard)
@Mutation(() => LocationReport)
async createLocationReport(
  @Args('input') input: LocationReportInput,
  @CurrentUser() user: User
): Promise<LocationReport> {
  return this.locationsService.createReport(input, user.id);
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Generate coverage report
bun test:cov
```

### Test Structure

```
src/
├── locations/
│   ├── locations.service.spec.ts    # Service unit tests
│   ├── locations.resolver.spec.ts   # Resolver unit tests
│   └── ...
```

### Testing Utilities

- **NestJS Testing** - Framework testing utilities
- **Jest** - Test runner and assertions
- **Supertest** - HTTP endpoint testing
- **Test Database** - Isolated test environment

---

## 🔧 Development

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Configure required variables:
   ```bash
   # Database
   DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
   
   # Supabase
   SUPABASE_URL=http://localhost:54321
   SUPABASE_ANON_KEY=your_anon_key
   
   # GraphQL
   GRAPHQL_PLAYGROUND=true
   ```

### Code Generation

The API automatically generates TypeScript types from the GraphQL schema:

```bash
# Manual type generation
bun typegen:gql

# Output: src/graphql.ts
```

This runs automatically before builds and development server starts.

### Adding New Features

1. **Update GraphQL schema** in `src/schema.graphql`
2. **Generate types** with `bun typegen:gql`
3. **Create module** with service, resolver, and DTOs
4. **Add to app module** imports
5. **Write tests** for new functionality

### ESLint Configuration

The API uses custom ESLint rules for consistent code style:

- **Import ordering** - Specific group patterns
- **TypeScript rules** - @typescript-eslint/recommended
- **Auto-fix** - Available with `bun lint`

---

## 🏗️ Build & Deployment

### Production Build

```bash
# Build the application
bun build

# Output: dist/ directory
```

### Production Server

```bash
# Start production server
bun start:prod
```

### Docker Support

```dockerfile
# Multi-stage build
FROM oven/bun:1 as build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY dist/ ./dist/
EXPOSE 3000
CMD ["bun", "dist/main.js"]
```

---

## 🌐 API Endpoints

### GraphQL Endpoint

- **Development**: `http://localhost:3000/graphql`
- **Production**: `https://api.recsports.app/graphql`

### Health Checks

- **Health**: `GET /health` - Basic health check
- **Database**: `GET /health/database` - Database connectivity

---

## 🔗 Integration

### Client Libraries

The API works with any GraphQL client:

- **Apollo Client** (React/React Native)
- **Relay** (React)
- **urql** (Universal)
- **GraphQL Yoga** (Node.js)

### Generated Types

The `@rec/types` package exports generated TypeScript types:

```typescript
import { Location, LocationsQuery, Sport } from '@rec/types';
```

---

## 📚 Related Documentation

- **[Root Project README](../../README.md)** - Overall project architecture
- **[Database Package](../database/README.md)** - Database setup and migrations
- **[Types Package](../types/README.md)** - Generated GraphQL types
- **[Mobile App](../../apps/mobile/README.md)** - React Native client
- **[Web App](../../apps/web/README.md)** - React Router client
- **[NestJS Docs](https://docs.nestjs.com)** - Framework documentation
- **[Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)** - GraphQL server

---

**[🏠 Back to Main Project](../../README.md)**
