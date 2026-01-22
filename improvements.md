# Chablais Fischer - Improvements & Recommendations

## Priority System
- 🔴 **Critical**: Security, data integrity, or blocking issues
- 🟠 **High**: Performance, user experience, or major code quality
- 🟡 **Medium**: Nice-to-have improvements, optimization
- 🟢 **Low**: Minor enhancements, code polish

---

## 🔴 Critical Priority

### 1. Missing Error Handling in GraphQL Composable
**File**: `frontend/composables/useWpGraphql.ts`

**Issue**: No error handling for network failures, only GraphQL-level errors

**Problem**:
```typescript
const res = await fetch(endpoint, { ... });
const json = (await res.json()) as GraphQLResponse<T>;
```
If fetch fails (network error, server down), no error handling occurs.

**Fix**:
```typescript
async function query<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors) {
      throw new Error(json.errors.map((e) => e.message).join("\n"));
    }
    if (!json.data) throw new Error("No data returned");
    return json.data;
  } catch (error) {
    console.error('GraphQL query failed:', error);
    throw error;
  }
}
```

**Priority**: 🔴 Critical - Could cause silent failures and poor UX

---

### 2. Environment Variable Not Validated
**Files**: `frontend/nuxt.config.ts`, `frontend/composables/useWpGraphql.ts`

**Issue**: No validation that `WP_GRAPHQL_ENDPOINT` is set and valid

**Problem**: If endpoint is missing or malformed, errors only appear at runtime

**Fix** in `nuxt.config.ts`:
```typescript
const wpGraphqlEndpoint = process.env.WP_GRAPHQL_ENDPOINT || 'http://localhost:8888/graphql';

// Validate URL format
try {
  new URL(wpGraphqlEndpoint);
} catch (e) {
  throw new Error(`Invalid WP_GRAPHQL_ENDPOINT: ${wpGraphqlEndpoint}`);
}

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      wpGraphqlEndpoint
    }
  },
  // ... rest of config
})
```

**Priority**: 🔴 Critical - Deployment issue prevention

---

### 3. No Loading States in Pages
**Files**: `frontend/pages/accueil.vue`, `frontend/pages/projets/index.vue`

**Issue**: Pages don't show loading indicators while fetching data

**Problem**: Users see blank content before data loads, poor UX

**Fix** (example for `accueil.vue`):
```vue
<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <p>Chargement...</p>
    </div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-else-if="page">
      <!-- Existing content -->
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true);
const error = ref<string | null>(null);

watchEffect(async () => {
  try {
    loading.value = true;
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, { slug: "/" });
    page.value = data.page;
    error.value = null;
  } catch (e) {
    console.error(e);
    error.value = "Impossible de charger le contenu";
  } finally {
    loading.value = false;
  }
});
</script>
```

**Priority**: 🔴 Critical - User experience

---

## 🟠 High Priority

### 4. Hardcoded Pagination Limit
**Files**: Multiple GraphQL queries (`frontend/graphql/*.gql`)

**Issue**: All queries use `first: 100` hardcoded

**Problem**: 
- No way to load more than 100 items
- No pagination implemented
- Could hit limits if content grows

**Example** (`getProjects.gql`):
```graphql
{
  projects(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
```

**Fix**: Implement pagination or at least increase limit and add warning:
```graphql
{
  projects(first: 500, where: { orderby: { field: DATE, order: DESC } }) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      # ... fields
    }
  }
}
```

Add check in frontend:
```typescript
if (data.projects?.pageInfo?.hasNextPage) {
  console.warn('More projects available - pagination not implemented');
}
```

**Priority**: 🟠 High - Scalability concern

---

### 5. No TypeScript Types Defined
**File**: `frontend/types/` directory

**Issue**: TypeScript types referenced in copilot but don't exist in codebase

**Problem**: No type safety for WordPress data, could lead to runtime errors

**Fix**: Create `frontend/types/wp.ts`:
```typescript
export interface WpMediaItem {
  node: {
    sourceUrl: string;
    altText?: string;
    mediaDetails?: {
      width: number;
      height: number;
    };
  };
}

export interface WpProject {
  id: string;
  title: string;
  slug: string;
  uri: string;
  content?: string;
  featuredImage?: WpMediaItem;
  fieldsProjectSidebar?: {
    annee?: string;
    lieu?: string;
    programme?: string[];
    type?: string[];
    statut?: string[];
  };
  fieldsGallery?: {
    gallery?: {
      nodes: Array<{
        sourceUrl: string;
        altText?: string;
      }>;
    };
  };
}

export interface WpPage {
  id: string;
  slug: string;
  title: string;
  content?: string;
  fieldsAccueil?: {
    projects?: {
      nodes: WpProject[];
    };
    postIt?: {
      title: string;
      content: string;
      lien?: string;
    };
  };
  fieldsAtelier?: {
    adresse?: string;
    telephone?: string;
    eMail?: string;
    instagram?: string;
    collaborateurs?: TeamMember[];
    collaborateursPast?: TeamMember[];
    galerie?: GalleryItem[];
    offresEmploi?: JobPosting[];
    placesApprentissage?: JobPosting[];
    texteOffresEmploi?: string;
    texteApprentissage?: string;
  };
  fieldsProjets?: {
    projects?: {
      nodes: WpProject[];
    };
  };
}

export interface TeamMember {
  nom: string;
  role: string;
  hasModal?: boolean;
  description?: string;
  cv?: Array<{
    dates: string;
    description: string;
  }>;
  image?: WpMediaItem;
}

export interface GalleryItem {
  image?: WpMediaItem;
}

export interface JobPosting {
  titre: string;
  date: string;
  fichier?: {
    node: {
      mediaItemUrl: string;
      title: string;
    };
  };
}
```

**Priority**: 🟠 High - Type safety and developer experience

---

### 6. Missing Image Optimization
**Files**: `frontend/components/ProjectImage.vue`, various pages

**Issue**: No image optimization implemented (lazy loading, responsive images, format optimization)

**Problem**: Large images slow down page load, poor performance on mobile

**Fix**: Add `@nuxt/image` module:
```bash
npm install --save @nuxt/image --workspace=frontend
```

Update `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  image: {
    domains: ['api-cf.mingus.space'], // Your WordPress domain
  }
})
```

Use in components:
```vue
<nuxt-img
  :src="project.featuredImage.node.sourceUrl"
  :alt="project.featuredImage.node.altText || project.title"
  loading="lazy"
  format="webp"
  quality="80"
  sizes="sm:100vw md:50vw lg:400px"
/>
```

**Priority**: 🟠 High - Performance

---

### 7. watchEffect in Pages Creates Memory Leaks
**Files**: `frontend/pages/accueil.vue`, `frontend/pages/projets/index.vue`, `frontend/pages/atelier.vue`

**Issue**: `watchEffect` runs continuously without cleanup

**Problem**: Can cause multiple API calls and memory leaks

**Fix**: Use `onMounted` instead (like `index.vue` does):
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const page = ref<WpPage | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, { slug: "/" });
    page.value = data.page;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
```

**Priority**: 🟠 High - Performance and resource management

---

### 8. No 404 Page
**File**: `frontend/pages/` missing `404.vue` or `[...slug].vue`

**Issue**: Invalid URLs show blank page or default Nuxt error

**Problem**: Poor user experience, no way to navigate back

**Fix**: Create `frontend/pages/[...slug].vue`:
```vue
<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-lg mb-4">Page non trouvée</h1>
    <p class="mb-8">La page que vous recherchez n'existe pas.</p>
    <nuxt-link to="/" class="underline">Retour à l'accueil</nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports';

useHead({
  title: '404 - Page non trouvée',
});
</script>
```

**Priority**: 🟠 High - User experience

---

### 9. Production OPcache URL Hardcoded
**File**: `.github/workflows/deploy-wordpress.yml:71`

**Issue**: 
```yaml
ssh ... "curl -s https://api-cf.mingus.space/opcache_clear.php"
```

**Problem**: Production URL hardcoded in workflow, not flexible

**Fix**:
```yaml
- name: Clear opcache
  run: |
    ssh ${{ vars.SSH_USER }}@${{ vars.SSH_HOST }} "echo '<?php opcache_reset(); ?>' > ${{ vars.DEPLOY_PATH }}/wordpress/current/web/opcache_clear.php"
    ssh ${{ vars.SSH_USER }}@${{ vars.SSH_HOST }} "curl -s ${{ vars.SITE_URL }}/opcache_clear.php"
    ssh ${{ vars.SSH_USER }}@${{ vars.SSH_HOST }} "rm -rf ${{ vars.DEPLOY_PATH }}/wordpress/current/web/opcache_clear.php"
```

Add `SITE_URL` to GitHub variables.

**Priority**: 🟠 High - Deployment flexibility

---

### 10. No Environment File Example for Frontend
**File**: `frontend/.env.example` exists but not documented

**Issue**: The file exists but should be verified for completeness

**Check**: Ensure it contains:
```env
WP_GRAPHQL_ENDPOINT=http://localhost:8888/graphql
```

**Priority**: 🟠 High - Developer onboarding

---

## 🟡 Medium Priority

### 11. Inconsistent Animation Delays
**Files**: Multiple pages using different delay calculations

**Issue**: 
- `accueil.vue`: `100ms`, `300ms`
- `index.vue`: `${index * 100}ms`
- `projets/index.vue`: `${index * 50}ms`

**Problem**: Inconsistent feel across the site

**Recommendation**: Create animation constants in a config:
```typescript
// frontend/config/animations.ts
export const ANIMATION_DELAYS = {
  BASE: 100,
  STAGGER: 50,
  INITIAL: 300,
} as const;
```

Use across components:
```typescript
import { ANIMATION_DELAYS } from '@/config/animations';

:style="{ animationDelay: `${index * ANIMATION_DELAYS.STAGGER}ms` }"
```

**Priority**: 🟡 Medium - Design consistency

---

### 12. No Meta Tags for SEO
**Files**: All pages

**Issue**: Missing Open Graph, Twitter Card, and other meta tags

**Problem**: Poor social sharing, SEO not optimized

**Fix**: Add to pages:
```vue
<script setup lang="ts">
useHead({
  title: 'Page Title',
  meta: [
    { name: 'description', content: 'Page description' },
    { property: 'og:title', content: 'Page Title' },
    { property: 'og:description', content: 'Page description' },
    { property: 'og:image', content: 'https://...' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
});
</script>
```

Consider adding WordPress SEO plugin (Yoast or Rank Math) with GraphQL support.

**Priority**: 🟡 Medium - SEO

---

### 13. Missing Accessibility Features
**Files**: Navigation, image components, interactive elements

**Issues**:
- Images without alt text fallbacks
- No skip-to-content link
- Some interactive elements missing ARIA labels
- No focus indicators on custom styled elements

**Fixes**:
1. Add skip link in `layouts/default.vue`:
```vue
<a href="#main-content" class="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
<main id="main-content">
```

2. Always provide alt text:
```vue
<img 
  :src="image.src" 
  :alt="image.alt || 'Image du projet ' + project.title"
/>
```

3. Add focus styles in Tailwind config:
```javascript
theme: {
  extend: {
    ringColor: {
      DEFAULT: '#FFF600', // yellow
    },
  },
}
```

**Priority**: 🟡 Medium - Accessibility

---

### 14. No Sitemap Generation
**File**: Missing sitemap configuration

**Issue**: No sitemap.xml for SEO

**Fix**: Add `@nuxtjs/sitemap` module:
```bash
npm install --save @nuxtjs/sitemap --workspace=frontend
```

Configure in `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    hostname: 'https://chablaisfischer.ch',
    routes: async () => {
      const { query } = useWpGraphql();
      const data = await query(GET_PROJECTS);
      return data.projects.edges.map(e => e.node.uri);
    },
  },
})
```

**Priority**: 🟡 Medium - SEO

---

### 15. Custom Image Size Not in GraphQL
**File**: `wordpress/web/app/mu-plugins/wp-headless/inc/custom-post-type.php:10`

**Issue**: Custom size `small` registered but queries use `SMALL` (uppercase)

**Problem**: Might not match, should verify

**Check**: Test query in GraphiQL:
```graphql
{
  mediaItem {
    sourceUrl(size: SMALL)
  }
}
```

**Fix if needed**: Register size with uppercase or adjust queries

**Priority**: 🟡 Medium - Image optimization

---

### 16. No Cache Headers Configuration
**Files**: WordPress and Nuxt configuration

**Issue**: No cache headers configured for static assets

**Problem**: Unnecessary bandwidth usage, slower repeat visits

**Fix**: 

**WordPress** (`.htaccess`):
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

**Nuxt** (add headers in `nuxt.config.ts`):
```typescript
nitro: {
  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/assets/**': { headers: { 'cache-control': 'max-age=31536000' } },
  },
}
```

**Priority**: 🟡 Medium - Performance

---

### 17. No TypeScript Strict Mode
**File**: `frontend/tsconfig.json`

**Issue**: TypeScript may not be in strict mode

**Check current config**: Ensure these are set:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Priority**: 🟡 Medium - Code quality

---

### 18. Seeded Random Could Be Extracted
**File**: `frontend/pages/projets/index.vue:58-61`

**Issue**: Seeded random function duplicated if needed elsewhere

**Recommendation**: Extract to utility:
```typescript
// frontend/utils/random.ts
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
```

Use:
```typescript
import { seededRandom } from '@/utils/random';
```

**Priority**: 🟡 Medium - Code reusability

---

## 🟢 Low Priority

### 19. Add .nvmrc File
**File**: Root directory (missing)

**Issue**: No Node.js version specified

**Problem**: Team members might use different Node versions

**Fix**: Add `.nvmrc`:
```
18.18.0
```

Or use `.node-version` for better tool compatibility.

**Priority**: 🟢 Low - Developer experience

---

### 20. Missing Favicon Assets
**File**: `frontend/public/` should contain multiple favicon sizes

**Issue**: Only PNG mentioned, should have multiple formats and sizes

**Recommendation**: Add comprehensive favicon set:
```
public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-192x192.png
├── favicon-512x512.png
├── apple-touch-icon.png
└── site.webmanifest
```

Update in `layouts/default.vue`:
```typescript
useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
});
```

**Priority**: 🟢 Low - Branding

---

### 21. Add Prettier Configuration
**Files**: Root and frontend directories

**Issue**: No code formatter configuration

**Recommendation**: Add `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

Add script:
```json
"format": "prettier --write \"**/*.{js,ts,vue,json,md}\""
```

**Priority**: 🟢 Low - Code consistency

---

### 22. Add Component Documentation
**Files**: `frontend/components/*.vue`

**Issue**: No JSDoc comments on components

**Recommendation**: Add prop documentation:
```vue
<script setup lang="ts">
/**
 * SortableHeader - A table header that can be clicked to sort
 * @prop {string} name - Field name to sort by
 * @prop {string|null} sortKey - Currently active sort field
 * @prop {number} sortDir - Sort direction (1 = asc, -1 = desc)
 * @emits toggle - Emitted when header is clicked
 */
interface Props {
  name: string;
  sortKey: string | null;
  sortDir: number;
}

const props = defineProps<Props>();
</script>
```

**Priority**: 🟢 Low - Documentation

---

### 23. Add Git Hooks with Husky
**File**: Root directory (missing)

**Recommendation**: Add pre-commit hooks:
```bash
npm install --save-dev husky lint-staged
npx husky init
```

Configure `.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linters
npm run lint --workspace=frontend
npm run typecheck --workspace=frontend
npm run wordpress:lint
```

Configure `package.json`:
```json
"lint-staged": {
  "frontend/**/*.{js,ts,vue}": ["npm run lint --workspace=frontend"],
  "wordpress/**/*.php": ["npm run wordpress:lint"]
}
```

**Priority**: 🟢 Low - Development workflow

---

### 24. Add Storybook for Components
**File**: Missing component documentation/testing tool

**Recommendation**: Add Storybook for component development:
```bash
npx nuxi@latest module add storybook
```

Create stories for main components like `PostIt`, `ImageSlider`, `TeamMember`.

**Priority**: 🟢 Low - Component development

---

### 25. Database Revisions Limit Not Set
**File**: `wordpress/config/application.php:133`

**Issue**: `WP_POST_REVISIONS` set to `true` (unlimited)

**Recommendation**: Limit revisions:
```php
Config::define('WP_POST_REVISIONS', env('WP_POST_REVISIONS') ?? 10);
```

**Priority**: 🟢 Low - Database optimization

---

### 26. Add Performance Monitoring
**Files**: Frontend and backend

**Recommendation**: Add monitoring tools:

**Frontend**: Add Vercel Analytics or similar
```bash
npm install --save @vercel/analytics --workspace=frontend
```

**WordPress**: Add Query Monitor plugin for development

**Priority**: 🟢 Low - Performance monitoring

---

### 27. Console Logs in Production
**Files**: Various pages and components

**Issue**: `console.error()` and `console.log()` in production code

**Recommendation**: Remove or use proper logging:
```typescript
const logger = {
  error: process.env.NODE_ENV === 'production' ? () => {} : console.error,
  log: process.env.NODE_ENV === 'production' ? () => {} : console.log,
};

// Use throughout
logger.error('Error:', e);
```

Or use a logging service like Sentry.

**Priority**: 🟢 Low - Production hygiene

---

## Summary Statistics

- **🔴 Critical**: 3 issues
- **🟠 High**: 7 issues  
- **🟡 Medium**: 8 issues
- **🟢 Low**: 9 issues

**Total**: 27 improvements identified

---

## Recommended Action Plan

### Phase 1: Critical (Week 1)
1. Add error handling to GraphQL composable
2. Validate environment variables
3. Add loading states to all pages

### Phase 2: High Priority (Week 2-3)
4. Implement TypeScript types
5. Fix watchEffect memory leaks
6. Add 404 page
7. Add image optimization with @nuxt/image
8. Fix hardcoded deployment URL
9. Implement pagination or increase limits
10. Verify .env.example files

### Phase 3: Medium Priority (Month 2)
11. Standardize animation delays
12. Add comprehensive SEO meta tags
13. Improve accessibility (ARIA labels, focus states)
14. Add sitemap generation
15. Configure cache headers
16. Enable TypeScript strict mode
17. Verify custom image sizes in GraphQL
18. Extract utilities

### Phase 4: Low Priority (Ongoing)
19. Add .nvmrc
20. Comprehensive favicon set
21. Add Prettier
22. Document components
23. Add git hooks
24. Set database revisions limit
25. Remove production console logs
26. Consider Storybook
27. Add performance monitoring

---

## Notes

**Breaking Changes**: None of these improvements require breaking changes. All can be implemented incrementally.

**Testing**: After implementing critical and high-priority items, thoroughly test:
- All pages load correctly
- GraphQL queries work
- Animations are smooth
- Responsive design intact
- No TypeScript errors

**Performance Impact**: Image optimization (#6) and cache headers (#16) will have the most significant positive impact on performance.

**SEO Impact**: Items #12 (meta tags) and #14 (sitemap) are essential for production SEO.
