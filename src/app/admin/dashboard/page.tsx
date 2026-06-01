'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase';
import { CATEGORIES } from '@/types/index';
import {
    Plus, Trash2, Loader2,
    Package, Box, ImageIcon, RefreshCw,
    Link2, Upload, X,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface DBProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: string;
    created_at: string;
}

const EMPTY_FORM = {
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
};

export default function AdminDashboardPage() {
    const { user } = useAuthStore();
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imgError, setImgError] = useState(false);

    // ─── Görsel seçim modu ─────────────────────────────────────────────────────
    const [imgMode, setImgMode] = useState<'url' | 'upload'>('url');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ─── Ürünleri Yükle ────────────────────────────────────────────────────────
    const loadProducts = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
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

    // ─── Mod Değiştir ──────────────────────────────────────────────────────────
    const handleModeChange = (mode: 'url' | 'upload') => {
        setImgMode(mode);
        if (mode === 'url') {
            setUploadFile(null);
            setUploadPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
            setForm((prev) => ({ ...prev, image_url: '' }));
            setImgError(false);
        }
    };

    // ─── Resmi Canvas ile Sıkıştır ────────────────────────────────────────────
    const compressImage = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            const QUALITY = 0.82;

            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                let { width, height } = img;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) { reject(new Error('Canvas context alınamadı')); return; }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) { reject(new Error('Sıkıştırma başarısız')); return; }
                        resolve(blob);
                    },
                    'image/webp',
                    QUALITY
                );
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Görsel okunamadı'));
            };

            img.src = url;
        });
    };

    // ─── Dosya Seçimi ──────────────────────────────────────────────────────────
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Sadece görsel dosyası seçebilirsiniz');
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            toast.error("Dosya 20MB'dan küçük olmalı");
            return;
        }

        const toastId = toast.loading('Görsel optimize ediliyor…');
        try {
            const compressed = await compressImage(file);
            toast.dismiss(toastId);

            const savings = Math.round((1 - compressed.size / file.size) * 100);
            toast.success(
                `Optimize edildi: ${(file.size / 1024).toFixed(0)} KB → ${(compressed.size / 1024).toFixed(0)} KB ${savings > 0 ? `(%${savings} küçültüldü)` : ''}`,
                { duration: 4000 }
            );

            const baseName = file.name.replace(/\.[^.]+$/, '');
            const compressed_file = new File([compressed], `${baseName}.webp`, { type: 'image/webp' });

            setUploadFile(compressed_file);

            const reader = new FileReader();
            reader.onloadend = () => setUploadPreview(reader.result as string);
            reader.readAsDataURL(compressed_file);
        } catch (err: any) {
            toast.dismiss(toastId);
            toast.error('Optimize edilemedi: ' + err.message);
        }
    };

    // ─── Dosyayı Supabase Storage'a Yükle ─────────────────────────────────────
    const uploadToStorage = async (file: File): Promise<string> => {
        const supabase = createClient();
        const fileName = `product-${Date.now()}.webp`;
        const path = `products/${fileName}`;

        const { error } = await supabase.storage
            .from('product-images')
            .upload(path, file, {
                cacheControl: '31536000',
                upsert: false,
                contentType: 'image/webp',
            });

        if (error) throw error;

        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        return data.publicUrl;
    };

    // ─── Dosya Seçimini Temizle ────────────────────────────────────────────────
    const clearUpload = () => {
        setUploadFile(null);
        setUploadPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ─── Ürün Ekle ──────────────────────────────────────────────────────────────
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) { toast.error('Ürün adı zorunlu'); return; }
        if (!form.price) { toast.error('Fiyat zorunlu'); return; }
        if (!form.category) { toast.error('Kategori seçin'); return; }
        if (parseFloat(form.price) <= 0) { toast.error("Fiyat 0'dan büyük olmalı"); return; }

        setSubmitting(true);
        try {
            let finalImageUrl: string | null = null;

            if (imgMode === 'upload' && uploadFile) {
                setUploading(true);
                toast.loading('Görsel yükleniyor…', { id: 'upload' });
                try {
                    finalImageUrl = await uploadToStorage(uploadFile);
                    toast.dismiss('upload');
                    toast.success('Görsel yüklendi');
                } catch (uploadErr: any) {
                    toast.dismiss('upload');
                    toast.error('Görsel yüklenemedi: ' + uploadErr.message);
                    setUploading(false);
                    setSubmitting(false);
                    return;
                }
                setUploading(false);
            }

            if (imgMode === 'url' && form.image_url.trim()) {
                finalImageUrl = form.image_url.trim();
            }

            const supabase = createClient();
            const { data, error } = await supabase
                .from('products')
                .insert({
                    title: form.title.trim(),
                    description: form.description.trim() || null,
                    price: parseFloat(form.price),
                    image_url: finalImageUrl,
                    category_id: form.category,
                    is_active: true,
                    created_by: user?.id,
                })
                .select()
                .single();

            if (error) throw error;

            toast.success('✅ Ürün eklendi!');
            setProducts([data, ...products]);
            setForm(EMPTY_FORM);
            setImgError(false);
            clearUpload();
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Ürün Sil (Storage Görseliyle Birlikte Temizleme Eklenmiş Hali) ──────────
    const handleDelete = async (id: string, title: string, imageUrl?: string) => {
        if (!confirm(`"${title}" ürününü silmek istediğinize emin misiniz?`)) return;

        setDeletingId(id);
        try {
            const supabase = createClient();

            // 1. Eğer görsel bizim Supabase Storage'a yüklenmişse önce dosyayı silelim
            if (imageUrl && (imageUrl.includes('/storage/v1/object/public/product-images/') || imageUrl.includes('storage.googleapis.com'))) {
                try {
                    const urlParts = imageUrl.split('/product-images/');
                    if (urlParts.length > 1) {
                        const storagePath = urlParts[1];

                        const { error: storageError } = await supabase.storage
                            .from('product-images')
                            .remove([storagePath]);

                        if (storageError) {
                            console.error('Görsel bucket\'tan silinemedi:', storageError.message);
                        }
                    }
                } catch (err) {
                    console.error('Görsel yolu çözümlenirken hata oluştu:', err);
                }
            }

            // 2. Veritabanındaki ürün satırını silelim
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            setProducts(products.filter((p) => p.id !== id));
            toast.success('🗑️ Ürün ve görseli silindi');
        } catch (err: any) {
            toast.error('Silinemedi: ' + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const getCategoryName = (id: string) =>
        CATEGORIES.find((c) => c.id === id)?.name || id;

    const getCategoryIcon = (id: string) =>
        (CATEGORIES.find((c) => c.id === id) as any)?.icon || '🏷️';

    return (
        <>
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto space-y-10">
                {/* Başlık */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-4xl text-charcoal-800">Ürün Yönetimi</h1>
                        <p className="text-warm-gray-500 font-sans mt-1">
                            {products.length} ürün • 6'lı paket sistemi
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={loadProducts}
                        disabled={loading}
                        className="btn-outline flex items-center gap-2"
                    >
                        <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                        Yenile
                    </button>
                </div>

                {/* Form */}
                <div className="card-luxury">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-gold" />
                        </div>
                        <h2 className="font-display text-2xl text-charcoal-800">Yeni Ürün Ekle</h2>
                    </div>

                    <form onSubmit={handleAdd} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        <div>
                            <label className="label-bijou">Kategori *</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="input-bijou"
                                required
                                disabled={submitting}
                            >
                                <option value="">Kategori Seçin</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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

                        <div>
                            <label className="label-bijou">Ürün Görseli</label>

                            <div className="flex rounded-lg overflow-hidden border border-warm-gray-200 mb-4 w-full sm:w-fit">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('url')}
                                    className={cn(
                                        'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-600 uppercase tracking-wider transition-colors',
                                        imgMode === 'url' ? 'bg-gold text-charcoal-800' : 'bg-ivory-300 text-warm-gray-600 hover:bg-cream-100'
                                    )}
                                >
                                    <Link2 className="w-3.5 h-3.5" />
                                    Link Yapıştır
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('upload')}
                                    className={cn(
                                        'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-sans font-600 uppercase tracking-wider transition-colors border-l border-warm-gray-200',
                                        imgMode === 'upload' ? 'bg-gold text-charcoal-800' : 'bg-ivory-300 text-warm-gray-600 hover:bg-cream-100'
                                    )}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Dosya Yükle
                                </button>
                            </div>

                            {imgMode === 'url' && (
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        name="image_url"
                                        value={form.image_url}
                                        onChange={handleChange}
                                        placeholder="https://example.com/resim.jpg"
                                        className="input-bijou"
                                        disabled={submitting}
                                    />
                                    {form.image_url && imgError && (
                                        <p className="text-2xs text-red-500 font-sans">
                                            ⚠️ Görsel yüklenemedi — URL'yi kontrol edin
                                        </p>
                                    )}
                                </div>
                            )}

                            {imgMode === 'upload' && (
                                <div className="space-y-3">
                                    {!uploadFile ? (
                                        <label
                                            className={cn(
                                                'flex flex-col items-center justify-center w-full min-h-[140px] rounded-lg cursor-pointer transition-colors border-2 border-dashed border-warm-gray-300 hover:border-gold hover:bg-gold/5',
                                                submitting && 'pointer-events-none opacity-60'
                                            )}
                                        >
                                            <Upload className="w-8 h-8 text-warm-gray-400 mb-2" />
                                            <p className="font-sans font-500 text-sm text-charcoal-700">Tıkla veya sürükle bırak</p>
                                            <p className="font-sans text-2xs text-warm-gray-500 mt-1">JPG, PNG, WEBP, HEIC — Maks 20MB</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                disabled={submitting}
                                            />
                                        </label>
                                    ) : (
                                        <div className="flex items-start gap-4 p-4 bg-cream-100 rounded-lg border border-warm-gray-200">
                                            {uploadPreview && (
                                                <img src={uploadPreview} alt="Önizleme" className="w-20 h-20 object-cover rounded-lg border border-warm-gray-200 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-sans font-600 text-sm text-charcoal-800 truncate">{uploadFile.name}</p>
                                                <p className="font-sans text-2xs text-warm-gray-500 mt-0.5">{(uploadFile.size / 1024).toFixed(0)} KB · WebP ✓</p>
                                                <button
                                                    type="button"
                                                    onClick={clearUpload}
                                                    className="mt-2 flex items-center gap-1 text-2xs font-sans text-red-500 hover:text-red-700 transition-colors"
                                                    disabled={submitting}
                                                >
                                                    <X className="w-3 h-3" /> Kaldır
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {imgMode === 'url' && form.image_url && !imgError && (
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
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="btn-gold w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {uploading ? 'Görsel yükleniyor…' : 'Ekleniyor…'}
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" /> Ürün Ekle
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Liste */}
                <div className="card-luxury">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gold" />
                        </div>
                        <h2 className="font-display text-2xl text-charcoal-800">Mevcut Ürünler</h2>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <div className="text-center py-16 space-y-3">
                            <Box className="w-12 h-12 text-warm-gray-300 mx-auto" />
                            <p className="text-warm-gray-500 font-sans">Henüz ürün yok.</p>
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="overflow-x-auto -mx-6 md:-mx-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-warm-gray-200 text-left">
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600 min-w-[72px]">Görsel</th>
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600">Ürün Adı</th>
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600">Kategori</th>
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600 whitespace-nowrap">Paket Fiyatı</th>
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600 whitespace-nowrap">Adet Fiyatı</th>
                                        <th className="px-4 py-3 font-sans font-600 text-warm-gray-600">Tarih</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-warm-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-cream-100 transition-colors">
                                            <td className="px-4 py-4">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="w-14 h-14 object-cover rounded-lg border border-warm-gray-200"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 bg-warm-gray-100 rounded-lg flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-warm-gray-400" />
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-4 py-4 max-w-xs">
                                                <p className="font-sans font-600 text-charcoal-800 truncate">{product.title}</p>
                                                {product.description && (
                                                    <p className="text-2xs text-warm-gray-400 mt-0.5 truncate max-w-[180px]">{product.description}</p>
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 text-2xs font-sans font-600 text-gold whitespace-nowrap">
                                                    {getCategoryIcon(product.category_id)} {getCategoryName(product.category_id)}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="font-sans text-charcoal-700">₺{product.price.toFixed(2)}</span>
                                                <p className="text-2xs text-warm-gray-400 font-sans">6 adet</p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="font-display font-500 text-gold text-base">₺{(product.price / 6).toFixed(2)}</span>
                                            </td>

                                            <td className="px-4 py-4 text-2xs text-warm-gray-400 font-sans whitespace-nowrap">
                                                {new Date(product.created_at).toLocaleDateString('tr-TR')}
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(product.id, product.title, product.image_url)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 text-warm-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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