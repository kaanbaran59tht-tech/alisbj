-- ═══════════════════════════════════════════════════════════════════════════
-- ALİŞ BİJUTERİ — Supabase Tüm Veritabanı Kurulum SQL'i (Güncel & Sabit ID'li)
-- ═══════════════════════════════════════════════════════════════════════════
-- Bu kodu Supabase Dashboard -> SQL Editor alanına yapıştırıp "RUN" butonuna basınız.

-- ─── 1. KATEGORİLER TABLOSU (categories) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kategori İndeksleri
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- Kategorileri Ekle (Frontend ile tam uyumlu Sabit UUID'ler)
INSERT INTO public.categories (id, name, slug, display_order, icon) VALUES
  ('aa111111-1111-1111-1111-111111111111', 'BİLEKLİK', 'bileklik', 1, '⌚'),
  ('bb222222-2222-2222-2222-222222222222', 'KOLYE', 'kolye', 2, '📿'),
  ('cc333333-3333-3333-3333-333333333333', 'KÜPE', 'kupe', 3, '💎'),
  ('dd444444-4444-4444-4444-444444444444', 'YÜZÜK', 'yuzuk', 4, '💍'),
  ('ee555555-5555-5555-5555-555555555555', 'HALHAL', 'halhal', 5, '📍'),
  ('77777777-7777-7777-7777-777777777777', 'HIZMA & PIERCING', 'hizma-piercing', 6, '🔧'),
  ('88888888-8888-8888-8888-888888888888', 'TOKA', 'toka', 7, '🎀'),
  ('11111111-2222-3333-4444-000000000001', 'SET TOKA', 'set-toka', 8, '🎀'),
  ('11111111-2222-3333-4444-000000000002', 'PELUŞ MANDAL', 'pelus-mandal', 9, '🧸'),
  ('11111111-2222-3333-4444-000000000003', 'MANDAL-TIRMIK MODELLERİ', 'mandal-tirmik-modelleri', 10, '✂️'),
  ('11111111-2222-3333-4444-000000000004', 'KUTULU TOKA', 'kutulu-toka', 11, '📦'),
  ('11111111-2222-3333-4444-000000000005', 'ANAHTARLIK', 'anahtarlik', 12, '🔑'),
  ('11111111-2222-3333-4444-000000000006', 'SAÇ BANDI', 'sac-bandi', 13, '🎗️'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'ERKEK ÜRÜNLERİ', 'erkek-urunleri', 14, '👨')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  display_order = EXCLUDED.display_order,
  icon = EXCLUDED.icon;

-- Categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories"
  ON public.categories FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Allow authenticated full access to categories" ON public.categories;
CREATE POLICY "Allow authenticated full access to categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ─── 2. ÜRÜNLER TABLOSU (products) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ürün İndeksleri
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Products RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Allow authenticated insert products" ON public.products;
CREATE POLICY "Allow authenticated insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow authenticated update products" ON public.products;
CREATE POLICY "Allow authenticated update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow authenticated delete products" ON public.products;
CREATE POLICY "Allow authenticated delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);


-- ─── 3. SİPARİŞLER TABLOSU (orders) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(12) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_short_id ON public.orders(short_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to orders" ON public.orders;
CREATE POLICY "Allow public read access to orders"
  ON public.orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access to orders" ON public.orders;
CREATE POLICY "Allow public insert access to orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);


-- ─── 4. SİPARİŞ DETAYLARI TABLOSU (order_items) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  package_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  variant VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to order_items" ON public.order_items;
CREATE POLICY "Allow public read access to order_items"
  ON public.order_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access to order_items" ON public.order_items;
CREATE POLICY "Allow public insert access to order_items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);


-- ─── 5. STORAGE BUCKET (product-images) ──────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
CREATE POLICY "Allow public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated upload images" ON storage.objects;
CREATE POLICY "Allow authenticated upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated update images" ON storage.objects;
CREATE POLICY "Allow authenticated update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated delete images" ON storage.objects;
CREATE POLICY "Allow authenticated delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
