-- ════════════════════════════════════════════════════════════
-- Creator Profile — single shared business-identity record
-- Paste this whole block into Supabase → SQL Editor → Run.
-- Safe to run once. It creates the table, locks it down with Row
-- Level Security, and seeds the single row the app reads/writes.
-- ════════════════════════════════════════════════════════════

-- 1. The table. One row only (id is fixed to 1) — this is the
--    studio's single business identity, shared by both of you.
create table if not exists public.profile (
  id            integer primary key default 1,
  -- Brand
  logo_url      text default '',
  -- Identity
  name          text default '',
  company       text default '',
  phone         text default '',
  -- Address
  street        text default '',
  plz           text default '',
  city          text default '',
  country       text default 'Deutschland',
  -- Online
  email         text default '',
  website       text default '',
  -- Banking
  bank_name     text default '',
  iban          text default '',
  bic           text default '',
  paypal_email  text default '',
  -- Tax
  kleinunternehmer boolean default true,
  steuernummer  text default '',
  ust_id_nr     text default '',
  vat_rate      text default '19',
  tax_note      text default 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
  -- Bookkeeping
  updated_at    timestamptz default now(),
  -- Enforce the single-row rule.
  constraint single_row check (id = 1)
);

-- 2. Turn on Row Level Security. With RLS on and the policy below,
--    the data is only ever returned to a request carrying a valid
--    logged-in session — never to the anonymous public.
alter table public.profile enable row level security;

-- 3. Policy: any authenticated user (your three logins) may read
--    and write the single profile row. Anonymous visitors get
--    nothing. (Drop-if-exists makes this safe to re-run.)
drop policy if exists "authenticated can read profile"  on public.profile;
drop policy if exists "authenticated can write profile" on public.profile;

create policy "authenticated can read profile"
  on public.profile for select
  to authenticated
  using (true);

create policy "authenticated can write profile"
  on public.profile for all
  to authenticated
  using (true)
  with check (true);

-- 4. Seed the single empty row so the app always has something to load.
insert into public.profile (id) values (1)
  on conflict (id) do nothing;
