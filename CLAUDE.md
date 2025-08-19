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
│   ├── database/      # PostgreSQL database config & migrations
│   ├── tasks/         # Background jobs (Trigger.dev)
│   └── ui/            # Shared UI components
├── scraper/           # Sports facility data scraper (Bun)
└── trigger.config.ts  # Background task configuration
```

## Development Commands

### Root Workspace

```bash
bun install                    # Install all workspace dependencies
```

**Note**: The root `package.json` defines workspaces as `["apps/*", "services/*"]` but the actual structure uses `apps/` and `packages/` directories. Dependencies are managed at the individual project level.

### Mobile App (apps/mobile/)

Uses **Bun** as package manager:

```bash
bun install                   # Install dependencies
bun start                     # Start Expo dev server
bun android                   # Run on Android emulator
bun ios                       # Run on iOS simulator
bun web                       # Run on web
bun lint                      # Run ESLint
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
bun typegen:gql               # Generate GraphQL TypeScript definitions
bun build                    # Build for production
bun start:dev                # Development server with watch mode
bun start:prod               # Start production server
bun test                     # Run Jest tests
bun test:cov                 # Run tests with coverage
bun lint                     # ESLint with auto-fix
```

**Important**: GraphQL types are auto-generated from `src/schema.graphql` before builds and dev server starts.

### Database (packages/database/)

```bash
bun dev:init                 # Reset local database with all migrations
bun typegen                  # Generate TypeScript types from Supabase schema
supabase start               # Start local PostgreSQL instance
supabase db reset            # Reset database with all migrations
supabase migrations new <name>  # Create new migration file
```

### Background Tasks (packages/tasks/)

```bash
bun install                   # Install dependencies
bun dev                       # Start Trigger.dev development server
bun build                     # Build tasks
bun typecheck                 # TypeScript type checking
bun deploy:staging            # Deploy to staging environment
bun deploy:prod              # Deploy to production environment
```

### Data Scraper (scraper/)

Uses **Bun** as runtime:

```bash
bun install                   # Install dependencies
bun run index.ts              # Run scraper for US sports facilities
```

## Architecture Patterns

### Authentication Flow

- **Mobile**: Social sign-in (Apple/Google) → Supabase Auth JWT
- **API**: NestJS + Supabase Auth integration via JWT validation
- **Database**: Row-level security policies on all tables

### GraphQL API Design

- **Schema-first**: GraphQL schema in `packages/api/src/schema.graphql`
- **Code generation**: Automatic TypeScript types via `bun typegen:gql`
- **Location**: Script at `packages/api/scripts/generate-gql-typings.ts`
- **Auto-run**: Types generate before builds and dev server starts

### Mobile App Architecture

- **Routing**: File-based routing with Expo Router
- **State Management**: Apollo Client for server state, React Context for app state
- **Styling**: React Native Unistyles with adaptive theming
- **Storage**: MMKV for Apollo cache persistence
- **Icons**: Auto-generated from SVG assets in `assets/svg-icons/`

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

### Background Jobs Architecture

- **Framework**: Trigger.dev for reliable background task processing
- **Runtime**: Bun for fast JavaScript execution
- **Scheduling**: Cron-based and event-driven task scheduling
- **Integration**: Connected to main API and database

### Database Schema

Core entities: `user`, `sport`, `location`, `game`, `team`, `game_invite`, `location_rating`, `location_condition_report`

## Package Manager Usage

**All projects use Bun** as the package manager for consistency and performance:

- **Root & Scraper**: Bun
- **Mobile App**: Bun
- **Marketing Website**: Bun
- **API Backend**: Bun
- **Database & Tasks**: Bun

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

### Background Tasks Deployment

- **Platform**: Trigger.dev cloud infrastructure
- **Runtime**: Bun with isolated task execution
- **Environments**: Staging and Production via deploy scripts

## Development Workflow

### Branch Strategy

- **Main branch**: `main`

## Key Configuration Files

- `apps/mobile/eas.json` - Mobile build configuration
- `apps/mobile/app.json` - Expo app configuration
- `apps/web/react-router.config.ts` - React Router configuration
- `apps/web/vite.config.ts` - Vite build configuration
- `packages/api/scripts/generate-gql-typings.ts` - GraphQL type generation
- `packages/api/src/schema.graphql` - GraphQL schema definition
- `packages/database/config.toml` - Database configuration
- `trigger.config.ts` - Background task configuration
- Root `package.json` - Workspace definition

## Generated Files (Do Not Edit)

- `packages/api/src/graphql.ts` - Auto-generated GraphQL TypeScript definitions
- `packages/database/supabase/supabase.types.ts` - Auto-generated Supabase TypeScript types
- `apps/mobile/src/primitives/icons/` - Auto-generated icon components

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
- **Packages** (`packages/`): Shared services and libraries (api, database, tasks, ui)
- **Tools** (`scraper/`): Standalone utilities

This structure provides clear separation of concerns and dependencies between different parts of the system. All components use Bun as the package manager for consistency and performance.
