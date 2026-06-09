# Phase 1: Research Document (016-admin-plans-page)

## Factual Context
1. **Existing Architecture:**
   - The application is a Next.js (App Router) project using Tailwind CSS v4 and Shadcn UI.
   - Authentication and database are managed by Supabase (SSR integrated).
   - The admin panel is located under `src/app/admin/`.
   - The file `src/app/admin/planos/page.tsx` exists but is currently a placeholder generated previously.

2. **Database Schema ("as is"):**
   - The database contains `profiles`, `iptv_subscriptions`, `payments`, `support_tickets`, and `servers`.
   - **Constraint:** There is currently no `plans` table in `supabase/migrations/20260608154610_initial_schema.sql` or `20260609000000_create_servers_table.sql`.
   - Subscriptions (`iptv_subscriptions`) do not have a foreign key linking to a specific "Plan" (e.g., Basic, Premium).

3. **Current Build Issue:**
   - The user reported a build error: `Can't resolve 'tailwindcss-animate'`.
   - `tailwindcss-animate` exists in `devDependencies`. The issue is likely a caching problem with Turbopack or a resolution issue inside `globals.css` with `@plugin "tailwindcss-animate"`. This will be addressed by clearing `.next` cache or removing the plugin import if redundant in v4.

4. **Task Objective:**
   - Create a functional and visually appealing `/admin/planos` page.
   - The page must manage Subscription Plans (pricing, connection limits, duration).
