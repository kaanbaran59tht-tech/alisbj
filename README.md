# ALLURE — Lüks Takı & Bujteri E-Ticaret Platformu

Supabase entegrasyonlu, modern ve responsive takı e-ticaret sitesi. Admin paneli ile ürün yönetimi, müşteri tarafında ise dinamik ürün listesi ve WhatsApp siparişleridir.

## ✨ Özellikler

### 👤 Admin Paneli
- ✅ Secure Login (`/admin/login`) — Supabase Auth ile
- ✅ Dashboard (`/admin/dashboard`) — Ürün yönetimi
- ✅ Yeni ürün ekleme (Başlık, Açıklama, Fiyat, Görsel URL)
- ✅ Ürün listesi (tablo görünümü)
- ✅ Ürün silme işlemi
- ✅ Mobile responsive sidebar

### 🛍️ Müşteri Tarafı
- ✅ Hero Section — Etkileyici tanıtım bölümü
- ✅ Ürünler Grid — Responsive layout (2 sütun mobil, 3 masaüstü, 4 büyük ekran)
- ✅ Ürün Kartları — Görsel, başlık, fiyat, adet seçici
- ✅ Cart Drawer — Sağ taraftan açılıp kapanır
- ✅ Adet Yönetimi — Artır/Azalt butonları
- ✅ WhatsApp Entegrasyonu — Otomatik mesaj şablonu
- ✅ Fallback Modal — WhatsApp açılmadığında bilgi sunan modal
- ✅ Toast Notifications — Başarı/hata bildirileri

## 🛠 Teknoloji Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| State Management | Zustand |
| Notifications | React Hot Toast |
| Backend | Supabase (PostgreSQL + Auth) |
| Language | TypeScript |
| Fonts | Cormorant Garamond + Jost + DM Mono |

## 📁 Klasör Yapısı

```
ALLURE-store/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/            # Admin login sayfası
│   │   │   ├── dashboard/        # Ürün yönetimi
│   │   │   └── layout.tsx        # Admin layout (sidebar)
│   │   ├── (shop)/               # Route grubu
│   │   │   ├── products/
│   │   │   ├── collections/
│   │   │   └── cart/
│   │   ├── api/                  # API routes (gelecek)
│   │   ├── layout.tsx            # Root layout + fonts
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CartDrawer.tsx    # Sepet drawer + WhatsApp
│   │   │   └── ProductCard.tsx   # Ürün kartı
│   │   ├── layout/
│   │   │   └── AppLayout.tsx     # Cart + Toaster wrapper
│   │   └── sections/
│   │       ├── HeroSection.tsx   # Hero bölümü
│   │       └── ProductsGridSection.tsx # Ürünler grid
│   ├── hooks/
│   │   ├── useAuth.ts            # Admin auth (Zustand)
│   │   └── useCart.ts            # Sepet yönetimi (Zustand)
│   ├── lib/
│   │   ├── utils.ts              # cn(), formatPrice()...
│   │   └── supabase.ts           # Supabase clients
│   └── types/
│       └── index.ts              # TypeScript tipleri
├── public/
│   └── images/
├── SUPABASE_SETUP.sql            # SQL tablosu ve RLS
├── SUPABASE_SETUP.md             # Kurulum rehberi
├── tailwind.config.ts            # Renk paleti + tokens
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## 🎨 Tasarım Sistemi

### Renk Paleti (Lüks Takı Markası)

| Token | Hex | Kullanım |
|-------|-----|---------|
| **Cream** | `#FDFAF4` | Ana arka plan |
| **Gold** | `#D4A829` | Birincil aksan |
| **Gold Light** | `#E8C14E` | Hover durumları |
| **Gold Dark** | `#B8911E` | Aktif durumlar |
| **Charcoal** | `#161616` | Birincil metin |
| **Warm Gray** | `#9E9589` | İkincil metin |
| **Obsidian** | `#0D0D0D` | Koyu bölümler |
| **Rose Gold** | `#D4806C` | İkincil aksan |

### Tipografi

- **Display**: Cormorant Garamond (serif) — Başlıklar, lüks hissi
- **Body**: Jost (sans-serif) — Metin, UI
- **Mono**: DM Mono — Kod, teknik

### Hazır CSS Sınıfları

```css
/* Buttons */
.btn-gold          /* Altın arka plan */
.btn-primary       /* Koyu arka plan */
.btn-outline       /* Kenarlıklı */

/* Cards */
.card-product      /* Ürün kartı */
.card-luxury       /* Lüks kart */

/* Typography */
.section-label     /* Küçük etiket */
.section-title     /* Bölüm başlığı */
.text-gradient-gold /* Altın degrade */

/* Effects */
.img-zoom          /* Hover zoom */
.glass             /* Glassmorphism */
.animate-fade-up   /* Fade-up animasyonu */
```

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Kurulumunu Tamamlayın

Detaylı adımlar için `SUPABASE_SETUP.md` dosyasını okuyun:

1. Supabase hesabı oluşturun
2. `.env.local` dosyasını doldurun
3. SQL tablosu çalıştırın
4. Admin kullanıcı oluşturun

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Açın: http://localhost:3000

### 4. Ürün Ekleyin

**Seçenek A: Admin Paneli**
- http://localhost:3000/admin/login
- Admin e-posta/şifre ile giriş yapın
- `/admin/dashboard` sayfasında ürün ekleyin

**Seçenek B: Supabase UI**
- Supabase Dashboard → Table Editor → `products`
- Manuel olarak ürün ekleyin

## 🔗 Önemli Sayfalar

| URL | Açıklama |
|-----|----------|
| `/` | Ana sayfa (Hero + Ürünler) |
| `/admin/login` | Admin girişi |
| `/admin/dashboard` | Ürün yönetimi |

## 🎯 Kullanıcı Senaryoları

### Admin: Ürün Ekleme
1. `/admin/login` → Giriş yapın
2. `/admin/dashboard` → "Yeni Ürün Ekle" formuna girin
3. Başlık, Fiyat, Açıklama, Görsel URL girin
4. "Ürün Ekle" butonuna tıklayın
5. Listelenen ürünlerde görünür

### Müşteri: Sipariş Verme
1. Ana sayfada ürünleri görün
2. Ürün kartından adet seçin (artı/eksi)
3. "Sepete Ekle" butonuna tıklayın
4. Sağ altta açılan drawer'da diğer ürünleri ekleyin
5. "WhatsApp'dan Sipariş Ver" butonuna tıklayın
6. Otomatik mesaj şablonuyla WhatsApp açılır
7. Fallback modal'da detaylar görülebilir

## 🔐 Güvenlik

- ✅ Supabase Auth — Şifreli admin giriş
- ✅ RLS Politikaları — Veritabanı düzeyinde erişim kontrolü
- ✅ Environment Variables — Hassas veriler `.env.local` de

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Tüm bileşenler mobil-first tasarlanmıştır.

## 🧪 Test Etme

```bash
# Lint kontrol
npm run lint

# Build testi
npm run build

# Production mode
npm run start
```

## 📋 Geliştirme Yol Haritası

- [x] **Faz 1** — Temel Altyapı ✅
- [x] **Faz 2** — Supabase Entegrasyonu ✅
- [x] **Faz 3** — Admin Login & Dashboard ✅
- [x] **Faz 4** — Ana Sayfa (Hero + Grid) ✅
- [x] **Faz 5** — Sepet & WhatsApp ✅
- [ ] **Faz 6** — Arama & Filtreleme
- [ ] **Faz 7** — Koleksiyon Sayfaları
- [ ] **Faz 8** — Müşteri Hesapları
- [ ] **Faz 9** — Ödeme Sistemi (Stripe/Iyzico)
- [ ] **Faz 10** — SEO & Performans

## 🐛 Sorun Giderme

### Ürünler yüklenmiyor
- `.env.local` kontrol edin
- `SUPABASE_SETUP.sql` çalıştırdınız mı?
- RLS politikaları etkin mi?

### Admin girişi başarısız
- Auth enabled mi? (Supabase > Auth > Providers)
- Kullanıcı var mı? (Supabase > Auth > Users)

### WhatsApp linki açılmıyor
- `.env.local` dosyasında `NEXT_PUBLIC_ADMIN_PHONE_NUMBER` kontrol edin
- Format: `905551234567` (boşluksuz)

## 📚 Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hot Toast](https://react-hot-toast.com)

## 📄 Lisans

MIT

