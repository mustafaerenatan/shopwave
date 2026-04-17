-- ============================================================
-- ShopWave — Full Supabase SQL Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. EXTENSIONS ────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 2. CATEGORIES ────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 3. PRODUCTS ──────────────────────────────────────────────
create table if not exists public.products (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  description    text,
  price          numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) check (original_price >= 0),
  image_url      text,
  category_id    uuid references public.categories(id) on delete set null,
  stock          integer check (stock >= 0),        -- null = unlimited
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── 4. PROFILES (linked to auth.users) ───────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 5. AUTO-UPDATE updated_at ────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ── 6. AUTO-CREATE PROFILE ON SIGNUP ─────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 7. ROW LEVEL SECURITY ─────────────────────────────────────
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.profiles   enable row level security;

-- Helper: is current user admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Categories: read = everyone, write = admin
create policy "categories_select_all" on public.categories
  for select using (true);

create policy "categories_insert_admin" on public.categories
  for insert with check (public.is_admin());

create policy "categories_update_admin" on public.categories
  for update using (public.is_admin());

create policy "categories_delete_admin" on public.categories
  for delete using (public.is_admin());

-- Products: active = everyone, all = admin
create policy "products_select_active" on public.products
  for select using (is_active = true or public.is_admin());

create policy "products_insert_admin" on public.products
  for insert with check (public.is_admin());

create policy "products_update_admin" on public.products
  for update using (public.is_admin());

create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

-- Profiles: own row + admin sees all
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- ── 8. STORAGE BUCKET ────────────────────────────────────────
-- Run these separately in Supabase Storage UI or via:
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "products_storage_select" on storage.objects
  for select using (bucket_id = 'products');

create policy "products_storage_insert_admin" on storage.objects
  for insert with check (bucket_id = 'products' and public.is_admin());

create policy "products_storage_update_admin" on storage.objects
  for update using (bucket_id = 'products' and public.is_admin());

create policy "products_storage_delete_admin" on storage.objects
  for delete using (bucket_id = 'products' and public.is_admin());

-- ── 9. SEED DATA (optional) ───────────────────────────────────
insert into public.categories (name, slug) values
  ('Elektronik',   'elektronik'),
  ('Moda',         'moda'),
  ('Ev & Yaşam',   'ev-yasam'),
  ('Spor',         'spor'),
  ('Kozmetik',     'kozmetik')
on conflict (slug) do nothing;

-- Seed products (replace category_id values after INSERT above)
do $$
declare
  cat_elektronik uuid;
  cat_moda       uuid;
  cat_ev         uuid;
begin
  select id into cat_elektronik from public.categories where slug = 'elektronik';
  select id into cat_moda       from public.categories where slug = 'moda';
  select id into cat_ev         from public.categories where slug = 'ev-yasam';

  insert into public.products (name, description, price, original_price, category_id, stock, is_active) values
    ('Kablosuz Kulaklık Pro', 'Gürültü önleyici, 30 saat pil ömrü', 899.99,  1299.00, cat_elektronik, 50,  true),
    ('Akıllı Saat Ultra',     'AMOLED ekran, GPS, kalp ritmi',       1499.99, 2199.00, cat_elektronik, 30,  true),
    ('Premium Deri Çanta',    'El yapımı İtalyan derisi',             2499.00, null,    cat_moda,       15,  true),
    ('Yoga Matı Deluxe',      'Kaymaz taban, 6mm kalınlık',          349.00,  499.00,  cat_ev,         100, true),
    ('Minimalist Cüzdan',     'Karbon fiber, RFID korumalı',         299.99,  null,    cat_moda,       75,  true)
  on conflict do nothing;
end;
$$;

-- ── 10. INDEXES ──────────────────────────────────────────────
create index if not exists products_category_idx  on public.products(category_id);
create index if not exists products_is_active_idx on public.products(is_active);
create index if not exists profiles_role_idx      on public.profiles(role);
