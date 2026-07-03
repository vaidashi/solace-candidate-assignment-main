---
title: Homepage Specialty Trust - Plan
type: feat
date: 2026-07-03
topic: homepage-specialty-trust
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
---

# Homepage Specialty Trust - Plan

## Goal Capsule

- **Objective:** Improve homepage first impression so a first-time visitor trusts Solace as a specialty-aware matching tool before they run their first search.
- **Product authority:** Confirmed through brainstorm dialogue in this session.
- **Open blockers:** None.

---

## Product Contract

### Summary

Reframe the homepage around fast specialty-based matching, not a generic advocate directory.
The landing experience should prove visitors can start from a care need, see credible example matches immediately, and move into search without extra friction.

### Problem Frame

The current homepage is functional but reads like a plain searchable list.
That makes a first-time visitor do trust-building work on their own before they even know whether the app understands specialty fit.
For this pass, the biggest risk is not weak search mechanics but weak proof that Solace can help someone find the right advocate fast.

### Key Decisions

- **Lead with specialty trust, not generic polish.** The homepage should answer "can this tool match me by care need?" before it asks the visitor to search.
- **Use lightweight proof signals.** Trust should come from specialty entry chips and visible example advocates, not from heavier systems like reviews, ratings, or verification programs in this pass.
- **Keep search primary.** Added context should support the search action, not bury it under a long marketing narrative.

### Requirements

**Homepage framing**

- R1. The homepage must position Solace as a tool for finding the right advocate by specialty, not as a generic advocate directory.
- R2. Above-the-fold copy must make the primary job explicit: a visitor can find the right advocate fast by starting from a care need.

**Specialty trust signals**

- R3. The homepage must surface specialty-led entry points before the user performs a search.
- R4. Specialty entry points must feel curated around recognizable care needs rather than abstract filtering language.
- R5. The first screen must show a small set of credible advocate examples with visible specialty alignment.

**Search handoff**

- R6. The search action must remain immediately available from the homepage without requiring the visitor to scroll through supporting content first.
- R7. Interacting with specialty trust signals must make it easier to begin a relevant search, not create a separate exploratory flow.

**Information hierarchy**

- R8. Trust-building content on the homepage must stay tightly scoped to helping a first-time visitor start matching work fast.
- R9. The homepage must avoid introducing heavier trust frameworks such as reviews, ratings, or verification badges in this pass.

### Key Flows

- F1. First-time visitor understands the matching promise
  - **Trigger:** A first-time visitor lands on the homepage.
  - **Steps:** The visitor sees specialty-aware framing, recognizes familiar care-need entry points, and notices example advocates that make the matching promise feel real.
  - **Outcome:** The visitor trusts that Solace can help with specialty-aware matching and is ready to search.

- F2. Visitor starts from a care need and moves into search
  - **Trigger:** The visitor wants to find an advocate for a specific specialty.
  - **Steps:** The visitor selects or uses a visible specialty cue, then continues into search with stronger confidence that the results will be relevant.
  - **Outcome:** The homepage shortens time-to-first-search instead of adding friction before it.

### Acceptance Examples

- AE1.
  - **Covers:** R1, R2, R3, R5.
  - **Given:** A first-time visitor arrives with no prior knowledge of Solace.
  - **When:** They scan the first screen for a few seconds.
  - **Then:** They can tell the product helps them find advocates by specialty and can see real examples that support that claim.

- AE2.
  - **Covers:** R6, R7, R8.
  - **Given:** A visitor recognizes a relevant specialty cue on the homepage.
  - **When:** They decide to act on it.
  - **Then:** They can move into search immediately without entering a separate onboarding or browsing flow.

### Success Criteria

- A first-time visitor can describe the app as a specialty-aware advocate matching tool after scanning the landing page briefly.
- The homepage makes specialty fit feel credible enough that the user is ready to search immediately.
- Trust-building additions improve clarity without making the page feel slower or more complicated to use.

### Scope Boundaries

- Add stronger first-impression trust signals on the homepage.
- Keep the search-first job intact.
- Do not expand this pass into compare workflows, deeper filtering behavior, backend search changes, testing strategy, or dependency/security cleanup.

### Dependencies / Assumptions

- Existing advocate specialty data is strong enough to support believable specialty-led presentation on the homepage.
- The current search experience remains the main action path after the homepage polish.
- Featured examples can be presented without introducing new credibility systems beyond visible specialty alignment.

### Outstanding Questions

- **Deferred to Planning:** Which specialties should appear as initial entry points so the homepage feels representative without overwhelming the user?
- **Deferred to Planning:** How should example advocates be chosen so they feel credible and varied while preserving a lightweight homepage load?

### Sources / Research

- Current homepage structure: `src/app/page.tsx`
- Current search input: `src/components/SearchBar.tsx`
- Current result-card presentation: `src/components/AdvocateCard.tsx`
- Current advocate grid and sorting controls: `src/components/AdvocateGrid.tsx`
- Current advocate API behavior: `src/app/api/advocates/route.ts`
- Current no-DB fallback implementation surface: `src/db/index.ts`
- Current seed data source: `src/db/seed/advocates.ts`
- Current candidate backlog note: `DISCUSSION.md`

---

## Planning Contract

### Product Contract Preservation

Product Contract unchanged.

### Summary

Implement the homepage trust pass by combining deterministic specialty-aware entry points, visible featured advocates, and an always-available search action.
The implementation should also restore a reliable no-database data path so the matching promise is visible in local and evaluation environments without extra setup.

### Key Technical Decisions

- **Use a deterministic fallback data source for homepage trust content.** The current API path depends on database reads despite README promising a default list, so homepage proof should not rely on optional infrastructure.
- **Keep specialty trust and search on the same page state.** Specialty chips should feed the existing search experience instead of introducing a separate browsing or onboarding flow.
- **Split homepage trust UI into dedicated presentation components.** The existing `page.tsx` owns too much layout and request logic for a richer first impression.
- **Add focused UI and API tests as part of the feature.** There is no existing test harness, so the implementation should create the smallest sustainable coverage needed to protect the new behavior.

### Assumptions

- A curated subset of specialties can be chosen from the existing seed vocabulary without requiring new product copy systems.
- Featured advocates can be derived from the existing advocate dataset and do not need a new editorial workflow in this pass.
- Search query parameters are the right handoff mechanism from homepage specialty chips into the current listing flow.

### Risks & Dependencies

- Seed data currently randomizes specialties, which can make homepage proof feel inconsistent. The implementation should avoid using unstable random slices for trust content.
- Existing build health is already red because `src/app/page.tsx` fails lint checks. The feature should leave the touched homepage path lint-clean.
- Adding test tooling creates some setup overhead, but skipping it would leave the new homepage behavior and no-DB fallback unprotected.

### System-Wide Impact

- Homepage information architecture changes in `src/app/page.tsx` and new presentation components
- API data-shape and fallback behavior in `src/app/api/advocates/route.ts`
- Shared advocate data usage and possible normalization helpers around `src/db/seed/advocates.ts` and `src/types/advocate.ts`
- Project tooling via `package.json` if tests are added

---

## Implementation Units

### U1. Stabilize specialty-aware homepage data

- **Goal:** Provide a deterministic data source for specialty chips and featured advocates that works with or without a configured database.
- **Requirements:** R1, R3, R4, R5, F1, F2, AE1, AE2
- **Dependencies:** None
- **Files:** `src/app/api/advocates/route.ts`, `src/db/seed/advocates.ts`, `src/types/advocate.ts`, `src/lib/homepage-trust.ts`, `src/lib/homepage-trust.test.ts`
- **Approach:** Extract stable specialty-aware homepage data from the existing advocate dataset, remove homepage dependence on randomized seed slices for trust content, and make the advocate API return usable data in no-DB mode so the homepage and search experience stay credible in default local runs.
- **Execution note:** Start with route/helper tests that characterize the current empty-data failure in no-DB mode, then implement deterministic fallback behavior.
- **Patterns to follow:** Keep the route response contract compatible with existing `src/app/page.tsx` fetch behavior; reuse current advocate shapes from `src/types/advocate.ts`.
- **Test scenarios:**
  - No-DB mode returns a non-empty advocate list and valid pagination metadata instead of an empty dataset.
  - Covers AE1. Homepage trust helper returns a deterministic specialty chip list from recognizable care needs rather than an arbitrary random subset.
  - Featured advocate selection returns a small, stable set with visible specialty alignment and no duplicate advocates.
  - Search plus specialty filtering still returns relevant advocates when using the fallback dataset.
  - Sorting by `yearsOfExperience` preserves correct order in fallback mode.
- **Verification:** A fresh local run without `DATABASE_URL` still shows meaningful advocate data and homepage trust content.

### U2. Build first-impression specialty trust modules

- **Goal:** Introduce reusable homepage sections for specialty-led entry and featured advocate proof.
- **Requirements:** R1, R2, R3, R4, R5, R8, R9, F1, AE1
- **Dependencies:** U1
- **Files:** `src/components/HomepageHero.tsx`, `src/components/SpecialtyChips.tsx`, `src/components/FeaturedAdvocates.tsx`, `src/components/FeaturedAdvocates.test.tsx`, `src/components/AdvocateCard.tsx`
- **Approach:** Create dedicated homepage modules that communicate the matching promise quickly, render curated specialty chips, and show a small set of featured advocates above the main directory results. Extend card presentation only as needed to make specialty alignment legible in the featured context.
- **Patterns to follow:** Keep component props typed like the existing component layer; reuse existing advocate card vocabulary where possible instead of inventing a separate homepage card model.
- **Test scenarios:**
  - Covers AE1. The hero/featured stack renders specialty-aware framing and at least one visible advocate example on first load.
  - Specialty chips render curated care-need labels rather than generic filter copy.
  - Featured advocate cards surface specialty information prominently enough to distinguish fit from a generic directory row.
  - The featured section handles short or missing featured lists gracefully without breaking homepage layout.
- **Verification:** Homepage modules can render from deterministic fixture data and visibly communicate specialty trust before search interaction.

### U3. Rework homepage flow around trust-first search handoff

- **Goal:** Restructure the main page so trust content and search reinforce the same matching workflow.
- **Requirements:** R2, R6, R7, R8, F1, F2, AE2
- **Dependencies:** U1, U2
- **Files:** `src/app/page.tsx`, `src/components/SearchBar.tsx`, `src/app/page.test.tsx`
- **Approach:** Recompose the homepage hierarchy so the first screen explains utility, shows specialty proof, and keeps search immediately actionable. Specialty chip interaction should feed the existing search/listing state instead of launching a parallel flow. Resolve the current lint issues in `src/app/page.tsx` as part of the rewrite.
- **Execution note:** Protect the specialty-chip-to-search handoff with UI tests before polishing copy and layout details.
- **Patterns to follow:** Preserve the existing client-side fetch + pagination state model unless implementation reveals a direct blocker; keep search and sorting semantics compatible with the current API query shape.
- **Test scenarios:**
  - Covers AE2. Selecting a specialty trust cue updates the page into a relevant search/listing state without forcing a separate flow.
  - Search remains visible and usable above the fold after the homepage hierarchy changes.
  - Manual text search still works after specialty chip interaction and can be cleared back to a neutral state.
  - Existing pagination and sort controls continue working after the homepage restructure.
  - `src/app/page.tsx` no longer trips the current unescaped-quote or hook-dependency lint failures.
- **Verification:** A first-time visitor can move from homepage trust content into search in one obvious interaction, and the page remains build/lint clean.

### U4. Add verification tooling and end-to-end polish guardrails

- **Goal:** Add the minimum sustainable test and verification path for the homepage trust feature.
- **Requirements:** R1, R5, R6, R7, R8
- **Dependencies:** U1, U2, U3
- **Files:** `package.json`, `package-lock.json`, `vitest.config.ts`, `src/test/setup.ts`, `src/app/api/advocates/route.test.ts`, `src/app/page.test.tsx`, `README.md`
- **Approach:** Introduce a lightweight project test setup that can cover API fallback behavior and homepage interaction flows, then document the verification commands needed for future contributors.
- **Patterns to follow:** Keep tooling minimal and aligned with the existing Next.js TypeScript setup; prefer a small number of meaningful tests over broad shallow coverage.
- **Test scenarios:**
  - API route tests prove fallback data, filtering, and sorting behavior.
  - Homepage tests prove trust content renders and specialty interaction hands off to search correctly.
  - Verification docs point contributors at the same lint, test, and build checks used for the feature.
  - Test expectation: none -- styling-only details should be covered through component assertions and build/lint checks rather than snapshot-heavy visual tests in this pass.
- **Verification:** The repo has a repeatable command path for linting, testing, and production build validation around the new homepage behavior.

---

## Verification Contract

- **Automated checks**
  - `npm test` covers homepage trust rendering, specialty handoff, and no-DB advocate API fallback behavior.
  - `npm run lint` passes for the touched homepage and component files.
  - `npm run build` passes with the new homepage structure and data path.

- **Manual checks**
  - Open the homepage in a no-DB local run and confirm the first screen shows specialty chips, featured advocates, and immediate search access.
  - Select a specialty cue and confirm the listing state updates into a relevant matching flow without leaving the page.

---

## Definition of Done

- The plan leaves the existing Product Contract intact and implements it through deterministic specialty trust content.
- A no-database local run still demonstrates the core app utility instead of an empty directory.
- Homepage first impression proves specialty-aware matching before the first search.
- Search remains the primary action path and still works with sorting and pagination.
- Lint, tests, and production build all pass for the implemented feature.
