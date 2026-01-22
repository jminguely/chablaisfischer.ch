# Chablais Fischer - Copilot Documentation

## Overview
**Chablais Fischer Architectes** is a modern headless CMS architecture built as a monorepo featuring WordPress (Bedrock) as the backend CMS and Nuxt 3 as the frontend consuming content via WPGraphQL.

**Website**: [chablaisfischer.ch](https://chablaisfischer.ch)  
**Stack**: WordPress 6.9 + Bedrock, Nuxt 4, PHP 8.1+, Node.js 18+  
**Deployment**: Automated GitHub Actions on `main` branch (separate workflows for frontend and backend)

---

## Architecture Philosophy

### Headless-First Design
- **Complete separation**: WordPress serves ONLY as a data API, no frontend rendering
- **GraphQL-powered**: All data consumed by Nuxt via WPGraphQL
- **Dual URLs configuration**: 
  - `WP_HOME`: Frontend URL (Nuxt)
  - `WP_HOME_ADMIN`: Backend admin URL (WordPress)
- **Static/SSR capable**: Nuxt can generate static site or run SSR

### Monorepo Structure
The project uses npm workspaces to manage both frontend and backend dependencies from a single root:

```
/
├── package.json              # Root workspace with unified scripts
├── .github/workflows/        # Separate CI/CD for frontend & WordPress
│   ├── deploy-frontend.yml
│   └── deploy-wordpress.yml
├── frontend/                 # Nuxt 3 application
│   ├── package.json
│   ├── nuxt.config.ts
│   ├── components/           # Vue components
│   ├── composables/          # Nuxt composables
│   ├── graphql/              # GraphQL queries (.gql files)
│   ├── layouts/              # Layout components
│   ├── pages/                # File-based routing
│   ├── types/                # TypeScript types
│   └── assets/               # Static assets, CSS
└── wordpress/                # WordPress Bedrock CMS
    ├── composer.json
    ├── config/               # Bedrock configuration
    ├── web/                  # Document root
    │   ├── app/              # WordPress content
    │   │   ├── mu-plugins/   # Must-use plugins
    │   │   │   └── wp-headless/  # Custom headless functionality
    │   │   ├── plugins/      # Installed plugins (ACF Pro, WP GraphQL)
    │   │   └── themes/       # Minimal headless theme
    │   └── wp/               # WordPress core (managed by Composer)
    └── vendor/               # PHP dependencies
```

---

## Core Components

### 1. WordPress Backend (`wordpress/`)

#### Bedrock Framework
Uses [Roots Bedrock](https://roots.io/bedrock/) for modern WordPress development:
- **Composer dependency management** for plugins and WordPress core
- **Environment-based configuration** via `.env` files
- **Improved security**: `DISALLOW_FILE_EDIT` and `DISALLOW_FILE_MODS` enabled
- **Enhanced folder structure**: `web/` as document root, WordPress in `web/wp/`

#### Custom Must-Use Plugin: `wp-headless`
Location: `wordpress/web/app/mu-plugins/wp-headless/`

**Purpose**: All custom headless functionality in a modular plugin

**Structure**:
```
wp-headless/
├── wp-headless.php           # Main plugin file (loads all modules)
├── inc/                      # Modular functionality
│   ├── acf.php               # ACF JSON sync, GraphQL config
│   ├── admin-menu.php        # Admin menu customization
│   ├── custom-post-type.php  # Project CPT registration
│   ├── disable-gutenberg.php # Disable block editor where needed
│   ├── disallow-indexing.php # SEO indexing control
│   ├── navigation.php        # Custom nav menus
│   ├── page-templates.php    # Page template configuration
│   ├── rest-url.php          # REST API customization
│   └── template-redirect.php # Template redirection for headless
└── acf-json/                 # ACF field groups (JSON sync)
    ├── group_*.json          # Field group definitions
```

**Key Features**:

##### Custom Post Type: Project (`custom-post-type.php`)
- **GraphQL enabled**: `graphql_single_name: 'Project'`, `graphql_plural_name: 'Projects'`
- **Slug**: `/projets/`
- **Supports**: title, editor, thumbnail
- **Custom admin columns**: thumbnail, année, lieu (pulled from ACF fields)
- **Custom image size**: `small` (300x300, no crop)

##### ACF Configuration (`acf.php`)
- **JSON sync path**: Saves field groups to `wp-headless/acf-json/`
- **GraphQL connection limit**: Increased to 100 items (default is lower)
- **Version controlled**: All ACF configurations tracked in git

##### Navigation (`navigation.php`)
- **Primary navigation**: `PrimaryNav`
- **Footer navigation**: `FooterNav`

##### Headless Optimizations
- Disables unnecessary WordPress features for headless operation
- Template redirects for non-GraphQL requests
- Admin UI customizations for content editors

#### Minimal Theme: `headless`
Location: `wordpress/web/app/themes/headless/`

**Purpose**: Bare-minimum theme required by WordPress (all logic in mu-plugin)

**Files**:
- `style.css`: Theme header only
- `index.php`: Empty (headless, no PHP templates)

#### Key Plugins
Managed via Composer (`wordpress/composer.json`):

- **ACF Pro** (`wpengine/advanced-custom-fields-pro`): ^6.6
  - All content fields for projects and pages
  - Fields synced as JSON in `wp-headless/acf-json/`
  
- **WP GraphQL** (`wp-graphql/wp-graphql`): ^2.5
  - GraphQL API endpoint at `/graphql`
  - Exposes WordPress data to Nuxt
  
- **WPGraphQL for ACF** (`wpackagist-plugin/wpgraphql-acf`): ^2.4
  - Automatically exposes ACF fields in GraphQL schema

#### Configuration
Key files:
- `wordpress/.env`: Environment variables (DB, URLs, keys)
- `wordpress/config/application.php`: Main Bedrock configuration
- `wordpress/pint.json`: Laravel Pint (PHP linter) configuration

**Security settings**:
```php
DISALLOW_FILE_EDIT = true   // Disable file editor
DISALLOW_FILE_MODS = true   // Disable plugin/theme installation
AUTOMATIC_UPDATER_DISABLED = true
WP_DEBUG_LOG = false        // No debug logging in production
```

---

### 2. Nuxt Frontend (`frontend/`)

#### Framework & Philosophy
- **Nuxt 4.2.0**: Latest version with TypeScript support
- **File-based routing**: Pages automatically generate routes
- **Composable architecture**: Reusable logic via composables
- **TailwindCSS**: Custom design system with brand colors
- **SSG/SSR capable**: Can generate static or server-render

#### Key Configuration (`nuxt.config.ts`)

**Runtime Config**:
```typescript
runtimeConfig: {
  public: {
    wpGraphqlEndpoint: process.env.WP_GRAPHQL_ENDPOINT || 'http://localhost:8888/graphql'
  }
}
```

**Custom Route Mapping**:
- `/` → `pages/accueil.vue` (homepage with image slider)
- `/index` → `pages/index.vue` (project list table)
- Custom route manipulation via `hooks.pages:extend`

**Page Transitions**:
- Smooth `out-in` transitions between pages and layouts
- Fade animations with CSS keyframes

#### Design System (`tailwind.config.js`)

**Custom Colors**:
```javascript
colors: {
  white: '#ffffff',
  black: '#181818',
  anthracite: '#2F2F2F',
  grey: '#C4C4C4',
  yellow: '#FFF600'      // Brand accent color
}
```

**Typography**:
- **Font**: Dada Grotesk (custom)
- **Sizes**: sm (12px), md (16px), lg (22px)
- **Weights**: normal (400), medium (500)

#### Composables

##### `useWpGraphql.ts`
**Purpose**: GraphQL client for WordPress API

**Usage**:
```typescript
const { query } = useWpGraphql();
const data = await query<ResponseType>(QUERY_STRING, variables);
```

**Features**:
- Uses `cross-fetch` for SSR compatibility
- Error handling with GraphQL errors
- Type-safe responses with TypeScript generics

#### GraphQL Queries (`frontend/graphql/`)

All queries stored as `.gql` files and imported as raw strings:

- `getPageAccueil.gql`: Homepage data (slider projects, post-it)
- `getPageAtelier.gql`: About page (team, gallery, jobs)
- `getPageProjets.gql`: Projects page (featured projects grid)
- `getProject.gql`: Single project detail
- `getProjects.gql`: All projects for index table

**Example** (`getProjects.gql`):
```graphql
{
  projects(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
    edges {
      node {
        id
        title
        slug
        uri
        featuredImage { ... }
        fieldsProjectSidebar {
          annee
          lieu
          programme
          type
          statut
        }
        fieldsGallery { ... }
      }
    }
  }
}
```

#### Pages

##### `pages/accueil.vue` (Homepage)
**Route**: `/`

**Features**:
- Image slider with autoplay (5s interval)
- Projects fetched from ACF field on page
- Animated Post-It note overlay
- Fade-in animations with delays

**GraphQL Query**: Fetches page with slug `/`, includes related projects

##### `pages/index.vue` (Projects Table)
**Route**: `/index`

**Features**:
- **Desktop**: Sortable table with 6 columns (Projet, Année, Lieu, Programme, Type, Statut)
- **Mobile**: Stacked cards with select-based sorting
- **Image preview on hover** (desktop only)
- **Animated sorting**: Fade-out → update → fade-in with staggered rows
- **Clickable rows**: Navigate to projects with galleries only

**Sorting Logic**:
```typescript
// Desktop: Click headers to toggle sort
// Mobile: Dropdown + up/down arrows
sortKey: string | null    // Field to sort by
sortDir: 1 | -1           // 1 = ascending, -1 = descending
```

**Animation**: Each row animates with CSS variables for delays:
```css
--text-delay: ${index * 100}ms
--border-delay: ${index * 100}ms
```

##### `pages/projets/index.vue` (Projects Grid)
**Route**: `/projets`

**Features**:
- **Masonry-style grid**: 20-column grid system on desktop
- **Randomized layout**: Deterministic seeded random positioning
- **Responsive images**: Each project shows featured image
- **Variable sizes**: Projects span 4-13 columns (big/small pairs)
- **Vertical spacing**: Random margins (4-16rem) above/below

**Layout Algorithm**:
```typescript
// Projects laid out in pairs (left + right)
// Each pair: one big (9-13 cols), one small (4-6 cols)
// Gaps distributed randomly but deterministically
// Vertical margins randomized per item
```

##### `pages/projets/[slug].vue` (Project Detail)
**Route**: `/projets/:slug`

**Features**:
- Dynamic route based on project slug
- Image gallery display
- Project metadata from ACF fields

##### `pages/atelier.vue` (About/Studio)
**Route**: `/atelier`

**Features**:
- Team member display with modals
- Studio gallery
- Job postings and apprenticeships
- Contact information

#### Components

**UI Components** (`components/`):
- `Icon.vue`: SVG icon system
- `ProjectImage.vue`: Optimized project images
- `ProjectModal.vue`: Project detail modal
- `SortableHeader.vue`: Table header with sort indicators
- `TeamMember.vue`: Team member cards
- `ImageSlider.vue`: Auto-playing image carousel
- `PostIt.vue`: Animated post-it note overlay
- `ProjectRowMobile.vue`: Mobile project row

#### Layouts

##### `layouts/default.vue`
**Features**:
- Fixed navigation on desktop (vertical on sides, horizontal at bottom)
- Mobile hamburger menu
- Logo centered at top
- Main content area with appropriate padding
- Page transition handling

**Navigation Structure**:
- **Desktop**: 
  - `projets` (left, vertical text)
  - `index` (right, vertical text)
  - `atelier` (bottom center, horizontal)
- **Mobile**: Centered overlay menu with close button

#### TypeScript Types (`types/`)

**Key Interfaces**:
```typescript
interface WpProject {
  id: string;
  title: string;
  slug: string;
  uri: string;
  featuredImage?: { ... };
  fieldsProjectSidebar?: { ... };
  fieldsGallery?: { ... };
}

interface WpPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  fieldsAccueil?: { ... };
  fieldsAtelier?: { ... };
  fieldsProjets?: { ... };
}
```

#### Assets

**CSS** (`assets/css/`):
- `main.css`: TailwindCSS imports and base styles
- `typography.css`: Font-face definitions, custom typography

**Images** (`assets/img/`):
- `logo.svg`: Site logo
- Custom fonts

---

## Development Workflow

### Local Setup

1. **Prerequisites**:
   ```bash
   Node.js >=18.18.0
   npm >=9.0.0
   PHP >=8.1
   Composer
   Local web server (MAMP, Valet, Docker)
   MySQL/MariaDB
   ```

2. **Installation**:
   ```bash
   # Clone repository
   git clone git@github.com:jminguely/chablaisfischer.ch.git
   cd chablaisfischer.ch
   
   # Install all dependencies (frontend + WordPress)
   npm run install:all
   
   # Configure WordPress
   cd wordpress
   cp .env.example .env
   vim .env  # Edit database credentials and URLs
   
   # Configure frontend
   cd ../frontend
   cp .env.example .env
   vim .env  # Set WP_GRAPHQL_ENDPOINT
   ```

3. **Environment Variables**:

**WordPress** (`wordpress/.env`):
```env
# Database
DB_NAME='database_name'
DB_USER='database_user'
DB_PASSWORD='database_password'
DB_HOST='localhost'

# WordPress
WP_ENV='development'
WP_HOME='http://frontend.test'         # Nuxt URL
WP_HOME_ADMIN='http://api.test'        # WordPress admin URL
WP_SITEURL="${WP_HOME_ADMIN}/wp"

# Security keys (generate at https://roots.io/salts.html)
AUTH_KEY='...'
SECURE_AUTH_KEY='...'
LOGGED_IN_KEY='...'
NONCE_KEY='...'
AUTH_SALT='...'
SECURE_AUTH_SALT='...'
LOGGED_IN_SALT='...'
NONCE_SALT='...'
```

**Frontend** (`frontend/.env`):
```env
WP_GRAPHQL_ENDPOINT=http://api.test/graphql
```

4. **Start Development**:
   ```bash
   # From root directory
   npm run dev              # Starts Nuxt dev server
   
   # Access WordPress admin
   # http://api.test/wp/wp-admin
   
   # Access Nuxt frontend
   # http://localhost:3000
   ```

### Available Scripts

**Root Level** (`package.json`):
```bash
npm run dev                  # Start Nuxt dev server
npm run build                # Build Nuxt for production
npm run generate             # Generate static site (SSG)
npm run preview              # Preview production build
npm run lint                 # Lint frontend code
npm run typecheck            # TypeScript type checking

npm run wordpress:install    # Install WordPress dependencies
npm run wordpress:lint       # Run PHP Pint linter
npm run wordpress:lint:fix   # Fix PHP linting issues

npm run install:all          # Install all dependencies
npm run clean                # Clean build artifacts and node_modules
```

**Frontend** (`frontend/package.json`):
```bash
npm run dev                  # Nuxt dev server
npm run build                # Production build
npm run generate             # Static generation
npm run preview              # Preview build
```

### ACF Development

**Field Group Management**:
- Create/edit field groups in WordPress admin: Custom Fields
- Fields auto-export to `wordpress/web/app/mu-plugins/wp-headless/acf-json/`
- Changes tracked in git for team collaboration
- On theme activation, fields auto-import from JSON

**Common Field Groups**:
- **Project Sidebar**: annee, lieu, programme, type, statut
- **Project Gallery**: image gallery repeater
- **Page Accueil**: projects (relationship), postIt (group)
- **Page Atelier**: collaborateurs, galerie, offresEmploi
- **Page Projets**: projects (relationship)

**GraphQL Exposure**:
- ACF fields automatically exposed via WPGraphQL for ACF plugin
- Field names in GraphQL: `fields[GroupName]` (camelCase)
- Example: `fieldsProjectSidebar { annee lieu }`

### GraphQL Development

**Testing Queries**:
1. Access GraphiQL IDE: `http://api.test/graphql` (when logged into WordPress)
2. Explore schema with Docs panel
3. Test queries before adding to frontend

**Query Organization**:
- Store queries in `frontend/graphql/*.gql`
- Import as raw strings: `import QUERY from '@/graphql/query.gql?raw'`
- Use TypeScript types for responses

**Common Patterns**:
```graphql
# Pagination
projects(first: 100, after: $cursor)

# Filtering
projects(where: { orderby: { field: DATE, order: DESC } })

# Image sizes
featuredImage {
  node {
    sourceUrl(size: SMALL)  # THUMBNAIL, MEDIUM, LARGE, SMALL
  }
}

# ACF fields
fieldsProjectSidebar {
  annee
  lieu
}
```

### Styling & Design

**TailwindCSS Utilities**:
- Use custom color classes: `bg-yellow`, `text-anthracite`, `border-grey`
- Custom font sizes: `text-sm`, `text-md`, `text-lg`
- Responsive prefixes: `md:`, `lg:`

**Custom Animations**:
```css
/* Fade in with delay */
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

/* Apply delays via style binding */
:style="{ animationDelay: `${index * 100}ms` }"
```

**Layout Patterns**:
- **Fixed navigation elements**: Use `fixed` positioning
- **Vertical text**: `writing-mode: sideways-lr`
- **Full-screen overlays**: `fixed inset-0` with z-index layers

---

## Deployment

### CI/CD Architecture

The project uses **two separate GitHub Actions workflows**:

1. **Frontend Deployment** (`.github/workflows/deploy-frontend.yml`)
2. **WordPress Deployment** (`.github/workflows/deploy-wordpress.yml`)

Both trigger on push to `main` branch, but only when their respective paths change.

### Frontend Deployment

**Trigger**: Changes to `frontend/**` or workflow file

**Process**:
1. Checkout code from `main`
2. Setup Node.js 20
3. Install npm dependencies
4. Build Nuxt: `npm run build` (SSR mode)
5. Setup SSH authentication
6. Rsync `.output/` directory to production server
7. Restart Node.js server via Alwaysdata API

**Environment**:
- **Build**: `WP_GRAPHQL_ENDPOINT` from GitHub variable `GRAPHQL_API_URL`
- **Target**: Alwaysdata Node.js hosting
- **Deploy path**: Configured via `DEPLOY_PATH` variable

**Secrets Required**:
- `DEPLOY_KEY`: SSH private key
- `ALWAYSDATA_API`: API token for server restart

**Variables Required**:
- `GRAPHQL_API_URL`: WordPress GraphQL endpoint URL
- `SSH_HOST`: Production server hostname
- `SSH_HOST_KEY`: Server SSH fingerprint
- `SSH_USER`: SSH username
- `DEPLOY_PATH`: Deployment directory path
- `ALWAYSDATA_SITE_ID`: Site ID for API restart

### WordPress Deployment

**Trigger**: Changes to `wordpress/**` or workflow file

**Process**:
1. Checkout code from `main`
2. Install PHP 8.3
3. Add ACF Pro credentials to `auth.json`
4. Install Composer dependencies (production mode)
5. Setup SSH authentication
6. Rsync files to production server
   - **Excludes**: `.env`, `web/.htaccess`, `uploads/`
7. Create symlinks for shared files:
   - `.env` → `shared/.env`
   - `web/.htaccess` → `shared/.htaccess`
   - `web/app/uploads/` → `shared/uploads/`
8. Clear PHP OPcache

**Shared Files Pattern**:
```
wordpress/
├── current/           # Active deployment (synced code)
│   ├── .env -> ../shared/.env
│   ├── web/.htaccess -> ../../shared/.htaccess
│   └── web/app/uploads/ -> ../../../shared/uploads/
└── shared/            # Persistent files (not overwritten)
    ├── .env
    ├── .htaccess
    └── uploads/
```

**Secrets Required**:
- `DEPLOY_KEY`: SSH private key

**Variables Required**:
- `ACF_AUTH_JSON`: ACF Pro auth credentials (JSON format)
- `SSH_HOST`: Production server hostname
- `SSH_HOST_KEY`: Server SSH fingerprint
- `SSH_USER`: SSH username
- `DEPLOY_PATH`: Deployment directory path

**OPcache Clearing**:
- Creates temporary PHP file to reset OPcache
- Calls it via curl
- Removes temporary file

### Manual Deployment

**Frontend**:
```bash
# Build locally
cd frontend
npm run build

# Deploy manually
rsync -avz .output/ user@server:/path/to/frontend/
```

**WordPress**:
```bash
# Install production dependencies
cd wordpress
composer install --no-dev --optimize-autoloader

# Deploy
rsync -avz --exclude='.env' --exclude='web/.htaccess' ./ user@server:/path/to/wordpress/current/

# Create symlinks on server
ssh user@server
ln -s /path/to/wordpress/shared/.env /path/to/wordpress/current/.env
ln -s /path/to/wordpress/shared/.htaccess /path/to/wordpress/current/web/.htaccess
ln -s /path/to/wordpress/shared/uploads /path/to/wordpress/current/web/app/uploads
```

---

## Content Management

### WordPress Admin Access

**URL**: `http://api.test/wp/wp-admin` (local) or `https://api-cf.mingus.space/wp/wp-admin` (production)

**Content Types**:
- **Projects**: Main content type with ACF fields (sidebar info, gallery)
- **Pages**: Standard WordPress pages with ACF field groups
- **Media**: Images and files for projects

### Creating Content

#### Adding a Project

1. Go to Projects → Add New
2. Enter project title
3. Set featured image (used in listings and previews)
4. Fill in **Project Sidebar** fields:
   - Année (year)
   - Lieu (location)
   - Programme (array/select)
   - Type (type of project)
   - Statut (status)
5. Add images to **Gallery** repeater (if project should be clickable)
6. Publish

**Note**: Projects without gallery images won't be clickable in the index

#### Managing Pages

**Homepage** (`pages/accueil.vue`):
- Edit page with slug `/`
- ACF Fields:
  - **Projects**: Relationship field to select featured projects for slider
  - **Post-it**: Group with title, content, lien (link)

**Projects Page** (`pages/projets/index.vue`):
- Edit page with slug `/projets`
- ACF Fields:
  - **Projects**: Relationship field for featured projects grid

**About Page** (`pages/atelier.vue`):
- Edit page with slug `/atelier`
- ACF Fields:
  - **Collaborateurs**: Team members repeater (nom, role, image, modal content)
  - **Collaborateurs Past**: Former team members
  - **Galerie**: Studio images repeater
  - **Offres Emploi**: Job postings repeater
  - **Places Apprentissage**: Apprenticeship postings

### Media Library

**Image Upload**:
- WordPress automatically generates multiple sizes
- Custom size `small` (300x300) generated for listings
- Images served via WordPress media system

**Best Practices**:
- Use descriptive alt text for accessibility
- Optimize images before upload (WordPress doesn't compress heavily)
- Recommended max width: 2000px

---

## Code Standards

### PHP (WordPress)

**Style**: PSR-12 via Laravel Pint
```bash
# Check style
npm run wordpress:lint

# Auto-fix
npm run wordpress:lint:fix
```

**Patterns**:
- Modular functions over classes
- Use WordPress hooks (`add_action`, `add_filter`)
- Always escape output: `esc_html()`, `esc_url()`, `esc_attr()`
- Sanitize input: `sanitize_text_field()`, `wp_kses()`
- Use WordPress APIs (don't query database directly unless necessary)

**File Organization**:
- One feature per file in `inc/`
- Use descriptive file names
- Comment complex logic

### JavaScript/TypeScript (Frontend)

**Style**: ESLint + Vue plugin
```bash
npm run lint
```

**Patterns**:
- **Composition API**: Use `<script setup>` syntax
- **Type safety**: Define interfaces for WordPress data
- **Composables**: Extract reusable logic
- **Props**: Always define with types
- **Reactive**: Use `ref()` and `computed()`

**Component Structure**:
```vue
<template>
  <!-- Markup -->
</template>

<script setup lang="ts">
// Imports
// Props/emits
// Composables
// Reactive state
// Computed properties
// Methods
// Lifecycle hooks
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### CSS

**TailwindCSS First**:
- Use utility classes when possible
- Custom styles in `<style scoped>` for component-specific needs
- Use theme colors from config

**Naming Conventions**:
- BEM-like for custom classes
- Descriptive animation names: `animate-fade-in`, `animate-slide-up`

---

## Common Tasks

### Adding a New Page

**Backend** (WordPress):
1. Create page in WordPress admin
2. Add ACF field group if needed
3. Ensure page has proper slug
4. Create GraphQL query in `frontend/graphql/`

**Frontend** (Nuxt):
1. Create `pages/[slug].vue`
2. Import GraphQL query
3. Fetch data with `useWpGraphql()`
4. Display content

**Example**:
```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useWpGraphql } from '@/composables/useWpGraphql';
import QUERY from '@/graphql/getPageSlug.gql?raw';

const page = ref(null);
const { query } = useWpGraphql();

watchEffect(async () => {
  const data = await query(QUERY, { slug: '/slug' });
  page.value = data.page;
});
</script>
```

### Adding a New ACF Field Group

1. WordPress admin → Custom Fields → Add New
2. Configure fields and location rules
3. Save (auto-exports to JSON)
4. Commit `wordpress/web/app/mu-plugins/wp-headless/acf-json/*.json`
5. Update GraphQL query to include new fields
6. Update TypeScript types if needed

### Modifying the Custom Post Type

Edit: `wordpress/web/app/mu-plugins/wp-headless/inc/custom-post-type.php`

**Common Changes**:
- Add support for new features: `'supports' => array('title', 'excerpt')`
- Change slug: `'rewrite' => array('slug' => 'new-slug')`
- Modify admin columns: Edit `manage_project_posts_columns` filter

After changes, flush rewrite rules:
1. WordPress admin → Settings → Permalinks
2. Click "Save Changes" (no changes needed, just save)

### Debugging

**WordPress**:
```php
// Enable debug mode in .env
WP_DEBUG=true
WP_DEBUG_LOG=true

// Check logs
tail -f wordpress/web/app/debug.log
```

**Nuxt**:
```bash
# Console logs appear in terminal
npm run dev

# Check browser console for client-side issues
```

**GraphQL**:
- Use GraphiQL IDE in WordPress admin
- Check Network tab for GraphQL request/response
- Verify field names match schema

---

## Troubleshooting

### GraphQL Query Returns Null

**Causes**:
- Field name mismatch (check schema in GraphiQL)
- ACF field group not assigned to correct location
- Missing WPGraphQL for ACF plugin
- Field not set to "Show in GraphQL"

**Fix**:
1. Check GraphiQL IDE to verify field structure
2. Verify ACF field group location rules
3. Ensure WPGraphQL for ACF plugin is active

### Images Not Loading

**Causes**:
- Incorrect `WP_GRAPHQL_ENDPOINT` in frontend `.env`
- CORS issues
- Missing featured image

**Fix**:
1. Verify endpoint in frontend `.env`
2. Check browser console for CORS errors
3. Set featured image on project/page

### Nuxt Build Fails

**Common Issues**:
- TypeScript errors
- Missing dependencies
- GraphQL query syntax errors

**Fix**:
```bash
# Check types
npm run typecheck

# Clear cache
rm -rf .nuxt node_modules/.cache

# Reinstall
npm install
```

### WordPress Plugin Changes Not Reflecting

**Causes**:
- OPcache enabled
- Browser cache
- Must-use plugin not loaded

**Fix**:
```bash
# Clear OPcache (if available)
# Via WordPress: WP CLI
wp cache flush

# Manually
touch wordpress/web/app/mu-plugins/wp-headless/wp-headless.php

# Check if plugin is loaded
# WP admin → Plugins → Must-Use
```

### Deployment Fails

**GitHub Actions**:
1. Check workflow logs in GitHub Actions tab
2. Verify secrets and variables are set
3. Check SSH access manually
4. Ensure server has correct permissions

**Common Issues**:
- Missing secrets in GitHub repo settings
- SSH key permissions (should be 600)
- Path variables incorrect
- Composer auth.json missing for ACF Pro

---

## Performance Considerations

### Frontend

**Optimization Strategies**:
- **Static generation**: Use `npm run generate` for fully static sites
- **Image optimization**: Consider adding `@nuxt/image` module
- **Code splitting**: Nuxt auto-splits by route
- **Lazy loading**: Images lazy-load by default in modern browsers

**Current Performance**:
- Single GraphQL query per page
- No unnecessary watchers
- Scoped CSS prevents bloat
- TailwindCSS purges unused utilities

### Backend

**WordPress Optimization**:
- OPcache enabled in production
- Object caching (consider Redis/Memcached for high traffic)
- GraphQL query caching (WPGraphQL Smart Cache plugin)
- CDN for media files

**Database**:
- Limit post revisions: `WP_POST_REVISIONS` in config
- Clean up transients periodically
- Optimize tables occasionally

---

## Security

### WordPress

**Measures in Place**:
- File editing disabled: `DISALLOW_FILE_EDIT`
- File modifications disabled: `DISALLOW_FILE_MODS`
- Automatic updates disabled (manual control)
- Error display disabled in production
- Latest security patches via Composer updates

**Recommendations**:
- Regular Composer updates: `composer update`
- Strong passwords for admin accounts
- Limit login attempts (plugin)
- Two-factor authentication (plugin)
- Regular database backups

### Frontend

**Measures**:
- No authentication handled in frontend
- Environment variables for sensitive config
- CORS configured properly
- HTTPS in production

### Deployment

**Secrets Management**:
- GitHub Secrets for sensitive data
- Never commit `.env` files
- SSH keys with restricted permissions
- API tokens rotated periodically

---

## Key Files Reference

### Configuration
- `package.json` - Root workspace and scripts
- `wordpress/.env` - WordPress environment config
- `wordpress/composer.json` - PHP dependencies
- `wordpress/config/application.php` - Bedrock main config
- `frontend/.env` - Frontend environment config
- `frontend/nuxt.config.ts` - Nuxt configuration
- `frontend/tailwind.config.js` - Design system

### WordPress Custom Code
- `wordpress/web/app/mu-plugins/wp-headless/wp-headless.php` - Plugin entry
- `wordpress/web/app/mu-plugins/wp-headless/inc/*.php` - Modular features
- `wordpress/web/app/mu-plugins/wp-headless/acf-json/*.json` - ACF fields

### Frontend Core
- `frontend/composables/useWpGraphql.ts` - GraphQL client
- `frontend/graphql/*.gql` - GraphQL queries
- `frontend/layouts/default.vue` - Main layout
- `frontend/pages/*.vue` - Route pages
- `frontend/types/wp.ts` - TypeScript types

### Deployment
- `.github/workflows/deploy-frontend.yml` - Frontend CI/CD
- `.github/workflows/deploy-wordpress.yml` - WordPress CI/CD

---

## External Dependencies

### Services
- **Alwaysdata**: Production hosting (Node.js + PHP)
- **GitHub Actions**: CI/CD automation
- **ACF Pro**: Requires active license (managed via Composer)

### Documentation
- [Nuxt 3 Docs](https://nuxt.com/docs)
- [WP GraphQL Docs](https://www.wpgraphql.com/docs)
- [Bedrock Docs](https://roots.io/bedrock/docs/)
- [ACF Docs](https://www.advancedcustomfields.com/resources/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## Notes for AI Coding Assistants

### Project Context
- **Architecture**: Headless WordPress + Nuxt (complete separation)
- **Content structure**: Projects are main content type
- **Design**: Minimalist, architect portfolio aesthetic
- **Navigation**: Fixed positioning with creative layout
- **Target**: French-speaking Swiss architecture studio

### When Adding Features

**Do**:
- ✅ Test GraphQL queries in GraphiQL first
- ✅ Add TypeScript types for new data structures
- ✅ Follow existing component patterns
- ✅ Use TailwindCSS utilities
- ✅ Consider mobile responsive design
- ✅ Add ACF fields via WordPress admin (not code)
- ✅ Run linters before committing

**Don't**:
- ❌ Create PHP templates (headless architecture)
- ❌ Add inline styles (use Tailwind or scoped CSS)
- ❌ Modify WordPress core or plugin files
- ❌ Commit `.env` files
- ❌ Skip TypeScript types
- ❌ Break existing page layouts

### Testing Checklist

- [ ] GraphQL query returns expected data
- [ ] TypeScript compiles without errors
- [ ] Responsive design works on mobile
- [ ] Images load correctly
- [ ] Navigation remains functional
- [ ] ACF fields export to JSON
- [ ] PHP linter passes
- [ ] Page transitions work smoothly
- [ ] No console errors in browser

### Common Patterns

**Fetching WordPress Data**:
```typescript
import { ref, watchEffect } from 'vue';
import { useWpGraphql } from '@/composables/useWpGraphql';
import QUERY from '@/graphql/query.gql?raw';

const data = ref(null);
const { query } = useWpGraphql();

watchEffect(async () => {
  const result = await query(QUERY, variables);
  data.value = result;
});
```

**Animated Lists**:
```vue
<div
  v-for="(item, index) in items"
  :key="item.id"
  class="animate-fade-in"
  :style="{ animationDelay: `${index * 100}ms` }"
>
  {{ item.title }}
</div>
```

**Conditional Rendering**:
```vue
<nuxt-link v-if="project.hasGallery" :to="project.uri">
  <!-- Clickable -->
</nuxt-link>
<div v-else>
  <!-- Non-clickable -->
</div>
```
