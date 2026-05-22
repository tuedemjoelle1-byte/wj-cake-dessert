create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  password_hash text not null,
  email_verified boolean not null default false,
  addresses jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{"newsletter": false, "transactionalEmails": true}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  name text not null
);

create table if not exists public.products (
  id text primary key,
  category_slug text not null references public.categories(slug) on update cascade,
  slug text not null unique,
  name text not null,
  description text not null,
  base_price integer not null,
  currency text not null default 'MAD',
  flavors text[] not null default '{}',
  servings integer[] not null default '{}',
  min_notice_hours integer not null default 24,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.carts (
  id text primary key,
  customer_email text null,
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  currency text not null default 'MAD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id text primary key,
  cart_id text not null references public.carts(id) on delete cascade,
  product_id text not null,
  product_slug text not null,
  name text not null,
  quantity integer not null,
  unit_price integer not null,
  line_total integer not null
);

create table if not exists public.custom_cake_requests (
  id text primary key,
  customer_name text not null,
  email text not null,
  phone text not null,
  event_date date not null,
  servings integer not null default 0,
  style text not null default 'custom',
  flavors text[] not null default '{}',
  message_on_cake text not null default '',
  notes text not null default '',
  status text not null default 'en-attente',
  estimated_amount integer not null,
  estimated_currency text not null default 'MAD',
  estimated_disclaimer text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.password_reset_tokens (
  id text primary key,
  user_id text not null references public.app_users(id) on delete cascade,
  email text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  used_at timestamptz null
);

create table if not exists public.orders (
  id text primary key,
  number text not null unique,
  cart_id text not null references public.carts(id) on delete restrict,
  customer_email text null,
  customer_name text null,
  fulfillment_mode text not null default 'delivery',
  delivery_address text null,
  slot_id text null,
  status text not null default 'en-attente',
  payment_status text not null default 'a-payer',
  items jsonb not null default '[]'::jsonb,
  totals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key,
  order_number text not null references public.orders(number) on delete cascade,
  provider text not null,
  status text not null default 'en-attente',
  amount integer not null,
  currency text not null default 'MAD',
  redirect_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id text primary key,
  code text not null unique,
  name text not null,
  fee integer not null,
  currency text not null default 'MAD',
  active boolean not null default true
);

create table if not exists public.delivery_slots (
  id text primary key,
  date date not null,
  start_time text not null,
  end_time text not null,
  type text not null,
  available boolean not null default true
);

create table if not exists public.notifications (
  id text primary key,
  type text not null,
  channel text not null,
  recipient text not null,
  subject text not null,
  content text not null,
  status text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id text primary key,
  action text not null,
  actor_type text not null,
  actor_id text null,
  target_type text null,
  target_id text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.categories (id, slug, name)
values
  ('cat_layer', 'layer-cakes', 'Layer Cakes'),
  ('cat_bento', 'bento-cakes', 'Bento Cakes'),
  ('cat_cupcakes', 'cupcakes', 'Cupcakes')
on conflict (id) do nothing;

insert into public.delivery_zones (id, code, name, fee, currency, active)
values
  ('zone_casa_centre', 'casa-centre', 'Casablanca Centre', 40, 'MAD', true),
  ('zone_casa_ouest', 'casa-ouest', 'Casablanca Ouest', 60, 'MAD', true)
on conflict (id) do nothing;

insert into public.delivery_slots (id, date, start_time, end_time, type, available)
values
  ('slot_001', '2026-06-15', '10:00', '12:00', 'delivery', true),
  ('slot_002', '2026-06-15', '14:00', '16:00', 'pickup', true)
on conflict (id) do nothing;

insert into public.products (
  id, category_slug, slug, name, description, base_price, currency, flavors, servings, min_notice_hours, is_best_seller
)
values
  (
    'prd_red_velvet',
    'layer-cakes',
    'red-velvet-signature',
    'Red Velvet Signature',
    'Layer cake moelleux au cacao doux avec creme onctueuse.',
    320,
    'MAD',
    array['Vanille', 'Red Velvet', 'Chocolat'],
    array[6, 8, 12],
    48,
    true
  ),
  (
    'prd_bento_oreo',
    'bento-cakes',
    'bento-oreo-love',
    'Bento Oreo Love',
    'Mini gateau cadeau au biscuit Oreo et creme legere.',
    120,
    'MAD',
    array['Oreo', 'Vanille'],
    array[2, 4],
    24,
    true
  ),
  (
    'prd_cupcake_box',
    'cupcakes',
    'cupcakes-party-box',
    'Cupcakes Party Box',
    'Boite de cupcakes assortis pour anniversaires et evenements.',
    180,
    'MAD',
    array['Vanille', 'Chocolat', 'Caramel'],
    array[6, 12],
    24,
    false
  )
on conflict (id) do nothing;
