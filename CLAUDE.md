# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rec Sports** is a sports community application that enables athlete communities for continuous play. It's built as a Bun-based monorepo with a React Native mobile app (Expo SDK 53), React Router marketing website, NestJS GraphQL API, and supporting services.

## Monorepo Structure

```
rec-sports/
├── apps/
│   ├── mobile/        # React Native mobile app (Expo SDK 53)
│   └── web/           # React Router marketing website
├── packages/
│   ├── api/           # NestJS GraphQL API backend
│   └── database/      # PostgreSQL database config & migrations
└── Root workspace files
```

## Development Commands

### Root Workspace

```bash
bun install                    # Install all workspace dependencies
```

**Note**: The root `package.json` defines workspaces as `["apps/*", "packages/*"]`. Dependencies are managed at the individual project level.

### Mobile App (apps/mobile/)

Uses **Bun** as package manager:

```bash
bun install                   # Install dependencies
bun start                     # Start Expo dev server
bun android                   # Run on Android emulator
bun ios                       # Run on iOS simulator
bun lint                      # Run ESLint
bun codegen:gql               # Generate GraphQL types from schema
bun typecheck                 # TypeScript type checking
bun prebuild                  # Clean prebuild for native platforms
```

### Marketing Website (apps/web/)

Uses **Bun** as package manager:

```bash
bun install                   # Install dependencies
bun dev                       # Start React Router development server
bun build                     # Build for production
bun start                     # Start production server
bun typecheck                 # TypeScript type checking
bun lint                      # ESLint
bun lint:fix                  # ESLint with auto-fix
```

### Backend API (packages/api/)

Uses **Bun** as package manager:

```bash
bun install                   # Install dependencies
bun build                     # Build for production
bun start                     # Start production server (uses NestJS)
bun start:dev                 # Development server with watch mode
bun start:prod                # Start production server with Bun runtime
bun test                      # Run Jest tests
bun test:cov                  # Run tests with coverage
bun lint                      # ESLint with auto-fix
bun format                    # Format code with Prettier
```

**Important**: GraphQL types are auto-generated using NestJS GraphQL definitions factory via `scripts/generate-gql-typings.ts`.

### Database (packages/database/)

```bash
bun dev:init                 # Reset local database with all migrations and run typegen
bun supabase:typegen         # Generate TypeScript types from Supabase schema
bun dev:restart              # Stop, start, and reset Supabase with fresh data
supabase start               # Start local PostgreSQL instance
supabase db reset            # Reset database with all migrations
supabase migrations new <name>  # Create new migration file
```

**Note**: No separate background tasks or scraper packages currently exist in this codebase.

## Architecture Patterns

### Authentication Flow

- **Mobile**: Social sign-in (Apple/Google) → Supabase Auth JWT
- **API**: NestJS + Supabase Auth integration via JWT validation
- **Database**: Row-level security policies on all tables

### GraphQL API Design

- **Code-first**: GraphQL schema generated from TypeScript resolvers and models
- **Code generation**: NestJS GraphQL definitions factory generates TypeScript types
- **Location**: Script at `packages/api/scripts/generate-gql-typings.ts`
- **Schema output**: Generated schema available at `packages/api/schema.gql`

### Mobile App Architecture

- **Routing**: File-based routing with Expo Router (`app/` directory)
- **State Management**: Apollo Client for server state, React Context for app state
- **Styling**: NativeWind (React Native Tailwind CSS) with custom styling
- **Storage**: MMKV for Apollo cache persistence
- **GraphQL Codegen**: Client-side type generation from API schema via `gql-codegen.ts`
- **Icons**: Custom icon components in `src/icons/`

### Marketing Website Architecture

- **Framework**: React Router (React-based full-stack framework)
- **Routing**: File-based routing with dynamic sport/city pages
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development and builds
- **Deployment**: Server-side rendering with static optimization

### Web App Routing Structure

When creating a new route in the web app, follow this pattern:

```
route-name/
├── route.ts                  # Export component, loader, action, etc.
├── route.component.tsx       # Main component
├── route.loader.ts           # Data loading (optional)
├── route.action.ts           # Form actions (optional)
└── route.handle.ts           # Route configuration (optional)
```


### Database Schema

Core entities: `user`, `sport`, `location`, `game`, `team`, `game_invite`, `location_rating`, `location_condition_report`

## Package Manager Usage

**All projects use Bun** as the package manager for consistency and performance:

- **Root Workspace**: Bun
- **Mobile App**: Bun  
- **Marketing Website**: Bun
- **API Backend**: Bun
- **Database**: Bun

## Build & Deployment

### Mobile (EAS Build)

- **Profiles**: Development, Production in `apps/mobile/eas.json`
- **EAS CLI**: Minimum version 5.9.3 required

### API Deployment

- **Build**: Webpack via NestJS CLI
- **Output**: `packages/api/dist/` directory
- **Target**: ES2021, CommonJS modules

### Marketing Website Deployment

- **Build**: Vite via React Router
- **Output**: `apps/web/build/` directory
- **Target**: Server-side rendering with static optimization


## Development Workflow

### Branch Strategy

- **Main branch**: `main`

## Key Configuration Files

- `apps/mobile/eas.json` - Mobile build configuration
- `apps/mobile/app.json` - Expo app configuration
- `apps/web/react-router.config.ts` - React Router configuration
- `apps/web/vite.config.ts` - Vite build configuration
- `packages/api/scripts/generate-gql-typings.ts` - GraphQL type generation
- `packages/api/schema.gql` - Generated GraphQL schema
- `packages/database/supabase/config.toml` - Supabase configuration
- Root `package.json` - Workspace definition

## Generated Files (Do Not Edit)

- `packages/api/src/graphql.ts` - Auto-generated GraphQL TypeScript definitions  
- `packages/database/supabase/+types.ts` - Auto-generated Supabase TypeScript types
- `apps/mobile/src/gql/types.ts` - Auto-generated GraphQL client types
- `apps/mobile/src/**/*.generated.ts` - Auto-generated operation-specific types

## Environment Variables

Each service has its own `.env` file:

- Database URLs and auth keys (Supabase)
- OAuth client IDs (Google/Apple)
- API endpoints and configuration

## Testing

### Mobile App

- **Framework**: Jest with Expo preset
- **Command**: `bun test`
- **Location**: Tests alongside components

### Backend API

- **Framework**: Jest with NestJS testing utilities
- **Commands**: `bun test`, `bun test:cov` (with coverage)
- **Location**: `*.spec.ts` files alongside source

## ESLint & Code Quality

### Backend ESLint Configuration

- **Plugins**: `@typescript-eslint`, `import`, `prettier`
- **Rules**: Import ordering with specific group patterns
- **Auto-fix**: Available via `bun lint`

### Import Order Rules

1. Built-in Node.js modules (`path`, `fs`)
2. External packages (`@nestjs/graphql`)
3. Internal imports (relative paths)
4. Type imports (grouped separately)

## Current State Notes

The repository is organized as a clean monorepo with:

- **Apps** (`apps/`): User-facing applications (mobile, web)
- **Packages** (`packages/`): Shared services and libraries (api, database)

This structure provides clear separation of concerns and dependencies between different parts of the system. All components use Bun as the package manager for consistency and performance.
