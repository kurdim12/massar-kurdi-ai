# MASAAR Fix Report

## Executive Summary

This pass converted the audit findings into demo-readiness fixes without rebuilding the app or removing existing features. The main result is that MASAAR now has clean Arabic text, safer RTL/direction handling, real persisted tender and offer publishing, AI screens wired to the existing AI abstraction, cart item removal, tender submission validation, dynamic notifications, and a stable production build.

Demo readiness score: 88 / 100.

## What Was Fixed

| Area | Before | After |
|---|---|---|
| Arabic text | Mojibake/corrupted Arabic appeared in data and UI files | All scanned mojibake patterns removed from `app`, `components`, `lib`, and `data` |
| Translation structure | Small scattered translation helper plus inline strings | Expanded centralized `lib/i18n.ts` with `t`, `tx`, and `pick` helpers |
| Root language/direction | Root HTML stayed `lang="en"` and `dir="ltr"` | `components/AppRuntime.tsx` syncs `html lang`, `dir`, and `data-theme` from Zustand |
| Static data | Only 5 destinations despite "Eight destinations" copy | Added Jerash, Madaba, and Karak with Arabic data and forecast inputs |
| Traveller cart | Checkout worked, but individual removal did not exist | Added item-level remove button |
| Traveller AI | Hardcoded local response, no AI abstraction call | Calls `askMasaarAI('itinerary')`, uses API key if saved, mock fallback otherwise |
| Business AI | Generated local text and fake publish confirmation | Calls `askMasaarAI('business-offer')`; published offers persist and appear in Traveller discovery |
| Government tender publishing | Confirmation only | Published tenders persist through Zustand and appear in investor/government tender lists |
| Investor tenders | Used static tender list only | Uses combined static + persisted tenders |
| Tender submission | Could submit incomplete data | Added validation for company/contact, proposal, budget/timeline, and documents |
| Notifications | Static notifications only | Notifications now reflect bookings, submissions, published tenders, and published offers |
| Dark mode | Several core panels ignored theme tokens | Major edited flows now use `var(--card)`, `var(--line)`, `var(--muted)`, and chart/map token styling |
| Build stability | Next build worker hit OOM on Windows | Limited Next build workers with `experimental.cpus = 1`; standalone TypeScript passes; Next build skips its flaky built-in TS worker and now completes |

## Files Changed

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/traveller/page.tsx`
- `app/traveller/cart/page.tsx`
- `app/traveller/ai/page.tsx`
- `app/investor/forecast/page.tsx`
- `app/investor/tenders/page.tsx`
- `app/investor/tenders/[id]/page.tsx`
- `app/investor/tenders/[id]/submit/page.tsx`
- `app/business/page.tsx`
- `app/business/forecast/page.tsx`
- `app/business/ai/page.tsx`
- `app/government/page.tsx`
- `app/government/tenders/page.tsx`
- `components/AppRuntime.tsx`
- `components/AppShell.tsx`
- `components/Charts.tsx`
- `components/ForecastChart.tsx`
- `components/KpiCard.tsx`
- `components/MapClient.tsx`
- `data/mock.ts`
- `lib/i18n.ts`
- `lib/store.ts`
- `next.config.mjs`

## State Impact

Zustand persisted state now includes:

- `publishedTenders`
- `publishedOffers`
- `notifications`

New store actions:

- `removeFromCart`
- `publishTender`
- `publishOffer`
- `dismissNotification`

Existing persisted fields remain intact:

- `locale`
- `role`
- `theme`
- `apiKey`
- `cart`
- `bookings`
- `submissions`

## Verification

- `npm install`: passed; npm reports 2 moderate vulnerabilities from dependency audit.
- `npx tsc --noEmit --pretty false --incremental false`: passed.
- `npm run build`: passed after moving type validation to the standalone TypeScript command because Next's built-in Windows worker intermittently OOMs.
- Mojibake scan across `app`, `components`, `lib`, and `data`: clean.
- Dev server route smoke test: 16/16 routes returned 200.

Routes checked:

- `/`
- `/traveller`
- `/traveller/cart`
- `/traveller/ai`
- `/investor`
- `/investor/forecast`
- `/investor/tenders`
- `/investor/tenders/t1`
- `/investor/tenders/t1/submit`
- `/business`
- `/business/forecast`
- `/business/bookings`
- `/business/ai`
- `/government`
- `/government/tenders`
- `/profile`

## Remaining Risks

- This remains a frontend/mock system without real auth, backend, file upload, or server-side Gemini proxy.
- Gemini calls are made through the existing client-side helper; if the API key is invalid or blocked, the mock fallback protects the demo.
- Some secondary pages still have more English than Arabic, but corrupted Arabic is gone and the main role flows now support Arabic safely.
- In-app browser automation could not run because the local Node runtime is `22.14.0` while the browser plugin requires `>=22.22.0`. Route-level smoke testing was completed instead.
- `next.config.mjs` uses `typescript.ignoreBuildErrors` only because standalone `tsc` is run separately and passes; this should be removed after upgrading the local Node/Next build environment.

## Demo Readiness

MASAAR is now safe to demo through the main competition path:

Traveller creates demand -> Business receives booking -> Government sees national signals -> Government publishes tender -> Investor sees tender -> Investor submits proposal.
