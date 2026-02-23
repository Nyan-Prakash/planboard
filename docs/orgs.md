# B2B Organizations

This document describes how the school/district organization feature works in Planboard.

## Overview

Planboard supports two user modes:

| Mode | Description |
|------|-------------|
| **B2C** | Individual teacher — no org, full access as today |
| **B2B** | Teacher inside a school org — managed by an admin |

Users without an org membership are unaffected by this feature.

---

## Database Schema

Four additions (migration `005_organizations.sql`):

| Table / Object | Purpose |
|----------------|---------|
| `organizations` | An org record (name, slug, seat_limit, created_by) |
| `organization_members` | Maps users to orgs with a role (`teacher` / `admin`) |
| `organization_invites` | Pending/accepted/revoked invite tokens |
| `profiles.organization_id` + `profiles.org_role` | Denormalised mirror of membership for fast profile reads |
| `organization_seat_stats` view | Aggregates active_members_count + pending_invites_count per org |

### Seat counting

- **active_members_count** — rows in `organization_members` for the org
- **pending_invites_count** — rows in `organization_invites` where `status = 'pending'`
- Seat enforcement: `active + pending < seat_limit` is required to create a new invite.
  At accept time: `active < seat_limit` (pending converts to active).

### One org per user

A `UNIQUE` index on `organization_members(user_id)` enforces membership in at most one org.

---

## Roles

Only two roles exist: `teacher` and `admin`.

- The org creator is automatically set as **admin**.
- Admins can promote teachers to admin or demote admins to teacher.
- Admins cannot demote themselves if they are the sole admin.
- Admins cannot remove themselves if they are the sole admin.

---

## API Routes

All org routes require authentication. Admin-only routes return `403` for non-admins.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/orgs` | Authenticated | Create org; caller becomes admin |
| `GET` | `/api/orgs/me` | Authenticated | Get caller's org + role |
| `GET` | `/api/orgs/[orgId]/members` | Admin | List members with profiles |
| `PATCH` | `/api/orgs/[orgId]/members/[userId]` | Admin | Change member role |
| `DELETE` | `/api/orgs/[orgId]/members/[userId]` | Admin | Remove member |
| `GET` | `/api/orgs/[orgId]/invites` | Admin | List all invites |
| `POST` | `/api/orgs/[orgId]/invites` | Admin | Create invite → returns invite + invite link |
| `PATCH` | `/api/orgs/[orgId]/invites/[inviteId]` | Admin | Revoke invite |
| `GET` | `/api/org-invites/lookup?token=` | Public | Look up a pending invite by token (safe fields only) |
| `POST` | `/api/org-invites/accept` | Authenticated | Accept invite; strict email match enforced |

---

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/org/create` | Authenticated | Form to create a new org |
| `/org/admin` | Org admin only | Dashboard: overview, teachers, invites |
| `/org/join?token=…` | Public (shows login prompt if not authed) | Accept an invite link |
| `/profile` | Authenticated | Now shows org name/role + CTA if not in org |

---

## Invite Flow

1. Admin navigates to `/org/admin` → **Invites** tab.
2. Admin enters an email and clicks **Send invite**.
3. An invite record is created in `organization_invites` with a random 64-hex-char token.
4. The invite link (`/org/join?token=…`) is displayed immediately with a **Copy** button.
5. Admin shares the link out-of-band (email, Slack, etc.).
6. Teacher opens the link:
   - If not logged in → shown a "Log in to accept" screen.
   - If logged in → shown org name + role + **Accept invitation** button.
7. On accept, the server:
   - Verifies token is `pending`.
   - Verifies user's email matches invite email (case-insensitive).
   - Verifies active seat count < seat_limit.
   - Inserts into `organization_members`.
   - Updates `profiles.organization_id` + `profiles.org_role`.
   - Marks invite as `accepted`.
8. Teacher is redirected to `/wizard/step-1`.

### Email mismatch

If the logged-in user's email does not match the invite email, a `403` is returned:

> "This invite was sent to teacher@school.edu. Please sign in with that email address to accept it."

---

## RLS Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `organizations` | Own org members | Authenticated users | Own org admins | — |
| `organization_members` | Own org members | Own org admins (service-role for invite acceptance) | Own org admins | Own org admins |
| `organization_invites` | Own org admins; anyone for `status='pending'` (token lookup) | Own org admins | Own org admins | — |

Service-role key is used server-side only (in Next.js API routes via `getSupabaseAdmin()`). It is never exposed client-side.

---

## Environment Variables

Add to `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://your-domain.com   # Used to build invite links
SUPABASE_SERVICE_ROLE_KEY=...                  # Already needed by admin.ts
```

---

## Running the Migration

Apply the migration file against your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or run directly in the SQL editor:
# Copy contents of supabase/migrations/005_organizations.sql
```

---

## B2C Compatibility

- Users without an org row in `organization_members` are completely unaffected.
- Wizard, marketplace, library, ratings — all work as before.
- Onboarding (grade_level + subject) is still required for B2B teachers.
