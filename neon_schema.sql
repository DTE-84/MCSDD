-- PCSP Assistant Pro — cloud draft storage schema (Neon)
-- Run this once against the linked Neon branch's DATABASE_URL.
-- Safe to re-run — every statement below is idempotent.
--
-- Note on PHI handling: the `data` column stores only an opaque AES-GCM
-- ciphertext produced client-side (see Security.encrypt in app.js). The
-- server/database never receives or stores plaintext plan content — only
-- the signed-in user, using their account password, can decrypt it
-- in-browser.
--
-- Unlike the old Supabase schema, there is no row-level security here:
-- these tables are only ever reached through the "api" Neon Function
-- (see api.ts), which verifies the caller's Neon Auth JWT and scopes every
-- query to that verified user id in code. The Function's Postgres
-- connection is an application role, not a per-request authenticated role,
-- so RLS policies keyed on auth.uid() (Supabase's model) don't apply here —
-- the Function itself is the authorization boundary.

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references neon_auth."user"(id) on delete cascade,
  data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_id_idx on public.drafts (user_id);

-- Completed plans: same shape and encryption model as drafts, but permanent.
-- Drafts are a 30-day, 20-per-user working scratchpad; once a plan is
-- finalized for an Individual it moves here instead, with no expiry, so
-- case managers can pull it back up for as long as that person is an
-- active client.
create table if not exists public.completed_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references neon_auth."user"(id) on delete cascade,
  data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists completed_plans_user_id_idx on public.completed_plans (user_id);
