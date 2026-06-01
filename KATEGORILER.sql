-- ═══════════════════════════════════════════════════════════════════════════
-- BIJOU — Kategori Sistemi SQL
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Categories Tablosu Oluştur ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Bilgiler
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  
  -- Sıralama
  display_order INT DEFAULT 0,
  
  -- Meta
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ─── 2. Categories İçin İndeks ────────────────────────────────────────────
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

-- ─── 3. Kategorileri Ekle ─────────────────────────────────────────────────
INSERT INTO public.categories (name, slug, display_order, icon) VALUES
('BİLEKLİK', 'bileklik', 1, '⌚'),
('KOLYE', 'kolye', 2, '📿'),
('KÜPE', 'kupe', 3, '💎'),
('YÜZÜK', 'yuzuk', 4, '💍'),
('HALHAL', 'halhal', 5, '📍'),
('CHARM', 'charm', 6, '✨'),
('HIZMA & PIERCING', 'hizma-piercing', 7, '🔧'),
('SAAT', 'saat', 8, '⏰'),
('XUPİNG', 'xuping', 9, '👑'),
('ÇOCUKLARA ÖZEL', 'cocuklara-ozel', 10, '👧'),
('ÇELİK KOLYE UCU', 'celik-kolye-ucu', 11, '🔗'),
('ERKEK ÜRÜNLERİ', 'erkek-urunleri', 12, '👨');

-- ─── 4. Products Tablosuna category_id Ekle ─────────────────────────────────
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- ─── 5. Category Filtrelemeleri İçin İndeks ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

-- ─── 6. RLS: Kategoriler Herkes Okuyabilir ────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
  ON public.categories
  FOR SELECT
  USING (is_active = TRUE);

-- ─── 7. Updated_at Trigger for Categories ────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_categories_updated_at();

-- ═════════════════════════════════════════════════════════════════════════════
-- KURULUM:
-- 1. Supabase SQL Editor'da çalıştır
-- 2. Categories otomatik yüklenir
-- 3. Products.category_id güncelle ürün eklerken
-- ═════════════════════════════════════════════════════════════════════════════
