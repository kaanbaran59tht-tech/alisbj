'use client';

import { useEffect, useState, useCallback } from 'react';
// createClient yerine direkt supabase objesini çağırıyoruz
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/types/index';
import { ProductCard } from '@/components/ui/ProductCard';
import { Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DBProduct {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id: string; // DÜZELTME: Eski 'category' yerine ilişkisel 'category_id' kullanıyoruz
}

export function ProductsGrid() {
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [filtered, setFiltered] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // ─── Ürünleri Yükle ────────────────────────────────────────────────────────
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // DÜZELTME: Seçim alanındaki eski 'category' kelimesi 'category_id' olarak değiştirildi
            const { data, error: err } = await supabase
                .from('products')
                .select('id, title, description, price, image_url, category_id')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (err) throw err;
            setProducts((data as DBProduct[]) || []);
        } catch (err: any) {
            setError(err.message || 'Ürünler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    // ─── Filtrele ─────────────────────────────────────────────────────────────
    useEffect(() => {
        let result = [...products];

        // DÜZELTME: Filtreleme işlemi artık UUID tabanlı category_id üzerinden yapılıyor
        if (activeCategory) {
            result = result.filter((p) => p.category_id === activeCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        setFiltered(result);
    }, [products, activeCategory, search]);

    // ─── Kategori ismi ─────────────────────────────────────────────────────────
    const categoryName = activeCategory
        ? CATEGORIES.find((c) => c.id === activeCategory)?.name
        : null;

    return (
        <section id="products" className="py-16 md:py-28 bg-cream-50">
            <div className="max-w-6xl mx-auto px-6 space-y-12">

                {/* ─── Başlık ──────────────────────────────────────────────────────── */}
                <div className="text-center space-y-4">
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gold">
                        KOLEKSİYON
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl text-charcoal-800">
                        {categoryName ? categoryName : 'Tüm Ürünler'}
                    </h2>
                    <div className="mx-auto w-12 h-px bg-gold" />
                    {!activeCategory && (
                        <p className="text-warm-gray-500 font-sans max-w-xl mx-auto">
                            Toptan çelik takı koleksiyonumuz — her sipariş 6 lı paket halindedir.
                        </p>
                    )}
                </div>

                {/* ─── Kategori Filtreleri ─────────────────────────────────────────── */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {/* Tümü */}
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={cn(
                            'px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-colors',
                            !activeCategory
                                ? 'bg-gold text-charcoal-800'
                                : 'bg-white hover:bg-cream-200 text-charcoal-700 border border-warm-gray-200'
                        )}
                    >
                        Tümü
                    </button>

                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() =>
                                setActiveCategory(activeCategory === cat.id ? null : cat.id)
                            }
                            className={cn(
                                'px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-colors',
                                activeCategory === cat.id
                                    ? 'bg-gold text-charcoal-800'
                                    : 'bg-white hover:bg-cream-200 text-charcoal-700 border border-warm-gray-200'
                            )}
                        >
                            {(cat as any).icon} {cat.name}
                        </button>
                    ))}
                </div>

                {/* ─── Arama Kutusu ──────────────────────────────────────────────── */}
                <div className="max-w-md mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ürün ara…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-warm-gray-200 rounded-full text-sm font-sans focus:outline-none focus:border-gold transition-colors"
                    />
                </div>

                {/* ─── Yükleniyor ──────────────────────────────────────────────── */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                )}

                {/* ─── Hata ────────────────────────────────────────────────────── */}
                {error && !loading && (
                    <div className="text-center py-16 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <p className="text-warm-gray-600 font-sans">{error}</p>
                        <button onClick={loadProducts} className="btn-outline gap-2">
                            <RefreshCw className="w-4 h-4" /> Tekrar Dene
                        </button>
                    </div>
                )}

                {/* ─── Ürün Sayısı Bilgisi ──────────────────────────────────────── */}
                {!loading && !error && (
                    <p className="text-center text-xs text-warm-gray-400 font-sans -mt-4">
                        {filtered.length} ürün
                        {activeCategory ? ` — ${categoryName}` : ''}
                        {search ? ` — "${search}"` : ''}
                    </p>
                )}

                {/* ─── Ürün Grid ───────────────────────────────────────────────── */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filtered.map((product, i) => (
                            <div
                                key={product.id}
                                className="animate-fade-up"
                                style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                            >
                                <ProductCard
                                    id={product.id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    image_url={product.image_url}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Sonuç Yok ───────────────────────────────────────────────── */}
                {!loading && !error && filtered.length === 0 && products.length > 0 && (
                    <div className="text-center py-16">
                        <p className="text-warm-gray-500 font-sans">
                            Bu filtreyle eşleşen ürün bulunamadı.
                        </p>
                        <button
                            onClick={() => { setActiveCategory(null); setSearch(''); }}
                            className="mt-4 btn-outline text-sm"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}

                {/* ─── Hiç Ürün Yok ────────────────────────────────────────────── */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-16 space-y-3">
                        <p className="text-warm-gray-500 font-sans">
                            Henüz ürün eklenmemiş.
                        </p>
                        <a href="/admin/dashboard" className="btn-gold inline-flex">
                            Admin Paneline Git →
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}