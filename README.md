# Citadel Frontend

A modern React-based social networking application built for students to connect, explore, and interact with peers from their universities and beyond.

## 🚀 Features

### Core Functionality
- **User Authentication & Onboarding**: Complete user registration flow with OTP verification
- **Profile Management**: Comprehensive profile creation and editing with image uploads
- **Explore & Discovery**: Advanced matching algorithm with adjective-based connections
- **Real-time Chat**: WebSocket-powered messaging with enhanced matching features
- **Event Booking**: Integrated event management with payment processing
- **Notifications**: Real-time notifications for connections and interactions
- **Settings & Privacy**: Complete user control over account and privacy settings

### Key Features
- **Enhanced Adjective System**: Gender-based adjective matching for better connections
- **Grid View & List View**: Multiple ways to browse and discover profiles
- **Connection Management**: Send, accept, reject, and manage connection requests
- **Payment Integration**: Razorpay integration for event bookings
- **Real-time Updates**: WebSocket connections for live chat and notifications
- **Responsive Design**: Mobile-first design with modern UI/UX

## 🛠️ Tech Stack (Frontend)

### Core
- **React 19.1.0** – UI library (StrictMode enabled)
- **TypeScript ~5.8.3** – Type-safe development
- **Vite 7.0.4** – Dev server and bundler (`@vitejs/plugin-react`)
- **React Router DOM 7.7.0** – Client-side routing

### Data, State & Networking
- **@tanstack/react-query 5.83.0** – Server state caching and fetching
- **Axios 1.10.0** – HTTP client abstraction (via `lib/apiClient.ts` with timeout/retry/cache)

### Real-time & Events
- **socket.io-client 4.8.1** – Realtime messaging with reconnection/backoff

### UI & Styling
- **Tailwind CSS 4.1.11** – Utility-first CSS (via `@tailwindcss/vite`)
- **tw-animate-css 1.3.5** – Animation utilities
- **Radix UI (react-label, react-slot, react-tabs)** – Accessible primitives
- **lucide-react** – Icons
- **clsx**, **tailwind-merge**, **class-variance-authority** – Styling helpers & variants
- **Google Fonts** – `Inter`, `Roboto Serif`

### Notifications & UX
- **react-hot-toast 2.6.0** – Toast notifications

### Payments
- **Razorpay 2.9.6** – Checkout SDK (loaded dynamically at runtime)

### Tooling & Quality
- **ESLint 9.30.1**, **typescript-eslint**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh**
- **Vite Bundle Analyzer** (via `npx vite-bundle-analyzer`)
- **Lighthouse** CLI (performance audits)

### Build & Performance
- Manual chunking in `vite.config.ts` for vendors and feature routes
- Route/component lazy loading with preloading and image prefetching

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Chats/          # Chat-related components
│   ├── Common/          # Shared components (navbar, etc.)
│   ├── EditProfile/     # Profile editing components
│   ├── Events/          # Event booking components
│   ├── ExploreScreen/   # Explore page components
│   ├── Gridview/        # Profile grid/list view components
│   ├── Notification/    # Notification components
│   ├── Onboarding/      # User onboarding components
│   ├── Settings/        # Settings page components
│   └── ui/             # Base UI components
├── lib/                # Utility libraries
│   ├── api.ts          # API functions
│   ├── apiClient.ts    # HTTP client configuration
│   ├── socket.ts       # WebSocket service
│   ├── payment.ts      # Payment processing
│   ├── utils.ts        # Utility functions
│   ├── adjectiveUtils.ts # Adjective matching logic
│   └── hooks/          # Custom React hooks
├── pages/              # Page components
│   ├── onboarding/     # User onboarding flow
│   ├── explore/        # Profile exploration
│   ├── chats/          # Messaging interface
│   ├── gridview/       # Profile browsing
│   ├── notification/   # Notifications center
│   ├── settings/       # User settings
│   ├── events/         # Event booking
│   ├── profile/        # User profile
│   └── user-profile/   # Other user profiles
├── types/              # TypeScript type definitions
└── assets/             # Static assets (images, icons)
```

## 🧩 Third‑Party Libraries & Services (Frontend)

- React, React Router
- @tanstack/react-query
- Axios (wrapped via `lib/apiClient.ts` with timeouts, retries, cache)
- socket.io-client (chat, groups, notifications)
- Razorpay Checkout (runtime-loaded)
- Tailwind CSS (+ `@tailwindcss/vite`), tw-animate-css
- Radix UI (label, slot, tabs)
- lucide-react
- clsx, tailwind-merge, class-variance-authority
- Google Fonts: Inter, Roboto Serif

### External Services & APIs (Comprehensive)

- **Backend API**: Custom REST API hosted on Render (`VITE_API_URL`)
- **WebSockets**: `socket.io` namespace on the same Render backend (`/socket.io/`)
- **Email/OTP**: Backend routes `/api/v1/auth/send-otp` and `/api/v1/auth/verify-otp` (provider configured server-side)
- **Universities & Colleges Data**: `/api/v1/universities`, `/api/v1/colleges` via backend
- **Media Uploads**: Backend `POST /api/profile/upload` → stores to S3; client uses returned `cloudfrontUrl`
- **Profile & Explore**: Multiple endpoints under `/api/v1/profile/*`, `/api/v1/users/*`, `/api/v1/enhanced-explore/*`
- **Connections & Notifications**: `/api/v1/connections/*`, `/api/v1/notifications/*`
- **Chats (1:1 & Groups)**: `/api/v1/chats/*`, `/api/v1/groups/*`
- **Payments**: Razorpay Checkout + backend `/api/payments/create-order`, `/api/payments/verify`

## ☁️ Platforms & Hosting

- **Frontend Hosting: Vercel**
  - Config: `vercel.json` with SPA rewrites to `index.html`
  - Long-term asset caching via `Cache-Control: public, max-age=31536000, immutable` on `/assets/*`
- **Alternative/Compatible Hosting: Netlify**
  - SPA fallback configured via `_redirects` (both `public/_redirects` and `dist/_redirects`) → `/* /index.html 200`
- **Backend & Database Hosting: Render**
  - Backend API and database deployed on **Render**
  - Frontend uses `VITE_API_URL` to talk to the Render backend and WebSocket endpoint
- **Media Storage & CDN: AWS S3 + CloudFront**
  - User images referenced via `cloudfrontUrl` across the app (see API and pages)
- **Payments: Razorpay**
  - Frontend loads `checkout.js` at runtime; backend endpoints handle order creation and verification
- **Realtime Backend Endpoint**
  - WebSocket client connects to `VITE_API_URL` using `socket.io-client`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `app_v1` directory:
   ```env
   # Backend base URL used for REST and WebSocket
   VITE_API_URL=http://localhost:3000

   # Razorpay public key (frontend)
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

   # Optional: enable internal test UI in development
   VITE_ENABLE_TEST_UI=false
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/onboarding/*` | OnboardingPage | User registration and setup flow |
| `/edit-profile/*` | ProfilePage | Profile editing interface |
| `/explore` | ExplorePage | Profile discovery and matching |
| `/notification` | NotificationPage | Notifications center |
| `/chats` | ChatApp | Real-time messaging |
| `/settings` | SettingsPage | User settings and preferences |
| `/events` | EventsPage | Event booking and management |
| `/search` | ProfilesPage | Profile search and browsing |
| `/gridview` | ProfilesPage | Grid view of profiles |
| `/profile` | UserProfilePage | Current user's profile |
| `/:name` | UserProfileScreen | Other user's profile |

Routing is powered by **react-router-dom 7**, with extensive route-level code splitting and preloading.

## 🔧 Key Components

### Onboarding Flow
- **Slide to Start Screen**: Interactive welcome screen
- **Email & OTP Verification**: Secure user authentication
- **Profile Setup**: Complete user profile creation
- **Image Upload**: Profile picture and gallery management
- **Preferences**: User interests and preferences setup

### Explore & Discovery
- **Profile Cards**: Visual profile browsing
- **Adjective Matching**: Enhanced connection system
- **Filter System**: Advanced search and filtering
- **Connection Management**: Send and manage requests

### Chat System
- **Real-time Messaging**: WebSocket-powered chat
- **Match Prompts**: Ice-breaking prompts for new matches
- **Connection Flow**: Enhanced matching and connection
- **Message Status**: Read receipts and delivery status

### Event System
- **Event Booking**: Complete booking flow
- **Payment Integration**: Razorpay payment processing
- **Booking Management**: View and manage bookings

## 🔌 API Integration

### Authentication
- User registration with OTP verification
- Token-based authentication
- Profile completion tracking

### Profile Management
- Profile creation and updates
- Image upload to S3
- University and college data integration

### Explore & Matching
- Advanced matching algorithm
- Adjective-based connections
- Connection request management
- Profile interaction tracking

### Chat & Messaging
- Real-time message delivery
- Conversation management
- Message status tracking
- Enhanced matching integration

### Notifications
- Real-time notification delivery
- Connection request handling
- Adjective match notifications

## 🎨 Design System

### Color Palette
- **Primary**: Green (#1BEA7B, #22c55e)
- **Background**: Black (#000000, #111111)
- **Text**: White (#FFFFFF), Gray (#CACACA, #9A9A9A)
- **Accent**: Orange (#FF6B35)

### Typography
- **Primary**: Inter, sans-serif
- **Display**: Roboto Serif
- **Weights**: 400, 500, 600, 700

### Components
- **Buttons**: Primary, secondary, and action buttons
- **Cards**: Profile cards, event cards, notification cards
- **Modals**: Confirmation, settings, and feature modals
- **Navigation**: Bottom navigation bar with icons

## 🔒 Security Features

- **Token-based Authentication**: Secure API access
- **OTP Verification**: Two-factor authentication
- **Input Validation**: Client-side and server-side validation
- **Secure File Upload**: S3 integration with proper validation
- **Payment Security**: Razorpay secure payment processing

## 📱 Mobile-First Design

- **Responsive Layout**: Optimized for mobile devices
- **Touch Interactions**: Swipe gestures and touch-friendly UI
- **Performance**: Optimized for mobile performance
- **Offline Support**: Basic offline functionality

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Optimized image loading
- **Lazy Loading**: Component and image lazy loading
- **WebSocket Optimization**: Efficient real-time communication
- **Caching**: React Query for server state caching

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
# Performance & analysis
npm run perf:analyze   # Build + open Vite bundle analyzer
npm run perf:lighthouse # Run Lighthouse against localhost:5173
npm run perf:size       # Build + bundlesize check
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and IntelliSense
- **Prettier**: Code formatting (via ESLint)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
