/* ═══════════════════════════════════════════════════════════════════════════
   ALLURE — Supabase SQL Setup
   ═════════════════════════════════════════════════════════════════════════ */

-- ─── Products Tablosu ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Ürün Bilgileri
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  
  -- Meta Bilgileri
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Admin Kontrolü
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- ─── Row Level Security (RLS) Politikaları ────────────────────────────────────

-- Herkes ürünleri okuyabilir
CREATE POLICY "Allow public read access to products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = TRUE);

-- Sadece Admin (giriş yapan) yeni ürün ekleyebilir
CREATE POLICY "Allow authenticated users to create products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Sadece yaratıcısı güncelleyebilir
CREATE POLICY "Allow creators to update their products" 
  ON public.products 
  FOR UPDATE 
  USING (created_by = auth.uid());

-- Sadece yaratıcısı silebilir
CREATE POLICY "Allow creators to delete their products" 
  ON public.products 
  FOR DELETE 
  USING (created_by = auth.uid());

-- RLS'i etkinleştir
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ─── İndeksler (Performans için) ──────────────────────────────────────────────

CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX idx_products_created_by ON public.products(created_by);

-- ─── Updated_at Trigger (Otomatik Güncelleme Tarihi) ──────────────────────────

CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_products_updated_at();

-- ─── KURULUŞ TAMAMLANMA ───────────────────────────────────────────────────────
-- Yukarıdaki SQL'i Supabase SQL Editor'ında çalıştırın:
-- 1. https://app.supabase.com > Proje > SQL Editor
-- 2. Yeni Query oluşturun
-- 3. Yukarıdaki kodu yapıştırın
-- 4. "RUN" butonuna tıklayın
-- ═════════════════════════════════════════════════════════════════════════════
