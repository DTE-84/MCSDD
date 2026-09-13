-- PCSP Assistant Pro — cloud draft storage schema
-- Run this in your Supabase project's SQL Editor after creating the project.
-- Safe to re-run — every statement below is idempotent.
--
-- Note on PHI handling: the `data` column stores only an opaque AES-GCM
-- ciphertext produced client-side (see Security.encrypt in app.js). The
-- server/database never receives or stores plaintext plan content — only the
-- signed-in user, using their account password, can decrypt it in-browser.
-- Row-level security below additionally ensures each user can only ever
-- read or write their own rows, even though the encryption already prevents
-- anyone else from making sense of the data.

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists drafts_user_id_idx on public.drafts (user_id);

alter table public.drafts enable row level security;

drop policy if exists "Users can view their own drafts" on public.drafts;
create policy "Users can view their own drafts"
  on public.drafts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own drafts" on public.drafts;
create policy "Users can insert their own drafts"
  on public.drafts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own drafts" on public.drafts;
create policy "Users can update their own drafts"
  on public.drafts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own drafts" on public.drafts;
create policy "Users can delete their own drafts"
  on public.drafts for delete
  using (auth.uid() = user_id);

-- Completed plans: same shape and encryption model as drafts, but permanent.
-- Drafts are a 30-day, 20-per-user working scratchpad; once a plan is
-- finalized for an Individual it moves here instead, with no expiry, so
-- case managers can pull it back up for as long as that person is an
-- active client.
create table if not exists public.completed_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists completed_plans_user_id_idx on public.completed_plans (user_id);

alter table public.completed_plans enable row level security;

drop policy if exists "Users can view their own completed plans" on public.completed_plans;
create policy "Users can view their own completed plans"
  on public.completed_plans for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own completed plans" on public.completed_plans;
create policy "Users can insert their own completed plans"
  on public.completed_plans for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own completed plans" on public.completed_plans;
create policy "Users can update their own completed plans"
  on public.completed_plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own completed plans" on public.completed_plans;
create policy "Users can delete their own completed plans"
  on public.completed_plans for delete
  using (auth.uid() = user_id);
