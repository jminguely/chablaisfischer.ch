# Chablaisfischer.ch

A modern monorepo setup featuring a headless WordPress CMS powered by Bedrock and a Nuxt.js frontend consuming content via WPGraphQL.

## 🏗️ Architecture

This monorepo contains two main components:

- **`wordpress/`** - Headless WordPress CMS built with [Roots Bedrock](https://roots.io/bedrock/)
- **`frontend/`** - Nuxt 3 application consuming WordPress content via WPGraphQL

## 🚀 Quick Start

### Prerequisites

- Node.js >=18.18.0
- npm >=9.0.0
- PHP >=8.1
- Composer
- Local web server (Apache/Nginx) or development environment

### Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:jminguely/chablaisfischer.ch.git
   cd chablaisfischer.ch
   ```

2. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

   This will install both frontend npm packages and WordPress Composer dependencies.

3. **Set up WordPress environment:**

   ```bash
   cd wordpress
   cp .env.example .env
   # Edit .env with your database credentials and settings
   ```

4. **Set up frontend environment:**

   ```bash
   cd frontend
   cp .env.example .env
   # Set WP_GRAPHQL_ENDPOINT to your WordPress GraphQL endpoint
   ```

5. **Start development:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
├── package.json              # Root workspace configuration
├── README.md                 # This file
├── frontend/                 # Nuxt 3 application
│   ├── package.json
│   ├── nuxt.config.ts
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── types/
└── wordpress/                # WordPress Bedrock CMS
    ├── composer.json
    ├── config/
    ├── web/
    │   ├── app/
    │   │   ├── plugins/
    │   │   └── themes/
    │   └── wp/
    └── vendor/
```

## 🛠️ Available Scripts

### Root Level Scripts

| Script                | Description                                     |
| --------------------- | ----------------------------------------------- |
| `npm run dev`         | Start frontend development server               |
| `npm run build`       | Build frontend for production                   |
| `npm run generate`    | Generate static site                            |
| `npm run preview`     | Preview production build                        |
| `npm run lint`        | Lint frontend code                              |
| `npm run typecheck`   | Run TypeScript type checking                    |
| `npm run install:all` | Install all dependencies (frontend + WordPress) |
| `npm run clean`       | Clean all build artifacts and node_modules      |

### WordPress Scripts

| Script                       | Description                             |
| ---------------------------- | --------------------------------------- |
| `npm run wordpress:install`  | Install WordPress Composer dependencies |
| `npm run wordpress:lint`     | Run PHP linting (Pint)                  |
| `npm run wordpress:lint:fix` | Fix PHP linting issues                  |

## 🔧 Configuration

### WordPress (Bedrock)

The WordPress installation uses Bedrock for improved security and development workflow:

- **Environment-based configuration** via `.env` files
- **Composer dependency management** for plugins and themes
- **Enhanced folder structure** with `web/` as document root
- **WPGraphQL plugin** pre-installed for headless functionality

Key files:

- `wordpress/.env` - Environment variables
- `wordpress/config/application.php` - Application configuration
- `wordpress/composer.json` - PHP dependencies

### Frontend (Nuxt 3)

The frontend is a modern Nuxt 3 application with:

- **TypeScript support** for type safety
- **WPGraphQL integration** via custom composables
- **SSG/SSR capabilities** for optimal performance
- **Component-based architecture**

Key files:

- `frontend/.env` - Frontend environment variables
- `frontend/nuxt.config.ts` - Nuxt configuration
- `frontend/composables/useWpGraphql.ts` - WordPress GraphQL integration

## 🌐 Environment Variables

### WordPress (.env)

```env
# Database
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost

# WordPress
WP_ENV=development
WP_HOME=http://localhost:8000
WP_SITEURL=${WP_HOME}/wp

# Security Keys (generate via Bedrock)
AUTH_KEY=your_auth_key
# ... other keys
```

### Frontend (.env)

```env
# WordPress GraphQL endpoint
WP_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

## 📝 Content Management

### WordPress Setup

1. Ensure WPGraphQL plugin is activated
2. Configure menus with location `PRIMARY` for navigation
3. Create a page with slug `home` for the homepage
4. Content will be automatically available via GraphQL

### GraphQL Queries

The frontend uses composables to fetch WordPress content:

- `useWpGraphql.ts` - Main GraphQL client
- `useNavigation.ts` - Navigation menu fetching

## 🚀 Deployment

### Frontend Deployment

The frontend can be deployed as:

- **Static Site Generation (SSG)**: `npm run generate`
- **Server-Side Rendering (SSR)**: `npm run build`

### WordPress Deployment

Deploy the `wordpress/` directory to your web server:

1. Point document root to `wordpress/web/`
2. Configure environment variables
3. Run `composer install --no-dev --optimize-autoloader`

## 🎯 Future Enhancements

- [ ] Incremental Static Regeneration (ISR)
- [ ] Image optimization with `@nuxt/image`
- [ ] WordPress multisite support
- [ ] Docker development environment
- [ ] Automated deployment pipelines
- [ ] Performance monitoring
- [ ] SEO optimization

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
