# 🌐 Rec Sports Marketing Website

The React Router-powered marketing website for [Rec Sports](../../README.md) - showcasing sports venues and communities across cities.

Built with **React Router**, **Tailwind CSS**, and **Vite** for fast, SEO-friendly server-side rendering.

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager

### Installation & Development

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

The development server will start at `http://localhost:5173` with hot module replacement enabled.

### Available Commands

```bash
bun dev           # Start development server
bun build         # Build for production
bun start         # Start production server
bun typecheck     # TypeScript type checking
bun lint          # Run ESLint
bun lint:fix      # Run ESLint with auto-fix
```

---

## 🏗️ Architecture

### Core Technologies

- **[React Router](https://reactrouter.com)** - Full-stack React framework
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev)** - Fast build tool and dev server
- **[TypeScript](https://www.typescriptlang.org)** - Static type checking
- **Server-side Rendering** - SEO-optimized page delivery

### Project Structure

```
app/
├── components/              # Reusable React components
│   ├── all-sports.tsx      # Sports showcase component
│   └── hub-section.tsx     # Location hub sections
├── lib/                    # Utility functions
│   ├── .server/           # Server-only utilities
│   ├── action-utils.server.ts # Server action helpers
│   └── ...                # Client utilities
├── primitives/            # Design system components
│   ├── brand/            # Brand-specific components
│   ├── card/             # Card component variants
│   └── ...               # Other UI primitives
├── routes/               # Page routes (file-based)
│   ├── _base/           # Base layout routes
│   ├── _base._index/    # Homepage components
│   └── ...              # Dynamic sport/city pages
├── ui/                  # Shared UI components
├── app.css             # Global styles
├── root.tsx            # App root component
└── routes.ts           # Route configuration
```

### Key Features

- **🗺️ Location Discovery** - Browse sports venues by city and sport
- **🏃 Multi-Sport Support** - Tennis, Basketball, Soccer, and 50+ sports
- **📱 Responsive Design** - Optimized for mobile and desktop
- **⚡ Fast Performance** - Server-side rendering with static optimization
- **🔍 SEO Optimized** - Dynamic meta tags and structured data
- **🎨 Consistent Design** - Tailwind-powered design system

---

## 🎨 Styling & Design System

### Tailwind CSS Configuration

This website uses a custom Tailwind configuration with:

```javascript
// tailwind.config.js highlights
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
      },
      fontFamily: {
        // Custom fonts
      }
    }
  }
}
```

### Component Architecture

- **Primitives** (`app/primitives/`) - Low-level design components
- **UI Components** (`app/ui/`) - Composed, reusable components  
- **Page Components** (`app/components/`) - Page-specific components
- **Route Components** (`app/routes/`) - Full page implementations

### Responsive Design

All components are built mobile-first with Tailwind's responsive utilities:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid layout */}
</div>
```

---

## 🛣️ Routing System

### File-based Routing

React Router uses file-based routing with these conventions:

```
routes/
├── _base._index/          # Homepage (/)
├── _base.sport.$sport/    # Sport pages (/sport/tennis)
├── _base.city.$city/      # City pages (/city/chicago)
├── _base.about/           # About page (/about)
└── _base.contact/         # Contact page (/contact)
```

### Route Structure

Each route can export:

```typescript
// route.ts
export async function loader({ params }: LoaderFunctionArgs) {
  // Data loading logic
}

export async function action({ request }: ActionFunctionArgs) {
  // Form handling logic
}

export default function Route() {
  // React component
}

export const handle = {
  // Route metadata
};
```

### Dynamic Routes

- **Sport pages** - `/sport/[tennis|basketball|soccer|...]`
- **City pages** - `/city/[chicago|new-york|los-angeles|...]`
- **Location pages** - `/location/[location-id]`

---

## 🌟 Performance Optimizations

### Server-Side Rendering

- **Fast initial page loads** with pre-rendered HTML
- **SEO-friendly** content indexing
- **Progressive enhancement** with client-side hydration

### Build Optimizations

- **Code splitting** by route for smaller bundles
- **Asset optimization** with Vite's built-in tools
- **Static asset** serving with optimal caching headers

### Development Experience

- **Hot Module Replacement** for instant feedback
- **TypeScript integration** with full type safety
- **Fast refresh** preserving component state

---

## 🏗️ Build & Deployment

### Production Build

```bash
# Build for production
bun build
```

This creates optimized bundles in:
- `build/server/` - Server-side code
- `build/client/` - Client-side assets

### Production Server

```bash
# Start production server
bun start
```

### Deployment Options

The built application is a standard Node.js server ready for deployment on:

- **Vercel** - Zero-config React Router deployment
- **Netlify** - Server-side rendering support
- **Railway/Render** - Container-based deployment
- **Self-hosted** - Any Node.js hosting environment

### Docker Support

```dockerfile
# Multi-stage build for production
FROM node:18-alpine
COPY build/ ./build/
EXPOSE 3000
CMD ["node", "build/server.js"]
```

---

## 🧪 Development

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure environment variables:
   - API endpoints
   - Analytics keys
   - Feature flags

### Adding New Routes

1. Create new directory in `app/routes/`
2. Add `route.tsx` with default component export
3. Optional: Add `route.loader.ts` for data loading
4. Optional: Add `route.action.ts` for form handling

### Design System Usage

```tsx
// Using design system components
import { Card } from "~/primitives/card";
import { Badge } from "~/ui/badge";

export default function SportCard({ sport }) {
  return (
    <Card className="p-6">
      <Badge variant="sport">{sport.name}</Badge>
      <h3 className="text-xl font-semibold">{sport.title}</h3>
    </Card>
  );
}
```

---

## 🔗 Integration

### API Connection

The website connects to the Rec Sports GraphQL API for dynamic content:

- **Location data** - Real-time venue information
- **Sports data** - Available sports and facilities
- **User content** - Reviews and community features

### Analytics & Tracking

- **Performance monitoring** with built-in metrics
- **User analytics** for engagement tracking
- **SEO tracking** for search visibility

---

## 📚 Related Documentation

- **[Root Project README](../../README.md)** - Overall project architecture
- **[API Documentation](../../packages/api/README.md)** - GraphQL endpoints
- **[Mobile App](../mobile/README.md)** - React Native companion app
- **[React Router Docs](https://reactrouter.com/docs)** - Framework documentation
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)** - Styling system

---

**[🏠 Back to Main Project](../../README.md)**
