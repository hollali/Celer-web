# Celer

**Fast. Safe. Ghanaian.**

Celer is a ride-hailing web application built for Ghana, offering a full ride-booking experience with real-time maps, driver selection, and integrated payments.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS
- **Auth:** Clerk
- **Maps:** Google Maps (Places, Directions, Distance Matrix)
- **Database:** Neon (serverless PostgreSQL)
- **Payments:** Paystack
- **State:** Zustand
- **Icons:** Lucide React

## Features

- Onboarding carousel & authentication (email/password + Google OAuth)
- Interactive Google Map with nearby drivers, autocomplete destination search, and route polyline
- Driver selection with fare estimation, rating, and ETA
- Ride booking, history, and filtering
- Paystack payment integration
- User profile, promotions, safety info, help & support, and legal/privacy pages
- Responsive design with sidebar (desktop), bottom tab navigation (mobile), and full-screen map with auto-hiding search
- Dark mode with persistent theme toggle (Light / Dark / System) in Appearance settings

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database
- API keys for Clerk, Google Maps, and Paystack

### Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
DATABASE_URL=
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (auth)/        Onboarding, sign-in, sign-up
  (root)/        Authenticated pages (home, rides, chat, profile, etc.)
  api/           Route handlers (driver, ride, user, paystack)
components/      Reusable UI components (map, driver card, button, etc.)
lib/             Utilities and API helpers
store/           Zustand state stores (location, driver, theme)
types/           TypeScript interfaces
public/          Static assets
```

## Database

The app uses Neon serverless PostgreSQL with three main tables:

- **users** — stores user profiles synced with Clerk
- **drivers** — driver information (name, image, car info, rating)
- **rides** — ride records with origin/destination, fare, payment status
