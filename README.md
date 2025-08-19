# 🎾 Rec Sports

### Find the perfect spot to play – any sport, anywhere.

**Rec** is a comprehensive sports community platform that connects athletes with local venues, pickup games, and fellow players. Search your local community for pick-up games, leagues, or solo play opportunities.

🌐 **[Visit Rec Sports →](https://www.recsports.app)**

---

## 🚀 What is Rec?

Rec solves the age-old problem of finding quality sports venues and connecting with other athletes. Whether you're looking for a tennis court, basketball pickup game, or soccer field, Rec provides real-time information about sports facilities near you.

### Key Features

- 📍 **Location Discovery** - Find sports venues by location, facility type, or sport
- 👥 **Community Connection** - Meet people to play with in your area
- 📱 **Real-time Updates** - Get live information about venue availability and conditions
- 🚨 **Community Alerts** - Report and receive alerts about facility issues or closures
- ⭐ **Venue Ratings** - Read and contribute reviews of local sports facilities
- 🏃 **Multi-Sport Support** - Tennis, Basketball, Soccer, Pickleball, Volleyball, and more

**[Try Rec Sports Now →](https://www.recsports.app)**

---

## 🏗️ Project Architecture

This is a modern **Bun-based monorepo** featuring:

### 📱 Mobile App (`apps/mobile/`)

- **React Native** with Expo
- **File-based routing** with Expo Router
- **Apollo Client** for GraphQL data management
- **React Native Unistyles** for adaptive theming
- **MMKV** for efficient local storage

### 🌐 Marketing Website (`apps/web/`)

- **React Router** for full-stack web framework
- **Tailwind CSS** with custom components
- **Server-side rendering** with static optimization
- **Dynamic routing** for sports and locations

### 🔗 GraphQL API (`packages/api/`)

- **NestJS** framework with Apollo Server
- **PostgreSQL** with PostGIS for geographic data
- **Supabase** for authentication and real-time features
- **Kysely** for type-safe database queries

### 🗄️ Database (`packages/database/`)

- **PostgreSQL** with PostGIS extensions
- **Supabase** for local development
- **Row-level security** policies
- **Automated migrations** and seeding

### 📦 Supporting Packages

- **`packages/types/`** - Shared TypeScript types and GraphQL codegen

---

## 🛠️ Development Setup

### Prerequisites

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Supabase CLI](https://supabase.com/docs/guides/cli)** - For local database management

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/rec-sports.git
cd rec-sports

# Install dependencies for all packages
bun install

# Set up local database
cd packages/database
supabase start
bun dev:init

# Start the API server
cd ../api
bun start:dev

# Start the mobile app (in another terminal)
cd ../apps/mobile
bun start

# Start the web app (in another terminal)
cd ../apps/web
bun dev
```

### Project Commands

```bash
# Mobile App
bun start          # Start Expo dev server
bun android        # Run on Android emulator
bun ios           # Run on iOS simulator

# Web App
bun dev           # Start development server
bun build         # Build for production

# API
bun start:dev     # Start with hot reload
bun typegen:gql   # Generate GraphQL types
bun test          # Run tests

# Database
bun dev:init      # Reset with migrations and seeds
supabase db reset # Reset database
```

---

## 🌟 Key Technologies

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Mobile**: [React Native](https://reactnative.dev) + [Expo](https://expo.dev)
- **Web**: [React Router](https://reactrouter.com) + [Tailwind CSS](https://tailwindcss.com)
- **API**: [NestJS](https://nestjs.com) + [GraphQL](https://graphql.org)
- **Database**: [PostgreSQL](https://postgresql.org) + [PostGIS](https://postgis.net) + [Supabase](https://supabase.com)

---

## 📂 Project Structure

```
rec-sports/
├── apps/
│   ├── mobile/        # React Native mobile app (Expo SDK 53)
│   └── web/           # React Router marketing website
├── packages/
│   ├── api/           # NestJS GraphQL API backend
│   ├── database/      # PostgreSQL database config & migrations
│   └── types/         # Shared TypeScript types
└
```

---

## 🔗 Links

- 🏠 **[Rec Sports Website](https://www.recsports.app)** - Experience the platform
- 📱 **Mobile App** - Coming soon to iOS and Android app stores
- 🐦 **[Twitter/X](https://x.com/recsportsapp)** - Follow for updates
- 📘 **[Facebook](https://www.facebook.com/recsportsapp)** - Join the community
- 📸 **[Instagram](https://www.instagram.com/recsportsapp)** - See sports in action

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on how to:

- Report bugs and request features
- Submit code improvements
- Add new sports venue data
- Improve documentation

---

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

**Key points about AGPL-3.0:**

- ✅ **Free to use, modify, and distribute**
- ✅ **Open source contributions welcome**
- ⚠️ **Network use requires source disclosure** - If you run a modified version of this software on a server that users interact with over a network, you must provide the source code to those users
- 📋 **Copyleft license** - Derivative works must also be licensed under AGPL-3.0

---

**[🎾 Start Playing with Rec Sports →](https://www.recsports.app)**
