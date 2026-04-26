# Updated Functionality Matrix

| Area | Issue Found | Fix Applied | State Impact | Status |
|---|---|---|---|---|
| Global Arabic | Mojibake/corrupted Arabic in UI and mock data | Replaced corrupted strings with clean Arabic; scan now clean | Locale state still persisted | Fixed |
| Global i18n | Translations were scattered and inconsistent | Expanded `lib/i18n.ts` with shared helpers | No migration needed | Fixed |
| Root document | HTML language/direction did not reflect Arabic | Added `AppRuntime` to sync `lang`, `dir`, and theme | Uses persisted locale/theme | Fixed |
| Dark mode | Many updated surfaces used hardcoded light panels | Switched edited pages/components to design tokens | Theme remains persisted | Improved |
| Build | Next parallel workers caused OOM | Set `experimental.cpus = 1`; standalone `tsc` passes; Next build skips flaky built-in TS worker | Build config only | Fixed with environment workaround |
| Static locations | UI promised 8 destinations but data had 5 | Added Jerash, Madaba, Karak with forecast data | Forecast engine now ranks 8 locations | Fixed |
| Traveller discovery | Only static offers appeared | Discovery uses static + published offers | Reads `publishedOffers` | Fixed |
| Traveller cart | No item-level removal | Added remove button per cart row | Uses `removeFromCart` | Fixed |
| Traveller checkout | Worked but confirmation was limited | Keeps confirmation and creates dynamic notification | Adds booking + notification | Fixed |
| Traveller AI | Hardcoded response | Calls `askMasaarAI('itinerary')` with loading/error states | Reads persisted `apiKey` | Fixed |
| Investor forecast | Corrupted Arabic strings | Rebuilt clean bilingual page copy | Uses existing forecast state | Fixed |
| Investor tenders | Static tenders only | Uses `getAllTenders()` including government-published tenders | Reads `publishedTenders` | Fixed |
| Tender detail | Static tender source | Uses persisted + static tender list | Reads `publishedTenders` | Fixed |
| Tender wizard | No validation before final submission | Blocks submit until required fields/docs/proposal are complete | Valid submissions only | Fixed |
| Tender success | Submissions persisted but feedback path unclear | Redirects to tenders with saved/submitted state in My Submissions count | Adds submission + notification | Improved |
| Business dashboard | Corrupted Arabic strings | Rebuilt dashboard copy with clean bilingual text | Reads bookings/offers | Fixed |
| Business forecast | Corrupted Arabic strings | Rebuilt clean bilingual forecast page | Uses forecast engine | Fixed |
| Business AI | Fake publish confirmation | AI generation uses `askMasaarAI`; publish creates persisted offer | Adds offer + notification | Fixed |
| Government tenders | Fake publish confirmation | Publish creates persisted tender visible to investor/government lists | Adds tender + notification | Fixed |
| Government dashboard | Static tender count | Reads combined tender list | Reads `publishedTenders` | Fixed |
| Notifications | Static panel | Derived from app state and persisted notification events | Adds/dismisses notifications | Fixed |
| Business mobile nav | Five items cramped | Reduced nav padding/tracking and active background treatment for 5-item nav | No state change | Improved |
| Charts/map | Light-only styling | Token-based chart axes/grid and map legend | No state change | Improved |
| Browser QA | In-app browser automation blocked by Node version | Route smoke tests performed via dev server | No app state change | Environment-limited |
