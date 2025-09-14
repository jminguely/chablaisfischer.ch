# Frontend (Nuxt 3)

Consumes headless WordPress content through WPGraphQL.

## Environment

Copy `.env.example` to `.env` and adjust:

```
WP_GRAPHQL_ENDPOINT=http://localhost:8888/graphql
```

## Scripts

- `npm run dev -w frontend`
- `npm run build -w frontend`
- `npm run generate -w frontend`

## Notes

Navigation and pages are fetched at runtime from WPGraphQL.
