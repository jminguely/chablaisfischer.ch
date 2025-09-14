# chablaisfischer.ch Monorepo

Monorepo containing:

- `frontend` Nuxt 3 application consuming headless WordPress via WPGraphQL
- `wordpress` (docs) Instructions to run a separate WordPress instance (no Docker)

## Quick Start

Install dependencies:

```
npm install
```

Run dev:

```
npm run dev
```

Ensure your WordPress instance (with WPGraphQL) is running and `WP_GRAPHQL_ENDPOINT` is set in `frontend/.env`.

## Structure

```
frontend     # Nuxt 3 code
wordpress/        # Docs & headless guidance
```

## Environment

Root `.env` is optional; the frontend reads its local `.env` for `WP_GRAPHQL_ENDPOINT`.

## Scripts

- `npm run dev` Start frontend dev server
- `npm run build` Production build
- `npm run generate` Static generation (hybrid SSG)

## Adding Packages

Create `packages/<name>` and reference from frontend as needed. Then run `npm install` to hoist dependencies.

## Notes

- Menus use WPGraphQL Menus plugin location `PRIMARY`.
- Pages fetched by slug; homepage expects a WP page with slug `home`.

## Future Ideas

- Incremental Static Regeneration (Nuxt route rules)
- Image optimization via `@nuxt/image`
