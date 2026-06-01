/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { CATEGORIES } from '@/types/index';
import {
    Plus, Trash2, Loader2, Package, Box, ImageIcon, RefreshCw,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface DBProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: string; // DÜZELTME: Eski 'category' alanı yerine 'category_id' kullanıyoruz
    created_at: string;
}

// ─── Başlangıç form state ────────────────────────────────────────────────────
const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '', // DÜZELTME: Form state'inde de artık 'category_id' tutuyoruz
};

export default function AdminDashboardPage() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imgError, setImgError] = useState(false);

    // ─── Ürünleri Yükle ────────────────────────────────────────────────────────
    const loadProducts = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('id, title, description, price, image_url, category_id, created_at') // DÜZELTME: category_id eklendi
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts((data as DBProduct[]) || []);
        } catch (err: any) {
            toast.error('Ürünler yüklenemedi: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    // ─── Form Alan Değişimi ─────────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === 'image_url') setImgError(false);
    };

    // ─── Ürün Ekle ──────────────────────────────────────────────────────────────
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) { toast.error('Ürün adı zorunlu'); return; }
        if (!form.price) { toast.error('Fiyat zorunlu'); return; }
        if (!form.category_id) { toast.error('Kategori seçin'); return; } // DÜZELTME
        if (parseFloat(form.price) <= 0) { toast.error('Fiyat 0\'dan büyük olmalı'); return; }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .insert({
                    title: form.title.trim(),
                    description: form.description.trim() || null,
                    price: parseFloat(form.price),
                    image_url: form.image_url.trim() || null,
                    category_id: form.category_id, // DÜZELTME: Veritabanına yeni ilişkisel ID gidiyor
                    is_active: true,
                    created_by: user?.id,
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('✅ Ürün eklendi!');
            setProducts([data as DBProduct, ...products]);
            setForm(EMPTY_FORM);
            setImgError(false);
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Ürün Sil ──────────────────────────────────────────────────────────────
    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) return;

        setDeletingId(id);
        try {
            const supabase = createClient();
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter((p) => p.id !== id));
            toast.success('🗑️ Ürün silindi');
        } catch (err: any) {
            toast.error('Silinemedi: ' + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // ─── Kategori ismi ─────────────────────────────────────────────────────────
    const getCategoryName = (id: string) =>
        CATEGORIES.find((c) => c.id === id)?.name || id;

    const getCategoryIcon = (id: string) =>
        (CATEGORIES.find((c) => c.id === id) as any)?.icon || '🏷️';

    return (
        <>
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto space-y-10">
                {/* ─── Sayfa Başlığı ──────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-4xl text-charcoal-800">Ürün Yönetimi</h1>
                        <p className="text-warm-gray-500 font-sans mt-1">
                            {products.length} ürün • 6'lı paket sistemi
                        </p>
                    </div>
                    <button
                        onClick={loadProducts}
                        disabled={loading}
                        className="btn-outline flex items-center gap-2"
                    >
                        <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                        Yenile
                    </button>
                </div>

                {/* ─── Ürün Ekleme Formu ──────────────────────────────────────── */}
                <div className="card-luxury">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-gold" />
                        </div>
                        <h2 className="font-display text-2xl text-charcoal-800">Yeni Ürün Ekle</h2>
                    </div>

                    <form onSubmit={handleAdd} className="space-y-6">
                        {/* Satır 1: Ad + Fiyat */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ürün Adı */}
                            <div>
                                <label className="label-bijou">Ürün Adı *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Örn: Çelik Zincir Bileklik"
                                    className="input-bijou"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {/* Fiyat */}
                            <div>
                                <label className="label-bijou">Paket Fiyatı (₺) — 6 Adet *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    className="input-bijou"
                                    required
                                    disabled={submitting}
                                />
                                {form.price && parseFloat(form.price) > 0 && (
                                    <p className="text-2xs text-gold font-sans mt-1">
                                        Adet başı ≈ ₺{(parseFloat(form.price) / 6).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Satır 2: Kategori */}
                        <div>
                            <label className="label-bijou">Kategori *</label>
                            <select
                                name="category_id" // DÜZELTME
                                value={form.category_id} // DÜZELTME
                                onChange={handleChange}
                                className="input-bijou"
                                required
                                disabled={submitting}
                            >
                                <option value="">— Kategori Seçin —</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {(cat as any).icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Satır 3: Açıklama */}
                        <div>
                            <label className="label-bijou">Açıklama</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Ürün özellikleri, materyal bilgisi vb."
                                className="input-bijou resize-none h-24"
                                disabled={submitting}
                            />
                        </div>

                        {/* Satır 4: Görsel URL */}
                        <div>
                            <label className="label-bijou">Görsel URL</label>
                            <input
                                type="url"
                                name="image_url"
                                value={form.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="input-bijou"
                                disabled={submitting}
                            />

                            {/* Görsel Önizleme */}
                            {form.image_url && !imgError && (
                                <div className="mt-3 flex items-start gap-4">
                                    <img
                                        src={form.image_url}
                                        alt="Önizleme"
                                        className="w-20 h-20 object-cover rounded-lg border border-warm-gray-200"
                                        onError={() => setImgError(true)}
                                    />
                                    <p className="text-2xs text-warm-gray-500 font-sans pt-1">Görsel önizleme</p>
                                </div>
                            )}
                            {form.image_url && imgError && (
                                <p className="mt-2 text-2xs text-red-500 font-sans">
                                    ⚠️ Görsel yüklenemedi — URL'yi kontrol edin
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-gold w-full md:w-auto"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Ekleniyor…</>
                                ) : (
                                    <><Plus className="w-4 h-4" /> Ürün Ekle</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ─── Ürün Listesi ──────────────────────────────────────────── */}
                <div className="card-luxury">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gold" />
                        </div>
                        <h2 className="font-display text-2xl text-charcoal-800">Mevcut Ürünler</h2>
                    </div>

                    {/* Yükleniyor */}
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        </div>
                    )}

                    {/* Boş */}
                    {!loading && products.length === 0 && (
                        <div className="text-center py-16 space-y-3">
                            <Box className="w-12 h-12 text-warm-gray-300 mx-auto" />
                            <p className="text-warm-gray-500 font-sans">
                                Henüz ürün yok. Yukarıdaki formdan ekleyin.
                            </p>
                        </div>
                    )}

                    {/* Ürün Tablosu */}
                    {!loading && products.length > 0 && (
                        <div className="overflow-x-auto -mx-6 md:-mx-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-warm-gray-200 text-left">
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 min-w-[72px]">Görsel</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600">Ürün Adı</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600">Kategori</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 whitespace-nowrap">Paket Fiyatı</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 whitespace-nowrap">Adet Fiyatı</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600">Tarih</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-warm-gray-100">
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-cream-100 transition-colors"
                                        >
                                            {/* Görsel */}
                                            <td className="px-4 py-4">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="w-14 h-14 object-cover rounded-lg border border-warm-gray-200"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-warm-gray-100 rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-warm-gray-400" />
                                                    </div>
                                                )}
                                            </td>

                                            {/* Ad + Açıklama */}
                                            <td className="px-4 py-4 max-w-xs">
                                                <p className="font-sans font-semibold text-charcoal-800 truncate">
                                                    {product.title}
                                                </p>
                                                {product.description && (
                                                    <p className="text-2xs text-warm-gray-400 mt-0.5 truncate max-w-[180px]">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Kategori */}
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 text-2xs font-sans font-semibold text-gold whitespace-nowrap">
                                                    {/* DÜZELTME: product.category yerine product.category_id okuyoruz */}
                                                    {getCategoryIcon(product.category_id)} {getCategoryName(product.category_id)}
                                                </span>
                                            </td>

                                            {/* Paket Fiyatı */}
                                            <td className="px-4 py-4">
                                                <span className="font-display font-medium text-gold text-base">
                                                    ₺{product.price.toFixed(2)}
                                                </span>
                                                <p className="text-2xs text-warm-gray-400 font-sans">6 adet</p>
                                            </td>

                                            {/* Adet Fiyatı */}
                                            <td className="px-4 py-4">
                                                <span className="font-sans text-charcoal-700">
                                                    ₺{(product.price / 6).toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Tarih */}
                                            <td className="px-4 py-4 text-2xs text-warm-gray-400 font-sans whitespace-nowrap">
                                                {new Date(product.created_at).toLocaleDateString('tr-TR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </td>

                                            {/* Sil */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => handleDelete(product.id, product.title)}
                                                    disabled={deletingId === product.id}
                                                    className={cn(
                                                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-2xs font-sans font-semibold',
                                                        'bg-red-50 text-red-600 hover:bg-red-100 transition-colors',
                                                        'disabled:opacity-50 disabled:cursor-not-allowed'
                                                    )}
                                                >
                                                    {deletingId === product.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-3 h-3" />
                                                    )}
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}