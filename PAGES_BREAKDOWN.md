# Page-By-Page Breakdown

## `/` Entry / Role Selection

Purpose:

- Introduces MASAAR and lets the user choose a role.

Components / modules:

- `useRouter`
- `useMasaarStore`
- `useLocale`
- Lucide icons
- Splash asset `/brand/splash.png`

User actions:

- Click Government Sign in.
- Click any of the four role cards.
- Click any demo profile row.

Displayed data:

- Static role definitions inside `app/page.tsx`.
- Current locale and theme from store.

State:

- Reads `theme`, `locale`, `dir`.
- Writes `role`.

Functional:

- Role selection and navigation.
- Theme application.
- Direction switch.

Not fully wired:

- Not real sign-in.
- Arabic strings in this file are currently corrupted/mojibake.

## `/traveller`

Purpose:

- Traveller discovery surface with destinations, forecast map, categories, and add-to-trip actions.

Components:

- `AppShell`
- `ForecastMap`
- `KpiCard`

User actions:

- Use bottom nav.
- Open search/notifications/theme/language through shell.
- Click category chips.
- Add matching offers to trip.
- Click Ask Masaar AI.

Displayed data:

- `locations`
- `offers`
- `forecastAll(locations, bookings)`
- cart count through button state

State:

- Reads `bookings`, `cart`.
- Writes `cart` through `addToCart`.
- Local `filter`.

Functional:

- Category filters work.
- Add-to-cart works and persists.
- Forecast map renders.
- Link to AI works.

Not fully wired:

- Destination cards do not link to destination detail pages.
- “Eight destinations” copy conflicts with five locations in data.
- No remove-from-cart from this page.
- Arabic page content is mostly not implemented.

## `/traveller/cart`

Purpose:

- Shows trip cart and sends booking requests to Business Owner inbox.

Components:

- `AppShell`
- `KpiCard`

User actions:

- Back to Traveller.
- Discover Jordan when empty.
- Checkout request when cart has items.

Displayed data:

- Cart items from Zustand.
- Location names for offers.
- Total price.

State:

- Reads `cart`.
- Calls `checkout()`.
- Local confirmation message after checkout.

Functional:

- Checkout creates a pending booking and clears cart.
- Confirmation appears after checkout.
- Empty state is functional.

Not fully wired:

- No cart item removal.
- No date/guest/details form.
- Booking guest name is hardcoded in store.

## `/traveller/ai`

Purpose:

- Mock AI travel advisor chat.

Components:

- `AppShell`

User actions:

- Click prompt chips.
- Type a message and submit.

Displayed data:

- Local message list.

State:

- Local `messages`.
- Local `draft`.

Functional:

- Messages append.
- Prompt chips submit.

Not fully wired:

- Does not call Gemini or `lib/ai.ts`.
- Responses are static.
- Chat history does not persist.
- Arabic mode does not translate this page.

## `/investor`

Purpose:

- Investor opportunity overview.

Components:

- `AppShell`
- `KpiCard`
- `ForecastMap`

User actions:

- Navigate to forecast.
- Navigate to tenders.
- Interact with map popups.

Displayed data:

- Ranked forecast opportunities.
- Top opportunity.
- Watchlist.
- Ranking.

State:

- Reads `bookings`.
- Derived `rankInvestmentOpportunities`.

Functional:

- Ranking and map render.
- Links work.

Not fully wired:

- Watchlist is static; not editable.
- Map marker selection is not used here.
- Arabic not implemented for page content.

## `/investor/forecast`

Purpose:

- Investor forecasting workspace.

Components:

- `AppShell`
- `ForecastChart`
- `ForecastMap`
- `DemandSupplyChart`

User actions:

- Select region chip.
- Select map marker.
- Navigate to tenders.

Displayed data:

- Demand score.
- Growth.
- Supply gap.
- Confidence.
- ROI estimate.
- Payback estimate.
- AI insight text.
- Methodology text.

State:

- Reads `bookings`.
- Local `selectedId`.
- Derived ranking and ROI math.

Functional:

- Region selection updates metrics/chart/map selection.
- Map selection updates selected region.
- Link to tenders works.

Not fully wired:

- Arabic labels are currently mojibake in this file.
- ROI/payback are simulated formulas, not financial model.
- Methodology is explanatory text only.

## `/investor/tenders`

Purpose:

- Investor tender browse and submissions list.

Components:

- `AppShell`

User actions:

- Switch Browse/My Submissions tabs.
- Filter tenders.
- Click notification bell.
- Run generic AI eligibility check.
- Click tender title or Apply.
- Start proposal wizard.

Displayed data:

- `tenders`.
- `submissions`.

State:

- Reads `submissions`.
- Local `tab`, `filter`, `notice`, `analysis`.

Functional:

- Tabs work.
- Filters work.
- Bell shows notification message.
- Apply/detail navigation works.
- My Submissions displays saved/submitted entries.

Not fully wired:

- Filter rules are approximate.
- Generic AI analysis is not specific to tender.
- Arabic not implemented.

## `/investor/tenders/[id]`

Purpose:

- Tender detail page.

Components:

- `AppShell`

User actions:

- Back to tenders.
- Run AI analysis.
- Start submission.

Displayed data:

- Tender title, agency, requirements, budget/deadline/days left.

State:

- Local `analysis`.
- Uses route param `id`.

Functional:

- Finds tender by id.
- Analysis message appears.
- Start submission navigates.

Not fully wired:

- Aqaba detail is hardcoded/special-cased.
- Requirements are static for all tenders.
- No persisted analysis result.

## `/investor/tenders/[id]/submit`

Purpose:

- 5-step tender submission wizard.

Components:

- `AppShell`

User actions:

- Back/cancel.
- Click progress segments.
- Fill company info.
- Generate proposal.
- Edit proposal fields.
- Edit budget/timeline.
- Toggle documents ready.
- Save draft.
- Submit now.

Displayed data:

- Current tender title.
- Wizard step content.
- Review summary.

State:

- Local form state.
- Writes `submissions` on draft/submit.

Functional:

- Wizard navigation works.
- Document checklist toggles.
- Save/Submit persists submission and redirects.

Not fully wired:

- No validation.
- Step segments allow jumping.
- Generated Arabic proposal is mojibake.
- No file upload.

## `/business`

Purpose:

- Business owner operational dashboard.

Components:

- `AppShell`
- `KpiCard`
- `OccupancyTrendChart`

User actions:

- Action queue links.
- Edit/Boost active offer.
- New offer/Emergency links.
- Open forecast.
- Open bookings.

Displayed data:

- Bookings.
- Revenue from bookings.
- Hardcoded occupancy/offer/pricing.

State:

- Reads `bookings`.
- Local `offerStatus`.

Functional:

- Dashboard renders.
- Action links work.
- Edit/Boost produce visible feedback.
- Forecast/bookings links work.

Not fully wired:

- Offer edit/boost do not mutate real offer data.
- Metrics are mostly hardcoded.
- Arabic exists in parts but current code output shows mojibake risk.

## `/business/forecast`

Purpose:

- Business-specific demand forecast.

Components:

- `AppShell`
- `ForecastChart`

User actions:

- Click Create forecast offer.

Displayed data:

- Petra/Rose City forecast.
- Peak/soft windows.
- ADR/recovery suggestions.
- Recommended actions.

State:

- Reads `bookings`.
- Uses `forecastLocation` for Petra.

Functional:

- Forecast chart and metrics render.
- Link to offer studio works.

Not fully wired:

- No business/location selector.
- Arabic labels currently include mojibake.
- Recommendations do not write state.

## `/business/bookings`

Purpose:

- Booking operations module.

Components:

- `AppShell`

User actions:

- Switch tabs.
- Accept pending booking.
- Decline pending booking.

Displayed data:

- Bookings from Zustand.
- Pending bookings first in Inbox if any.
- Static calendar/guest/revenue panels.

State:

- Reads `bookings`.
- Updates booking status.
- Local `tab`.

Functional:

- Tabs work.
- Accept/Decline persists.

Not fully wired:

- Calendar, Guests, Revenue are summary panels only.
- No undo.
- Date values in Inbox are hardcoded.

## `/business/ai`

Purpose:

- Business AI offer studio.

Components:

- `AppShell`

User actions:

- Generate offer.
- Publish to travellers.

Displayed data:

- Copy text.
- Published confirmation.

State:

- Local `copy`, `published`.

Functional:

- Generate changes copy.
- Publish shows confirmation.

Not fully wired:

- Does not create real offer in global state.
- Traveller page does not receive generated offer.

## `/government`

Purpose:

- Government command center.

Components:

- `AppShell`
- `KpiCard`
- `ForecastMap`
- `DemandSupplyChart`

User actions:

- Use control access links.
- Use system inbox links.
- Interact with map popups.

Displayed data:

- National forecast KPIs.
- Policy insights.
- System inbox.
- Demand vs capacity.
- Priority regions.

State:

- Reads `bookings`, `submissions`.
- Derived forecasts/rankings.

Functional:

- Dashboard renders.
- Access links work.
- Inbox links work.

Not fully wired:

- Mostly read-only.
- English-only.
- Policy insights are mock text.

## `/government/tenders`

Purpose:

- Government tender administration.

Components:

- `AppShell`

User actions:

- Edit tender publishing fields.
- Click Publish tender.

Displayed data:

- Current tenders.
- Investor submissions.

State:

- Reads `submissions`.
- Local `published`.

Functional:

- Publish button shows confirmation.
- Submissions list reflects investor wizard submissions.

Not fully wired:

- Publishing does not add new tender to global tender data.
- Form data is not stored.
- English-only.

## `/profile`

Purpose:

- Shared role-aware profile/settings page.

Components:

- `AppShell`

User actions:

- Quick action links.
- Switch language.
- Toggle theme.
- Type Gemini API key.
- Account links.

Displayed data:

- Current role-derived name/stats.
- Locale.
- Theme.
- AI mode.

State:

- Reads and writes `locale`, `theme`, `apiKey`.
- Reads cart/bookings/submissions for stats.

Functional:

- Quick actions navigate.
- Language changes persisted locale.
- Theme toggles.
- API key persists.

Not fully wired:

- About/Switch role/Sign in are demo links to `/`.
- No authentication.
- Profile names are static.

