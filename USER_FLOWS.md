# MASAAR User Flows

This document reconstructs flows that actually exist in the code.

## Entry Flow

1. User visits `/`.
2. App shows splash image and role selection.
3. User clicks a role card or demo row.
4. `setRole(role)` stores selected role in Zustand localStorage.
5. User is routed to that role’s main page.

Actual role destinations:

- Traveller -> `/traveller`
- Investor -> `/investor`
- Business Owner -> `/business`
- Government -> `/government`

Flow status:

- Functional.
- Not authenticated.
- Role persists after refresh.

## Shared Navigation Flow

1. Role pages render inside `AppShell`.
2. Bottom nav changes based on role prop.
3. User clicks nav item.
4. Next.js `Link` navigates.
5. Active state is determined by exact or nested pathname match.

Flow status:

- Functional.
- Business bottom nav has five items, which may be dense.

## Shared Search Flow

1. User clicks Search icon in `AppShell`.
2. `panel` local state becomes `search`.
3. Bottom overlay opens.
4. User clicks one of four static quick links.
5. App navigates and closes panel.

Flow status:

- Functional.
- Not a real search query.

## Shared Notification Flow

1. User clicks Bell icon.
2. `panel` local state becomes `notifications`.
3. Bottom overlay opens with three static messages.
4. User closes by clicking X or outside panel.

Flow status:

- Functional.
- Static, not event-driven.

## Language Flow

1. User clicks language toggle.
2. `setLocale` toggles between `en` and `ar`.
3. `useLocale` returns `dir = rtl` for Arabic.
4. `AppShell` sets `dir`.
5. Locale persists in localStorage.

Flow status:

- Partially functional.
- Direction changes.
- Some data names are valid Arabic.
- Many UI strings remain English or mojibake/corrupted.

## Theme Flow

1. User clicks theme button in shell or profile.
2. `toggleTheme()` switches between light/dark.
3. AppShell applies `data-theme`.
4. CSS variables update colors.
5. Theme persists in localStorage.

Flow status:

- Functional at global token level.
- Incomplete because many components contain hardcoded light colors.

## Traveller Discovery To Cart Flow

1. User selects Traveller role or navigates to `/traveller`.
2. User sees destinations and offers.
3. User clicks category chip; list filters locally.
4. User clicks Add matching offer.
5. `addToCart(offer)` adds offer if not already present.
6. Button state changes to Added if that location’s offer is in cart.
7. User opens `/traveller/cart`.
8. Cart items and total are displayed.

Flow status:

- Functional.
- Persisted cart.

Stops/gaps:

- No item removal.
- No destination detail page.

## Traveller Checkout To Business Inbox Flow

1. User adds one or more offers to cart.
2. User goes to `/traveller/cart`.
3. User clicks Checkout request.
4. Store `checkout()` creates a pending booking:
   - id = timestamp
   - locationId = first cart item’s location
   - guest = `Demo Traveller`
   - nights = number of cart items minimum 1
   - amount = sum of offer prices
   - status = `pending`
5. Cart is cleared.
6. Confirmation message appears.
7. User goes to `/business/bookings`.
8. Pending booking appears in Inbox.
9. Business owner can accept or decline it.

Flow status:

- Functional and persisted.

Stops/gaps:

- No dates, guest form, room choice, or cancellation.

## Traveller AI Flow

1. User opens `/traveller/ai`.
2. User clicks prompt or types into input.
3. Local message list appends user message.
4. Local message list appends static AI response.

Flow status:

- Functional mock.

Stops/gaps:

- Does not use Gemini/API key.
- No persistence.

## Investor Opportunity Flow

1. User opens `/investor`.
2. `rankInvestmentOpportunities(locations, bookings)` generates opportunity ranking.
3. Page shows top opportunity, KPIs, map, watchlist, ranking.
4. User can navigate to `/investor/forecast` or `/investor/tenders`.

Flow status:

- Functional dashboard.

Stops/gaps:

- Watchlist not editable.

## Investor Forecast Flow

1. User opens `/investor/forecast`.
2. Ranking is generated from locations/bookings.
3. First ranked location is selected.
4. User clicks region chip or map marker.
5. `selectedId` changes.
6. Chart, metrics, map selection, ROI estimate, and insight update.
7. User can click Open matching tenders.

Flow status:

- Functional simulated forecasting.

Stops/gaps:

- Arabic labels corrupted.
- ROI/payback are heuristic formulas.

## Investor Tender Flow

1. User opens `/investor/tenders`.
2. Browse tab shows tenders.
3. User can filter by category.
4. User clicks bell; local notice appears.
5. User clicks title or Apply; navigates to `/investor/tenders/[id]`.
6. Detail page shows tender information.
7. User clicks Run analysis; static fit score appears.
8. User clicks Start submission.
9. Wizard opens at `/investor/tenders/[id]/submit`.

Flow status:

- Functional.

Stops/gaps:

- Tender filters are approximate.
- AI analysis is static.

## Tender Submission Flow

1. User fills company step.
2. User moves to proposal step.
3. User can click AI draft proposal.
4. Proposal fields populate.
5. User moves to budget/timeline.
6. User edits budget and timeline.
7. User moves to documents.
8. User toggles required documents ready.
9. User reviews summary.
10. User clicks Save draft or Submit now.
11. `addSubmission` stores submission.
12. Router pushes back to `/investor/tenders`.
13. My Submissions tab can display submission.
14. Government tender admin can also see submissions.

Flow status:

- Functional.

Stops/gaps:

- No validation.
- No real uploads.
- Arabic generated proposal text is corrupted.

## Business Booking Flow

1. User opens `/business/bookings`.
2. Inbox shows pending bookings if any; otherwise all bookings.
3. User clicks Accept or Decline.
4. `updateBooking` changes status.
5. State persists.
6. Pending list updates because accepted/declined item no longer qualifies as pending.

Flow status:

- Functional.

Stops/gaps:

- No undo.
- Calendar/Guests/Revenue tabs are read-only summary panels.

## Business Forecast To Offer Flow

1. User opens `/business/forecast`.
2. Page computes Petra forecast using bookings.
3. User sees peak/soft windows, suggested ADR, recovery offer.
4. User clicks Create forecast offer.
5. User navigates to `/business/ai`.
6. User generates offer copy.
7. User publishes to travellers.
8. Confirmation appears.

Flow status:

- Partially functional.

Stops/gaps:

- Published offer does not enter global offers.
- Traveller discovery does not receive the new offer.

## Government Oversight Flow

1. User opens `/government`.
2. Dashboard derives metrics from bookings, tenders, submissions, locations.
3. User can open Traveller, Investor, Business, or Tender Admin through control access.
4. User can open system inbox links.
5. User can view policy recommendations and priority regions.

Flow status:

- Functional read-only command center.

Stops/gaps:

- No real permission system.
- No editable policy actions.

## Government Tender Publishing Flow

1. User opens `/government/tenders`.
2. User edits tender fields.
3. User clicks Publish tender.
4. Local `published` state becomes true.
5. Confirmation appears.

Flow status:

- Partial.

Stops/gaps:

- Does not create a new tender record.
- Form values are not persisted.

