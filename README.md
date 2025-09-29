# Bot Management Frontend

Vue 3 SPA frontend for the Bot Management Dashboard with TypeScript and Vite.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/     # Reusable Vue components
├── views/          # Page components
├── router/         # Vue Router configuration
├── stores/         # Pinia stores for state management
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.vue         # Root component
├── main.ts         # Application entry point
└── style.css       # Global styles
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

The application will run on `http://localhost:3000`

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Features

### Current Implementation
- ✅ Vue 3 with Composition API
- ✅ TypeScript support
- ✅ Vue Router setup
- ✅ Basic dashboard layout
- ✅ Responsive design
- ✅ Development proxy to backend API

### Planned Features
- [ ] Authentication & login system
- [ ] Real-time bot status updates
- [ ] Bot management interface
- [ ] Schedule management
- [ ] Run logs and metrics
- [ ] User management (admin)
- [ ] Settings and configuration

## API Integration

The frontend is configured to proxy API requests to the backend:
- Development: `http://localhost:8080/api`
- All `/api/*` requests are forwarded to the backend server

## Status

✅ **Frontend Basic Setup Completed:**
- [x] Vue 3 project structure
- [x] TypeScript configuration
- [x] Vite build setup
- [x] Vue Router with basic routes
- [x] Component structure ready
- [x] Development environment configured

## Next Steps

Ready for implementation of:
- Frontend Issue #1: Project Setup and Vue 3 Configuration ✅
- Frontend Issue #2: Authentication and Login System
- Frontend Issue #3: Dashboard Overview Page