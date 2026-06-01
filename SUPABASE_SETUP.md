## Supabase Kurulum Rehberi — ALLURE

Bu rehberi izleyerek Supabase entegrasyonunu başarıyla tamamlayabilirsiniz.

---

## 📋 Ön Koşullar

- Supabase hesabı: https://supabase.com (ücretsiz)
- Proje oluşturulmuş ve aktif olmalı

---

## 🔧 Adım 1: Supabase Değişkenlerini Alın

1. **Supabase Dashboard**'a gidin: https://app.supabase.com
2. Sol taraftan projenizi seçin
3. **Settings** > **API** kısmına gidin
4. Şu değerleri kopyalayın:
   - `NEXT_PUBLIC_SUPABASE_URL` → "URL" alanındaki bağlantı
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → "anon public" alanındaki key

---

## 🔑 Adım 2: Environment Değişkenlerini Ayarlayın

1. Proje klasöründe `.env.local` dosyası oluşturun (`.env.example` den esinlenin):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PHONE_NUMBER=905xxxxxxxxx
```

2. `NEXT_PUBLIC_ADMIN_PHONE_NUMBER` kısmında:
   - WhatsApp siparişleri için telefon numarası
   - Format: `905xxxxxxxxx` (ülke kodu + numara, boşluksuz)
   - Örn: `905551234567`

---

## 📊 Adım 3: Veritabanı Tablosunu Oluşturun

1. Supabase Dashboard'da **SQL Editor** açın
2. **New Query** butonuna tıklayın
3. `SUPABASE_SETUP.sql` dosyasındaki tüm SQL kodunu kopyalayıp yapıştırın
4. **RUN** butonuna tıklayın

Tablolar ve RLS politikaları otomatik oluşturulacak.

---

## 🔐 Adım 4: Admin Kullanıcı Oluşturun

1. Supabase Dashboard'da **Authentication** kısmına gidin
2. **Users** sekmesine tıklayın
3. **Add user** butonuna tıklayın
4. Admin e-posta ve şifre girin
5. **Create user** ile kaydedin

Şimdi `/admin/login` sayfasında bu kimlik bilgileriyle giriş yapabilirsiniz.

---

## 🛍️ Adım 5: Ürünleri Ekleyin

### Seçenek A: Admin Paneli Üzerinden (Önerilir)

1. `npm run dev` ile uygulamayı başlatın
2. http://localhost:3000/admin/login sayfasına gidin
3. Admin hesabınız ile giriş yapın
4. `/admin/dashboard` sayfasında yeni ürün ekleyin

### Seçenek B: Supabase Dashboard Üzerinden

1. Supabase Dashboard'da **Table Editor** açın
2. `products` tablosunu seçin
3. **Insert Row** butonuna tıklayın
4. Ürün bilgilerini doldurun:
   - `title`: Ürün adı
   - `price`: Fiyat (ondalık sayı)
   - `description`: Açıklama (opsiyonel)
   - `image_url`: Görsel URL'si (opsiyonel)

---

## 🔒 Adım 6: Supabase Auth Kurallarını Doğrulayın

Tablo erişim kuralları (`SUPABASE_SETUP.sql` ile otomatik ayarlanır):

| İşlem | Kime İzin Verilir | Açıklama |
|-------|---|---|
| Ürün Okuma | Herkes | Sadece `is_active=true` ürünler |
| Ürün Yazma | Admin | Giriş yapan kullanıcılar |
| Ürün Güncelleme | Yaratıcı | Sadece kendi ürünlerini güncelleyebilir |
| Ürün Silme | Yaratıcı | Sadece kendi ürünlerini silebilir |

---

## 🚀 Adım 7: Uygulamayı Test Edin

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

- Ana sayfa: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard

---

## 🐛 Yaygın Sorunlar

### "Ürünler yüklenmiyor"

**Çözüm:**
- Supabase URL'si doğru mu? `.env.local` kontrol edin
- RLS politikaları aktif mı? Table > RLS > Enable RLS
- Tabloda veri var mı? Supabase > Table Editor kontrol edin

### "Admin girişi çalışmıyor"

**Çözüm:**
- Auth Helper'lar doğru mü? `SUPABASE_SETUP.sql` çalıştırdınız mı?
- E-posta ve şifre doğru mu?
- Supabase Auth enable edildi mi? Supabase > Auth > Providers > Email

### "WhatsApp linki açılmıyor"

**Çözüm:**
- `.env.local` kontrol edin
- `NEXT_PUBLIC_ADMIN_PHONE_NUMBER` format: `905xxxxxxxxx`
- Boşluk veya özel karakter yok mu?

### "Görseller yüklenmiyor"

**Çözüm:**
- Image URL'leri geçerli HTTPS bağlantıları mı?
- CORS hatası varsa, Supabase Storage kullanın (ileri yapılandırma)

---

## 📚 Ek Kaynaklar

- **Supabase Docs**: https://supabase.com/docs
- **Next.js & Supabase**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **SQL Reference**: https://supabase.com/docs/guides/database/overview

---

## ✅ Kontrol Listesi

- [ ] Supabase hesabı oluşturdum
- [ ] `.env.local` dosyası oluştururdum
- [ ] SQL tabloları çalıştırdum
- [ ] Admin kullanıcı oluştururdum
- [ ] Ürün ekledim
- [ ] Uygulamayı `npm run dev` ile başlattım
- [ ] Ana sayfada ürünleri görüyorum
- [ ] Admin paneline giriş yapıyorum
- [ ] Yeni ürün ekleyebiliyorum
- [ ] Sepete ürün ekleyebiliyorum
- [ ] WhatsApp linki açılıyor

---

Tamamlandı! ALLURE e-ticaret platformunuz tamamen çalışır durumda.
