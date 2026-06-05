'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
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
    category_id: string;
}

export function ProductsGrid() {
    const [products, setProducts] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // ─── Ürünleri Yükle ────────────────────────────────────────────────────────
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const supabase = createClient();
            const { data, error: err } = await supabase
                .from('products')
                .select('id, title, description, price, image_url, category_id')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (err) throw err;
            setProducts(data || []);
        } catch (err: any) {
            setError(err.message || 'Ürünler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // ─── Performanslı Filtreleme (useMemo) ──────────────────────────────────────
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (activeCategory) {
            result = result.filter((p) => p.category_id === activeCategory);
        }

        const trimmedSearch = search.trim().toLowerCase();
        if (trimmedSearch) {
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(trimmedSearch) ||
                    p.description?.toLowerCase().includes(trimmedSearch)
            );
        }

        return result;
    }, [products, activeCategory, search]);

    // ─── Kategori ismi ─────────────────────────────────────────────────────────
    const categoryName = useMemo(() => {
        if (!activeCategory) return null;
        return CATEGORIES.find((c) => c.id === activeCategory)?.name || null;
    }, [activeCategory]);

    return (
        <section id="products" className="py-16 md:py-24 bg-cream-50">
            <div className="container-bijou space-y-12">

                {/* Başlık Bölümü */}
                <div className="text-center space-y-4">
                    <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gold">
                        KOLEKSİYON
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl text-charcoal-800 tracking-tight">
                        {categoryName ? categoryName : 'Tüm Ürünler'}
                    </h2>
                    <div className="mx-auto w-12 h-px bg-gold" />
                    {!activeCategory && (
                        <p className="text-warm-gray-500 font-sans text-xs sm:text-sm max-w-xl mx-auto">
                            Toptan çelik takı koleksiyonumuz — her sipariş 6'lı paket halindedir.
                        </p>
                    )}
                </div>

                {/* Kategori Filtreleri */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={cn(
                            'px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-colors',
                            !activeCategory
                                ? 'bg-gold text-charcoal-800'
                                : 'bg-white hover:bg-cream-100 text-charcoal-700 border border-warm-gray-200'
                        )}
                    >
                        Tümü
                    </button>

                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                            className={cn(
                                'px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-colors',
                                activeCategory === cat.id
                                    ? 'bg-gold text-charcoal-800'
                                    : 'bg-white hover:bg-cream-100 text-charcoal-700 border border-warm-gray-200'
                            )}
                        >
                            {(cat as any).icon} {cat.name}
                        </button>
                    ))}
                </div>

                {/* Arama Kutusu */}
                <div className="max-w-md mx-auto relative px-4 sm:px-0">
                    <Search className="absolute left-7 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ürün ara…"
                        className="input-bijou pl-10 rounded-full w-full bg-white border border-warm-gray-200 py-2 text-sm focus:outline-none focus:border-gold"
                    />
                </div>

                {/* Durum Ekranları (Loading / Error) */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center py-16 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                        <p className="text-warm-gray-600 font-sans text-sm">{error}</p>
                        <button onClick={loadProducts} className="btn-outline gap-2 mx-auto flex items-center bg-white border border-warm-gray-200 px-4 py-2 rounded-lg text-xs font-semibold">
                            <RefreshCw className="w-4 h-4" /> Tekrar Dene
                        </button>
                    </div>
                )}

                {/* Ürün Sayısı Bilgisi */}
                {!loading && !error && (
                    <p className="text-center text-3xs text-warm-gray-400 font-mono -mt-4 uppercase tracking-wider">
                        {filteredProducts.length} model listeleniyor
                    </p>
                )}

                {/* Ürün Grid Yapısı */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 sm:px-0">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                description={product.description}
                                price={product.price}
                                image_url={product.image_url}
                                category_id={product.category_id}
                                allProducts={products} // -> Tüm listeyi benzer ürünler için aktarıyoruz
                            />
                        ))}
                    </div>
                )}

                {/* Sonuç Bulunamadı */}
                {!loading && !error && filteredProducts.length === 0 && products.length > 0 && (
                    <div className="text-center py-16">
                        <p className="text-warm-gray-500 font-sans text-sm">Aradığınız kriterlere uygun model bulunamadı.</p>
                        <button onClick={() => { setActiveCategory(null); setSearch(''); }} className="mt-4 bg-white border border-warm-gray-200 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-warm-gray-50">
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}