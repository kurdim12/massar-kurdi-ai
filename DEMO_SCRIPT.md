# MASAAR Demo Script

## Safe Presentation Path

### 1. Entry And Role Separation

1. Open `/`.
2. Toggle Arabic once to show RTL support.
3. Toggle back to English if presenting in English.
4. Point out the four separated systems:
   - Traveller
   - Investor
   - Business Owner
   - Government

Proof point: MASAAR is not a single landing page; it is role-based infrastructure.

### 2. Traveller Demand Creation

1. Click Traveller.
2. Show the destination map and 8 destinations.
3. Add one matching offer to the trip.
4. Open Trip.
5. Remove an item if you want to demonstrate cart control, then add it again.
6. Checkout.

Proof point: Traveller action creates a real persisted booking request.

### 3. Business Receives Demand

1. Switch role from Profile or return to `/` and open Business Owner.
2. Open Bookings.
3. Show the pending request.
4. Accept it.
5. Open Dashboard and Forecast.
6. Open AI Offer Studio.
7. Generate offer.
8. Publish to travellers.

Proof point: Business can react to demand, publish supply, and affect Traveller discovery.

### 4. Government Control Layer

1. Open Government.
2. Show:
   - National heatmap
   - High-gap / underused metrics
   - System inbox
   - Demand vs capacity
3. Open Tender Admin.
4. Publish a tender.

Proof point: Government has national oversight and can create economic interventions.

### 5. Investor Response

1. Open Investor.
2. Open Forecast.
3. Select different regions on chips/map.
4. Open Tenders.
5. Confirm the newly published government tender appears.
6. Open a tender detail page.
7. Run AI eligibility analysis.
8. Start submission.
9. Try Submit Now before completing documents to show validation.
10. Generate proposal, mark all documents ready, submit.
11. Return to My Submissions.

Proof point: Investor flow is not UI-only; proposal submissions persist and become visible to government.

### 6. Notifications

1. Click the bell in the top bar.
2. Show dynamic notifications from:
   - Booking request
   - Published offer
   - Published tender
   - Tender submission

Proof point: App state is connected across roles.

## What To Avoid

- Do not claim this is connected to a production backend yet.
- Do not enter a real Gemini key during presentation unless you intend to transmit prompts to Google Gemini.
- Do not claim file upload is real; tender document upload is simulated by checklist.
- Avoid deep claims about finance-grade ROI; it is a demo forecast and investment signal model.

## Best Demo Narrative

MASAAR solves tourism imbalance by connecting four actors:

Traveller demand creates signals.
Business capacity responds with offers.
Government sees imbalance and publishes interventions.
Investors act on forecasted opportunity.

That loop is now clickable end-to-end in the app.

