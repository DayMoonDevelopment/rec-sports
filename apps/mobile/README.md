# 📱 Rec Sports Mobile App

The React Native mobile application for [Rec Sports](../../README.md) - find the perfect spot to play any sport, anywhere.

Built with **React Native**, **Expo SDK 53**, and **Apollo Client** for a seamless cross-platform experience.

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Expo CLI](https://docs.expo.dev/get-started/installation/)** - For running the development server
- **Android Studio** or **Xcode** - For device emulators (optional)

### Installation

```bash
# Install dependencies
bun install

# Start the development server
bun start
```

### Platform Options

In the development server output, you'll find options to run on:

- **[Development build](https://docs.expo.dev/develop/development-builds/introduction/)** - Custom development client
- **[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)** - Press `a` in terminal
- **[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)** - Press `i` in terminal  
- **[Expo Go](https://expo.dev/go)** - Scan QR code with Expo Go app
- **Web browser** - Press `w` in terminal

### Quick Commands

```bash
bun start          # Start Expo dev server
bun android        # Run on Android emulator
bun ios            # Run on iOS simulator  
bun web            # Run on web browser
bun lint           # Run ESLint
bun test           # Run Jest tests
```

---

## 🏗️ Architecture

### Core Technologies

- **[React Native](https://reactnative.dev)** - Cross-platform mobile framework
- **[Expo SDK 53](https://expo.dev)** - Development platform and services
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based navigation
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - GraphQL data management
- **[React Native Unistyles](https://unistyles.vercel.app)** - Adaptive styling system
- **[MMKV](https://github.com/mrousavy/react-native-mmkv)** - High-performance storage

### Project Structure

```
src/
├── app/                    # Expo Router pages (file-based routing)
│   ├── (map)/             # Map-based navigation group
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── components/            # Reusable React components
├── context/               # React Context providers
│   ├── apollo.tsx         # GraphQL client setup
│   └── app.tsx           # App-wide state
├── lib/                   # Utility functions and services
├── routes/                # Route-specific components
└── ui/                    # UI component library
```

### Key Features

- **📍 Real-time Location Discovery** - Find sports venues nearby
- **🗺️ Interactive Maps** - Browse venues on an interactive map
- **👥 Community Features** - Connect with other athletes
- **📱 Cross-platform** - iOS, Android, and web support
- **🔐 Social Authentication** - Sign in with Apple/Google
- **⚡ Offline Support** - MMKV caching for offline functionality

---

## 🔗 Dependencies

### Main Dependencies

- **Expo Router** - File-based navigation system
- **Apollo Client** - GraphQL client with caching
- **React Native Unistyles** - Adaptive styling
- **React Native Maps** - Interactive map components
- **MMKV** - Fast key-value storage
- **Expo Auth Session** - Social authentication flows

### Development Dependencies

- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Jest** - Unit testing framework
- **Prettier** - Code formatting

---

## 🎨 Styling System

This app uses **React Native Unistyles** for adaptive, theme-aware styling:

```typescript
// Example component styling
const styles = UnistylesRuntime.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.text.primary,
  }
}));
```

### Theme Features
- **Dark/Light mode** support
- **Responsive design** across screen sizes
- **Platform-specific** styling
- **Accessible** color contrasts

---

## 🌐 GraphQL Integration

The app connects to the Rec Sports GraphQL API for all data operations:

```typescript
// Example GraphQL query
const GET_LOCATIONS = gql`
  query GetLocations($region: Region, $sports: [Sport!]) {
    locations(region: $region, sports: $sports) {
      nodes {
        id
        name
        latitude
        longitude
        sports
      }
    }
  }
`;
```

### Apollo Client Setup
- **Automatic caching** with MMKV persistence
- **Error handling** and retry logic
- **Optimistic updates** for better UX
- **Background sync** when connection resumes

---

## 📱 Build & Deployment

### Development Builds

```bash
# Build for development
npx eas build --profile development --platform android
npx eas build --profile development --platform ios
```

### Production Builds

```bash
# Build for app stores
npx eas build --profile production --platform android
npx eas build --profile production --platform ios
```

### App Store Configuration

- **Bundle ID**: `io.daymoon.rec` (production), `io.daymoon.rec.dev` (development)
- **EAS Build**: Configured in `eas.json`
- **Auto-updates**: Expo Updates for over-the-air deployments

---

## 🧪 Testing

```bash
# Run unit tests
bun test

# Run tests in watch mode
bun test --watch

# Generate coverage report
bun test --coverage
```

---

## 🔧 Development

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure required environment variables:
   - GraphQL API endpoint
   - Authentication provider keys
   - Map service API keys

### File-based Routing

This project uses Expo Router's file-based routing system:

- `app/_layout.tsx` - Root layout for all screens
- `app/(map)/` - Map-related screens (navigation group)
- `app/[locationId]/` - Dynamic location detail pages

### Adding New Screens

1. Create new file in `app/` directory
2. Export React component as default
3. Routing is automatic based on file structure

---

## 📚 Related Documentation

- **[Root Project README](../../README.md)** - Overall project architecture
- **[API Documentation](../../packages/api/README.md)** - GraphQL schema and endpoints
- **[Expo Router Docs](https://docs.expo.dev/router/introduction/)** - Navigation system
- **[React Native Docs](https://reactnative.dev/docs/getting-started)** - Platform-specific guides

---

**[🏠 Back to Main Project](../../README.md)**
