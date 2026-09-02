# Project Structure Implementation Plan

**Goal:** Implement the approved feature-oriented structure with the same UI and behavior.
**Architecture:** Thin route entries compose feature views and reusable layout components.
Pure routing, SEO and validation logic is separated from server infrastructure.
**Tech stack:** Next.js 16.3.3, React 19, JavaScript/JSX, Tailwind 4, npm.
**Spec:** `docs/architecture.md`

## Global constraints

Preserve markup, styles, animations, six locales, URLs, metadata, form responses,
validation, PDF restrictions, rate limiting and email behavior. Do not add or upgrade
production dependencies. Do not commit, push, deploy or send real email.
Use the current checkout on `codex/project-structure-refactor`.

## Tasks

1. Capture baseline build and desktop/mobile rendering. Add behavioral routing
   tests with literal expected locale paths before consolidating configuration.
2. Relocate shared components into `components/layout`, `components/ui`,
   `components/motion`; relocate page sections into their feature directories.
   Keep JSX/class strings intact, update consumers, and verify lint/build.
3. Move the three forms into `features/{contact,quote,careers}`. Extract pure
   validation into `lib/validation` while retaining client/server error messages
   and stricter server-only checks. Move handlers to feature `server` directories;
   keep `app/api/*/route.js` as entry points. Put transport, parsing, escaping and
   rate limiting in `lib/server`. Add Node test-runner regressions for validation,
   unsafe input, malformed requests, PDF restrictions and rate limits. External
   mail transport must be stubbed; no production email is sent.
4. Consolidate locale routing definitions and redirect/rewrite generation in
   `lib/routing`; separate translation resources from i18next initialization.
   Preserve exported path helper behavior and all configured redirects.
5. Extract metadata and JSON-LD helpers into `lib/seo`, preserving exact semantic
   output for all routes. Extract a shared page shell without adding DOM wrappers
   or changing remount behavior. Split feature views from routing entry points.
6. Run `npm test`, `npm run lint`, `npm run build`; compare rendered output against
   baseline, exercise navigation and forms, and review the complete diff.

## Acceptance

All existing routes and locale switching work. Desktop and mobile design matches
the baseline. API status codes, error bodies and email payloads remain compatible.
Only the approved structure, extracted logic, tests and architecture docs change.
