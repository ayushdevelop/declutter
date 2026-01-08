# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting Development Environment
```bash
npm run dev              # Runs all services (Convex init, backend, and frontend in parallel)
npm run dev:frontend     # Only Next.js dev server (port 3000)
npm run dev:backend      # Only Convex backend
npm run dev:init         # Initialize Convex and wait for success
```

### Build & Quality
```bash
npm run build           # Build Next.js application
npm run lint            # Run ESLint
```

## Architecture Overview

### Stack
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Backend**: Convex (serverless functions with auto-generated types)
- **Auth**: Clerk (JWT-based authentication)
- **UI**: Tailwind CSS v4 + Base UI + shadcn pattern
- **Styling Utilities**: Class Variance Authority (CVA) + clsx + tailwind-merge

### Authentication Flow

**Three-part integration:**

1. **Frontend Auth (Clerk)**: `proxy.ts` middleware protects all routes except `/` using `@clerk/nextjs/server`

2. **Backend Auth (Convex)**: `convex/auth.config.ts` validates Clerk JWT tokens using `CLERK_JWT_ISSUER_DOMAIN` environment variable

3. **User Sync (Webhooks)**: `convex/http.ts` receives Clerk webhooks at `/clerk-users-webhook`:
   - `user.created` / `user.updated` → calls `internal.users.upsertFromClerk`
   - `user.deleted` → calls `internal.users.deleteFromClerk`
   - Validates webhook signatures using Svix library with `CLERK_WEBHOOK_SECRET`

### Provider Hierarchy

Located in `components/providers.tsx`:
```
ClerkProvider (root)
└── ConvexProviderWithClerk
    ├── Convex client (NEXT_PUBLIC_CONVEX_URL)
    └── Auth integration (auto-passes JWT tokens)
```

The `ConvexProviderWithClerk` wrapper automatically synchronizes authentication state between Clerk and Convex.

### Data Model

**Schema** (`convex/schema.ts`):
- `users` table:
  - `name`: string (first + last name from Clerk)
  - `externalId`: string (Clerk user ID from JWT subject)
  - Index: `byExternalId` for fast lookups
- `messages` table:
  - `body`: string
  - `user`: string (Clerk user ID)

**Key Helpers** (`convex/users.ts`):
- `getCurrentUser(ctx)`: Returns current user or null
- `getCurrentUserOrThrow(ctx)`: Returns current user or throws error
- `userByExternalId(ctx, externalId)`: Lookup user by Clerk ID using index

### Convex API Pattern

All Convex functions auto-generate TypeScript types in `convex/_generated/`:
- Public APIs:
  - `api.users.current` - Get current authenticated user
  - `api.messages.send` - Send message (requires auth, auto-associates with current user)
- Internal APIs:
  - `internal.users.upsertFromClerk` - Sync user from Clerk webhook
  - `internal.users.deleteFromClerk` - Delete user from Clerk webhook
- HTTP routes: `/clerk-users-webhook` endpoint

**Important**: Convex HTTP routes are hosted on the Convex deployment URL (e.g., `https://[your-deployment].convex.site/clerk-users-webhook`), not as Next.js `/api` routes. Configure the webhook URL in Clerk dashboard using your Convex deployment URL.

Use `useQuery` and `useMutation` from `convex/react` in components. Authentication tokens are automatically included via the provider setup.

**Development tip**: View schema changes, function logs, and database contents in the Convex Dashboard at your deployment URL.

### Component Organization

**Naming**: UI primitives use `base-` prefix (e.g., `base-button.tsx`, `base-dialog.tsx`)

**Pattern**: Components wrap Base UI headless components with:
- CVA for variant management
- Tailwind classes for styling
- TypeScript for prop types

**Example variants** (`components/ui/base-button.tsx`):
- `variant`: primary, secondary, outline, destructive, ghost, dashed, mono, dim, foreground, inverse
- `mode`: default, icon, link, input
- `size`: xs, sm, md, lg, icon
- `radius`: md, full

### Path Aliases

Configured in `tsconfig.json` and `components.json`:
- `@/*` → root directory
- `@/components` → components directory
- `@/lib` → lib directory
- `@/hooks` → hooks directory
- `@/components/ui` → ui components

### Environment Variables

Required variables (see `.env.example`):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key (client-side)
- `CLERK_SECRET_KEY` - Clerk secret key (server-side only)
- `CLERK_WEBHOOK_SECRET` - For validating Clerk webhooks
- `CONVEX_DEPLOYMENT` - Convex deployment identifier
- `NEXT_PUBLIC_CONVEX_URL` - Convex API URL (client-side)
- `CLERK_JWT_ISSUER_DOMAIN` - JWT issuer for Convex auth config

**Note**: `CLERK_JWT_ISSUER_DOMAIN` must be configured in both local `.env` and Convex Dashboard for the "convex" JWT template.

### Directory Structure Conventions

- `app/` - Next.js App Router pages and layouts
  - `app/page.tsx` - Landing page (public)
  - `app/onboard/` - Onboarding flow (protected, currently placeholder)
- `components/` - Reusable React components
  - `components/ui/` - Base UI component wrappers
  - `components/providers.tsx` - Provider setup
- `convex/` - Backend serverless functions
  - `convex/schema.ts` - Database schema
  - `convex/auth.config.ts` - Auth configuration
  - `convex/users.ts` - User queries and mutations
  - `convex/messages.ts` - Message mutations
  - `convex/http.ts` - HTTP endpoints and webhook handlers
  - `convex/_generated/` - Auto-generated types (do not edit)
- `lib/` - Utility functions
  - `lib/utils.ts` - `cn()` helper for className merging

**Note**: This is an early-stage project with foundational authentication and data structures in place. The onboarding page and main application features are ready for development.

### Important Patterns

1. **Client Components**: Use `"use client"` directive for components that need interactivity, hooks, or client-side context (providers, pages with state)

2. **Server Components**: Keep layouts and static pages as server components by default

3. **Convex Mutations**: Always use `internalMutation` for webhook handlers to prevent direct client access

4. **Error Handling**:
   - Use `getCurrentUserOrThrow()` when user must be authenticated
   - Use `getCurrentUser()` when null is acceptable
   - Webhook validation returns 400 on signature failure, 200 on success

5. **shadcn/ui Integration**: Uses custom registry at `https://reui.io/r/{name}.json` configured in `components.json`

### Middleware Configuration

`proxy.ts` uses Clerk middleware with custom matcher:
- Protects all routes except `/` (landing page)
- Skips Next.js internals and static files
- Always runs for `/api` and `/trpc` routes

### Styling System

- **CSS Variables**: Defined in `app/globals.css` for theming
- **Tailwind v4**: PostCSS-based configuration
- **Base Color**: Neutral (configured in `components.json`)
- **Utility**: `cn()` function merges Tailwind classes using `clsx` + `tailwind-merge`
