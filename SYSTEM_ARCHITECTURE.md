# MASAAR System Architecture

## Product Identity

MASAAR is a Next.js App Router web application named `masaar-national-tourism-intelligence`. The current implementation is a mobile-first, demo-oriented Jordan tourism intelligence platform with four roles:

- Traveller
- Investor
- Business Owner
- Government

The product uses mock/local data, Zustand persisted state, forecast simulation logic, Leaflet maps, Recharts charts, and optional Gemini API access through a generic AI helper.

## Framework And Runtime Structure

The app uses:

- Next.js App Router
- React client components for all interactive screens
- TypeScript
- Tailwind CSS v4 via `@import "tailwindcss"`
- Zustand with `persist` middleware for localStorage-backed state
- Recharts for charts
- React Leaflet / Leaflet for maps
- Lucide React for icons

Root layout:

- `app/layout.tsx`
  - Imports `app/globals.css`
  - Defines static metadata
  - Renders `<html lang="en"><body>{children}</body></html>`
  - Does not dynamically update `lang` based on locale

Global styling:

- `app/globals.css`
  - Defines light theme CSS variables under `:root`
  - Defines dark theme CSS variables under `[data-theme="dark"]`
  - Defines shared classes: `.glass-card`, `.government-hero`, `.leaflet-container`, `.eyebrow`, `.section-line`, `.masaar-title`, `.numeric`, `.pill`, `.pill-active`, `.line-button`, `.primary-button`
  - Applies dark map tile filter under `[data-theme="dark"] .leaflet-tile`

## Route Map

Current routes from code:

| Route | File | Role / Area |
|---|---|---|
| `/` | `app/page.tsx` | Entry / role selection |
| `/traveller` | `app/traveller/page.tsx` | Traveller discovery |
| `/traveller/cart` | `app/traveller/cart/page.tsx` | Traveller trip cart / checkout |
| `/traveller/ai` | `app/traveller/ai/page.tsx` | Traveller AI advisor |
| `/investor` | `app/investor/page.tsx` | Investor opportunities |
| `/investor/forecast` | `app/investor/forecast/page.tsx` | Investor forecast workspace |
| `/investor/tenders` | `app/investor/tenders/page.tsx` | Investor tender browse / submissions |
| `/investor/tenders/[id]` | `app/investor/tenders/[id]/page.tsx` | Tender detail |
| `/investor/tenders/[id]/submit` | `app/investor/tenders/[id]/submit/page.tsx` | Tender submission wizard |
| `/business` | `app/business/page.tsx` | Business dashboard |
| `/business/forecast` | `app/business/forecast/page.tsx` | Business forecast |
| `/business/bookings` | `app/business/bookings/page.tsx` | Booking operations |
| `/business/ai` | `app/business/ai/page.tsx` | Business offer studio |
| `/government` | `app/government/page.tsx` | Government command center |
| `/government/tenders` | `app/government/tenders/page.tsx` | Government tender administration |
| `/profile` | `app/profile/page.tsx` | Shared role-aware profile |

## Shared Layout / Shell

Most role pages render inside:

- `components/AppShell.tsx`

`AppShell` responsibilities:

- Accepts a `role` prop.
- Reads current pathname with `usePathname`.
- Reads locale and direction through `useLocale`.
- Reads theme from Zustand.
- Provides a top app bar with:
  - MASAAR logo link to `/`
  - Search button
  - Locale toggle button
  - Theme toggle button
  - Notifications button
- Provides role-specific bottom navigation.
- Provides modal-like bottom panels for search and notifications.
- Applies `dir={dir}` and `data-theme={theme}` to the main container.

Role nav definitions:

- Traveller: Discover, Trip, AI, Profile
- Investor: Opportunities, Forecast, Tenders, Profile
- Business: Dashboard, Forecast, Bookings, AI, Profile
- Government: Dashboard, Tenders, Profile

Important current issue:

- Several Arabic strings in `AppShell.tsx` are mojibake/corrupted string literals. The data module has valid Arabic, but the shell UI does not fully display correct Arabic.
- The bottom nav is fixed and generated with a dynamic column count. Business has 5 nav items, which may become tight on small mobile widths.

## Core Data Modules

### `data/mock.ts`

Defines:

- `Role = 'traveller' | 'investor' | 'business' | 'government'`
- `Locale = 'en' | 'ar'`
- `Location`
- `Offer`
- `Tender`
- `Booking`

Exports:

- `locations`
  - Wadi Rum
  - Petra
  - Ajloun
  - Dead Sea
  - Aqaba
- `offers`
  - Wadi Rum stargazing camp
  - Petra heritage walk
  - Ajloun forest cabin
  - Dead Sea recovery pass
- `tenders`
  - Northern eco-lodge concession
  - Petra visitor shuttle operations
  - Aqaba reef experience licensing
- `seedBookings`
  - Three demo bookings with pending/accepted/checked-in statuses

Notes:

- The type system and app copy sometimes refer to “eight destinations,” but `locations` currently contains five destinations.
- Several location images are local assets under `/places/*`; Petra still uses a remote Unsplash URL.

## Global State Architecture

### `lib/store.ts`

Uses Zustand with `persist`, storage key:

- `masaar-production-state`

Persisted state:

- `locale`
- `role`
- `theme`
- `apiKey`
- `cart`
- `bookings`
- `submissions`

Actions:

- `setLocale(locale)`
- `setRole(role)`
- `toggleTheme()`
- `setApiKey(apiKey)`
- `addToCart(offer)`
- `clearCart()`
- `checkout()`
- `updateBooking(id, status)`
- `addSubmission(submission)`

## Logic Modules

### `lib/forecast.ts`

Implements the forecast simulation engine:

- `forecastLocation(location, bookings)`
- `forecastAll(locations, bookings)`
- `rankInvestmentOpportunities(locations, bookings)`

It computes:

- Monthly demand points
- Crowd level
- Average demand score
- Supply gap
- Underutilized flag
- Predicted growth
- Confidence
- Redistribution strategy
- Investor opportunity score
- Investor risk score

### `lib/ai.ts`

Implements AI abstraction:

- `askMasaarAI(mode, context, apiKey?)`
- `mockAi(mode, context)`
- `policyInsights(forecasts)`

If no API key is present, `askMasaarAI` returns deterministic mock output. If an API key is present, it calls Gemini 1.5 Flash through Google’s Generative Language API.

Current important reality:

- No page currently calls `askMasaarAI` directly.
- Traveller AI and Business AI use local hardcoded responses, not `lib/ai.ts`.
- `policyInsights` is used by the Government dashboard.

## Major Components

### `components/AppShell.tsx`

Shared role shell, top controls, bottom navigation, search panel, notification panel.

### `components/MapClient.tsx`

Leaflet map component:

- Renders OpenStreetMap tiles.
- Renders circle markers for forecast results.
- Marker color depends on demand score.
- Optional selected marker state via `selectedId`.
- Optional marker click callback via `onSelect`.
- Static demand legend.

### `components/Charts.tsx`

Exports:

- `DemandSupplyChart`
- `OccupancyTrendChart`

Both use Recharts.

### `components/ForecastChart.tsx`

Area chart for a single forecast result’s monthly demand points.

### `components/KpiCard.tsx`

Line-based compact KPI display with icon, label, value, optional note.

## Assets

Local assets known from code:

- `/brand/splash.png`
- `/places/wadi-rum.webp`
- `/places/ajloun.webp`
- `/places/dead-sea.jpg`
- `/places/aqaba.avif`

Remote images still used:

- Petra image from Unsplash in `data/mock.ts`
- Entry role cards use remote Unsplash images
- `.government-hero` uses remote Unsplash image

