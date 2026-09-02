# Project architecture

The refactor preserves the rendered design, responsive breakpoints, animations,
translations, localized URLs, SEO output, form validation and API contracts.
The application remains JavaScript/JSX on Next.js, React and Tailwind, using npm.

## Module boundaries

- `app/`: Next.js route entry points, layouts and global CSS. Pages assemble feature
  views; API routes delegate to server handlers.
- `features/{home,about,services,careers,contact,quote}/`: page views, sections and
  feature-specific controls. Components used by only one feature live here.
- `components/layout/`: shared page shell, header, footer and navigation.
- `components/ui/`: reusable controls such as the date picker and validation message.
- `components/motion/`: shared animation wrappers and scroll controls.
- `lib/i18n/`: translation resources and locale initialization.
- `lib/routing/`: locale definitions, paths, redirects and rewrites.
- `lib/seo/`: site identity, metadata and structured-data helpers.
- `lib/validation/`: pure rules shared by browser forms and server handlers.
- `lib/server/`: email transport, rate limiting and request parsing.
- `locales/` and `public/`: translation content and public assets.

Server handlers stay outside the client dependency graph. Server-only email code
retains its `server-only` guard. Server validation stays authoritative and retains
the existing stricter checks (including quote dates and PDF contents).

The page shell remains composed within each page, preserving navigation remount
and animation behavior. It renders the same elements and classes and supports the
careers page's mobile bottom-bar offset. Feature markup and style values are retained.

## Verification

Use Node.js 24 for development and verification (the API tests use Node's built-in
module hooks). Run `npm test`, `npm run lint` and `npm run build`. Tests cover localized routing,
metadata, form validation, request handling and rate limiting without sending mail.
Compare desktop/mobile rendering and exercise navigation, date selection and form
validation in a local browser. Use mocked email transport for successful API tests.

No dependency upgrade, TypeScript migration or deployment is part of this refactor.
