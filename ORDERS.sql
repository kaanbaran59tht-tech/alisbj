-- ═══════════════════════════════════════════════════════════════════════════
-- BIJOU — Orders Sistemi SQL
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Orders Tablosu Oluştur ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id VARCHAR(12) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ─── 2. Order Items Tablosu Oluştur ──────────────────────────────────────────
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

-- ─── 3. RLS Politikaları (Orders) ────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Siparişleri herkes okuyabilir (linki bilenler)
CREATE POLICY "Allow public read access to orders"
  ON public.orders
  FOR SELECT
  USING (true);

-- Sepeti onaylayan herkes sipariş ekleyebilir
CREATE POLICY "Allow public insert access to orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- ─── 4. RLS Politikaları (Order Items) ───────────────────────────────────────
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Sipariş öğelerini herkes okuyabilir
CREATE POLICY "Allow public read access to order_items"
  ON public.order_items
  FOR SELECT
  USING (true);

-- Sepeti onaylayan herkes sipariş öğesi ekleyebilir
CREATE POLICY "Allow public insert access to order_items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (true);

-- ─── 5. İndeksler (Performans İçin) ─────────────────────────────────────────
CREATE INDEX idx_orders_short_id ON public.orders(short_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
