# MASAAR Features Map

This file lists features that exist in the current codebase only.

## Entry And Role Selection

### Splash / Brand Hero

- Location: `app/page.tsx`
- What it does: Shows a MASAAR splash image from `/brand/splash.png`, with EST and AMMAN labels.
- Trigger: Initial visit to `/`.
- State: Reads `theme`, `locale`, and `dir`.
- Completeness: Visual and functional as an entry screen.

### Role Selection

- Location: `app/page.tsx`
- What it does: Displays four role cards: Traveller, Investor, Business Owner, Government.
- Trigger: User clicks a role hero card or demo row.
- Logic: Calls `setRole(role)` in Zustand, then `router.push(href)`.
- Persistence: Role persists in localStorage.
- Completeness: Functional.
- Caveat: Arabic text in this page currently contains mojibake string literals in the code.

### Government Sign-In Shortcut

- Location: `app/page.tsx`
- What it does: Button labeled Sign in / Arabic equivalent routes to `/government` and sets role to `government`.
- Trigger: Click.
- Completeness: Functional as a demo shortcut, not real authentication.

## Shared Shell Features

### Role-Based Bottom Navigation

- Location: `components/AppShell.tsx`
- What it does: Shows nav items based on the `role` prop.
- Trigger: Render of any role page.
- Logic: Uses `navByRole[role]`; active state is based on current pathname.
- Completeness: Functional.
- Caveat: Business has 5 bottom nav items, which may feel cramped on mobile.

### Search Panel

- Location: `components/AppShell.tsx`
- What it does: Opens a quick-search panel with links to Investor Forecast, Government Tenders, Business Bookings, Traveller AI.
- Trigger: Search icon click.
- State: Local component state `panel = 'search'`.
- Result: Clicking a link navigates and closes the panel.
- Completeness: Functional quick-link panel, not text search.

### Notifications Panel

- Location: `components/AppShell.tsx`
- What it does: Opens a panel with three static alert messages.
- Trigger: Bell icon click.
- State: Local component state `panel = 'notifications'`.
- Completeness: Functional static panel.
- Caveat: Notifications are not generated from live app state.

### Language Toggle

- Location: `components/AppShell.tsx`, `lib/i18n.ts`, `lib/store.ts`
- What it does: Toggles `locale` between `en` and `ar`; `dir` becomes `rtl` for Arabic.
- Trigger: Language button click.
- Persistence: Locale persists in Zustand localStorage.
- Completeness: Partially functional.
- Caveat: Many page strings are English-only; several Arabic UI strings are corrupted in some files.

### Theme Toggle

- Location: `components/AppShell.tsx`, `lib/store.ts`, `app/globals.css`
- What it does: Toggles `theme` between `light` and `dark`.
- Trigger: Sun icon click.
- Persistence: Theme persists in Zustand localStorage.
- Completeness: Functional at token/shell level.
- Caveat: Some components use hardcoded light colors (`#fffaf5`, `#425676`, etc.), so dark mode is incomplete visually.

## Traveller Features

### Traveller Discovery

- Location: `app/traveller/page.tsx`
- What it does: Shows hero image, Jordan Pass/Permit KPIs, forecast map, category filters, AI note, destination cards, and offer add buttons.
- Trigger: Visit `/traveller`.
- Data: `locations`, `offers`, forecast results from `forecastAll`.
- Completeness: Functional, with caveats.

### Destination Category Filters

- Location: `app/traveller/page.tsx`
- What it does: Filters displayed destinations by All, Cultural, Nature, Coastal, Religious.
- Trigger: Filter chip click.
- State: Local `filter`.
- Completeness: Functional.
- Caveat: Filtering logic is hand-coded and approximate; categories are not data-driven.

### Add Matching Offer To Trip

- Location: `app/traveller/page.tsx`
- What it does: Adds first matching offer for a location to `cart`.
- Trigger: Add matching offer button.
- State: Zustand `cart`.
- Persistence: Cart persists.
- Completeness: Functional.
- Caveat: No remove-from-cart action exists.

### Traveller Cart

- Location: `app/traveller/cart/page.tsx`
- What it does: Displays cart contents, item count, total, and checkout button.
- Trigger: Visit `/traveller/cart`.
- State: Zustand `cart`.
- Completeness: Functional.

### Checkout To Booking Request

- Location: `app/traveller/cart/page.tsx`, `lib/store.ts`
- What it does: Creates a new pending booking from cart contents and clears cart.
- Trigger: Checkout request button.
- State: Adds to `bookings`, clears `cart`, sets local confirmation message.
- Persistence: Booking persists; cart clear persists.
- Completeness: Functional closed-loop demo.
- Caveat: Guest is hardcoded as `Demo Traveller`; no booking dates are captured.

### Traveller AI Advisor

- Location: `app/traveller/ai/page.tsx`
- What it does: Chat-like interface with prompt chips and message input.
- Trigger: Prompt chip click or form submit.
- State: Local `messages`, local `draft`.
- Completeness: Functional mock chat.
- Caveat: Does not call `lib/ai.ts` or Gemini; responses are hardcoded.

## Investor Features

### Investor Opportunities

- Location: `app/investor/page.tsx`
- What it does: Shows top opportunity, opportunity KPIs, map, watchlist, ranked locations, and link to tenders.
- Trigger: Visit `/investor`.
- Logic: Uses `rankInvestmentOpportunities`.
- Completeness: Functional static/derived dashboard.

### Investor Forecast Workspace

- Location: `app/investor/forecast/page.tsx`
- What it does: Shows selectable forecast regions, single-location forecast chart, growth, supply gap, confidence, ROI estimate, map, AI insight, methodology, demand-vs-supply chart.
- Trigger: Visit `/investor/forecast`; region chip click; map marker click.
- State: Local `selectedId`.
- Data: `locations`, `bookings`, forecast ranking.
- Completeness: Functional simulation.
- Caveat: Arabic labels in this page contain mojibake string literals.

### Investor Tender Browse

- Location: `app/investor/tenders/page.tsx`
- What it does: Browse tenders, switch to My Submissions tab, filter tender list, request tender notification, open tender detail.
- Trigger: Tab, filter chip, bell, Apply link.
- State: Local `tab`, `filter`, `notice`, `analysis`; global `submissions`.
- Completeness: Functional.
- Caveat: Filters are approximate; AI eligibility check on list is generic and not tied to selected tender.

### Tender Detail

- Location: `app/investor/tenders/[id]/page.tsx`
- What it does: Displays tender metadata, requirements, AI eligibility check, and start submission link.
- Trigger: Opening `/investor/tenders/[id]`.
- State: Local `analysis`.
- Completeness: Functional.
- Caveat: Aqaba tender detail is special-cased and not fully derived from tender data.

### Tender Submission Wizard

- Location: `app/investor/tenders/[id]/submit/page.tsx`
- What it does: 5-step wizard: Company, Proposal, Budget, Documents, Review.
- Trigger: Opening `/investor/tenders/[id]/submit`.
- State: Local form state until save.
- Persistence: `Save draft` or `Submit now` calls `addSubmission`, stored in Zustand localStorage.
- Completeness: Functional.
- Caveats:
  - Step navigation allows jumping ahead via progress buttons.
  - No validation blocks submission.
  - Arabic generated proposal text is mojibake/corrupted.

## Business Features

### Business Dashboard

- Location: `app/business/page.tsx`
- What it does: Shows occupancy, KPIs, AI note, action queue, demand chart, peak/opportunity windows, revenue controls, active offer, links to forecast/bookings/AI.
- Trigger: Visit `/business`.
- State: Reads `bookings`, local `offerStatus`.
- Completeness: Functional dashboard.
- Caveat: Some metrics are hardcoded; some Arabic strings were added but may not fully cover all content.

### Business Offer Edit / Boost Feedback

- Location: `app/business/page.tsx`
- What it does: Edit and Boost buttons set visible status text.
- Trigger: Button clicks.
- Completeness: Functional feedback only; no offer data mutation.

### Business Forecast

- Location: `app/business/forecast/page.tsx`
- What it does: Computes forecast for Petra/Rose City context; shows peak month, soft month, suggested ADR, recovery offer, actions, and link to Offer Studio.
- Trigger: Visit `/business/forecast`.
- Logic: Uses `forecastLocation`.
- Completeness: Functional simulation.
- Caveat: Always uses Petra; no business/location selection.

### Business Bookings

- Location: `app/business/bookings/page.tsx`
- What it does: Tabbed booking module with Inbox, Calendar, Guests, Revenue.
- Trigger: Tab click.
- State: Local `tab`; global `bookings`.
- Completeness: Partially functional.
- Inbox: functional accept/decline.
- Calendar/Guests/Revenue: summary panels only.

### Accept / Decline Booking

- Location: `app/business/bookings/page.tsx`, `lib/store.ts`
- What it does: Updates booking status to `accepted` or `declined`.
- Trigger: Accept/Decline button click.
- Persistence: Booking status persists.
- Completeness: Functional.

### Business Offer Studio

- Location: `app/business/ai/page.tsx`
- What it does: Generates static offer copy and can show a published confirmation.
- Trigger: Generate offer button, Publish to travellers button.
- State: Local `copy`, `published`.
- Completeness: Functional feedback.
- Caveat: Does not create an actual `Offer` in global state or show it in Traveller discovery.

## Government Features

### Government Command Center

- Location: `app/government/page.tsx`
- What it does: Shows national metrics, heatmap, control access links, policy recommendations, system inbox, demand-vs-capacity, priority regions.
- Trigger: Visit `/government`.
- Data: `locations`, `bookings`, `tenders`, `submissions`, forecast outputs.
- Completeness: Functional command dashboard.
- Caveat: Mostly read-only; English-only.

### Government Tender Administration

- Location: `app/government/tenders/page.tsx`
- What it does: Displays a tender publishing form, current tenders, and investor submissions.
- Trigger: Visit `/government/tenders`; Publish tender button.
- State: Local `published`; global `submissions`.
- Completeness: Partially functional.
- Caveat: Publish tender only shows confirmation; it does not add a new tender to `tenders`.

## Shared Profile

### Role-Aware Profile

- Location: `app/profile/page.tsx`
- What it does: Reads current role, shows role-specific name/stats/actions, settings, API key input, account links.
- Trigger: Visit `/profile`.
- State: Reads `role`, `locale`, `theme`, `apiKey`, `cart`, `bookings`, `submissions`.
- Completeness: Functional basics.
- Caveats:
  - Account links are demo links.
  - Sign in routes to `/`, not authentication.
  - Theme row now toggles theme.
  - API key is stored in localStorage.

