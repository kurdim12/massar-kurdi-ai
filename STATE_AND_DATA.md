# State And Data Architecture

## State Management

The app uses Zustand in `lib/store.ts`.

Store name in localStorage:

- `masaar-production-state`

The store is wrapped in Zustand `persist`, so all top-level store fields persist after refresh.

## Persisted Store Fields

| Field | Type | Purpose |
|---|---|---|
| `locale` | `en` / `ar` | Language and direction state |
| `role` | role or null | Last selected role |
| `theme` | `light` / `dark` | Theme mode |
| `apiKey` | string | Gemini API key input from profile |
| `cart` | `Offer[]` | Traveller trip cart |
| `bookings` | `Booking[]` | Business booking requests and seeded bookings |
| `submissions` | `Submission[]` | Investor tender drafts/submissions |

## Store Actions

### `setLocale(locale)`

Sets locale. Used by shell and profile.

### `setRole(role)`

Sets current role. Used by entry role selection.

### `toggleTheme()`

Switches theme between light and dark.

### `setApiKey(apiKey)`

Stores Gemini key. Used by profile only.

### `addToCart(offer)`

Adds an offer to the cart unless that offer id is already present.

### `clearCart()`

Clears cart. Defined but not currently used by UI.

### `checkout()`

Creates a booking from cart:

- amount = sum of cart offer prices
- locationId = first cart offer’s location
- guest = `Demo Traveller`
- nights = `Math.max(1, cart.length)`
- status = `pending`

Then clears cart.

### `updateBooking(id, status)`

Maps over bookings and updates matching booking status.

### `addSubmission(submission)`

Prepends tender submission/draft to submissions.

## Static Data

### Locations

Defined in `data/mock.ts`. Fields:

- id
- localized name
- localized governorate
- localized category
- coordinates
- baseDemand
- supplyScore
- growthRate
- seasonality
- events
- weatherComfort
- image

Locations:

- Wadi Rum
- Petra
- Ajloun
- Dead Sea
- Aqaba

### Offers

Defined in `data/mock.ts`.

Offers:

- Wadi Rum stargazing camp night
- Petra early Siq heritage walk
- Ajloun forest cabin weekend
- Dead Sea recovery day pass

### Tenders

Defined in `data/mock.ts`.

Tenders:

- Northern eco-lodge concession
- Petra visitor shuttle operations
- Aqaba reef experience licensing

### Seed Bookings

Defined in `data/mock.ts`.

Seed statuses:

- pending
- accepted
- checked-in

## Derived Data

### Forecasts

`forecastLocation` calculates forecast results from location data and active bookings.

Active booking statuses:

- pending
- accepted
- checked-in

Derived fields:

- monthly forecast points
- average demand score
- crowd level
- supply gap
- underutilized flag
- predicted growth
- confidence
- redistribution strategy

### Investment Ranking

`rankInvestmentOpportunities` derives:

- opportunityScore
- riskScore

Then sorts descending by opportunity score.

## Local Component State

Many screens use local React state:

- AppShell: search/notification panel state
- Traveller discovery: category filter
- Traveller cart: checkout confirmation message
- Traveller AI: messages and draft
- Investor forecast: selected region
- Investor tenders: tab/filter/notice/analysis
- Tender detail: analysis text
- Tender submit: all wizard fields
- Business dashboard: offer status feedback
- Business bookings: active tab
- Business AI: generated copy and published flag
- Government tenders: published flag

Local state resets on refresh unless it is saved to Zustand.

## Persistence Behavior

Persists after refresh:

- Role
- Locale
- Theme
- API key
- Cart
- Bookings
- Tender submissions

Resets after refresh:

- Search/notification panel open state
- Chat messages in Traveller AI
- Tender detail AI analysis
- Tender wizard unsaved form progress
- Business AI generated offer copy/published flag
- Government tender publish confirmation
- Business dashboard offer edit/boost status
- Active tabs and filters

## Inconsistencies

- `apiKey` is persisted but most AI UI does not use it.
- `clearCart` exists but no UI calls it.
- Government tender publishing shows confirmation but does not persist a new tender.
- Business offer publishing shows confirmation but does not persist a new offer.
- Traveller discovery references “Eight destinations,” but only five locations exist.
- Some Arabic strings are valid in data; several UI files include corrupted Arabic literals.
- Root HTML language is always `en`, even when locale is Arabic.

