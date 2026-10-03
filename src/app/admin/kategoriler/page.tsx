'use client';

import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/hooks/useCategoryStore';
import { supabase } from '@/lib/supabase';
import {
    Plus, Trash2, FolderPlus,
    RefreshCw, Loader2, AlertCircle, Tag, Layers
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const SUGGESTED_ICONS = ['🎀', '🧸', '✂️', '📦', '🔑', '🎗️', '✨', '👑', '💎', '⌚', '💍', '📿', '📍', '🌸', '🪄', '⭐'];

export default function AdminKategorilerPage() {
    const { categories, loadCategories, addCategory, deleteCategory, isLoading } = useCategoryStore();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🎀');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        loadCategories();
        loadProductCounts();
    }, []);

    const loadProductCounts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('category_id');

            if (!error && data) {
                const counts: Record<string, number> = {};
                data.forEach((p) => {
                    if (p.category_id) {
                        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
                    }
                });
                setProductCounts(counts);
            }
        } catch (e) {
            console.error('Ürün sayıları alınamadı:', e);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanName = name.trim();
        if (!cleanName) {
            toast.error('Lütfen bir kategori adı girin');
            return;
        }

        setSubmitting(true);
        try {
            const res = await addCategory({ name: cleanName, icon });
            if (res.success) {
                toast.success(`"${cleanName.toUpperCase()}" kategorisi başarıyla eklendi!`);
                setName('');
                await loadCategories();
            } else {
                toast.error(res.error || 'Kategori eklenemedi');
            }
        } catch (err: any) {
            toast.error('Hata oluştu: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, catName: string) => {
        const count = productCounts[id] || 0;
        let confirmMsg = `"${catName}" kategorisini silmek istediğinizden emin misiniz?`;
        if (count > 0) {
            confirmMsg += `\n\nDikkat: Bu kategoriye ait ${count} adet ürün bulunmaktadır! Kategori silindiğinde ürünlerin kategorisi boş kalacaktır.`;
        }

        if (!window.confirm(confirmMsg)) return;

        setDeletingId(id);
        try {
            const res = await deleteCategory(id);
            if (res.success) {
                toast.success(`"${catName}" kategorisi silindi`);
                await loadProductCounts();
            } else {
                toast.error(res.error || 'Silinemedi');
            }
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    // Virtual olanları ayır
    const actualCategories = categories.filter((c) => !c.virtual);

    return (
        <>
            <Toaster position="top-right" />

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Başlık */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl text-charcoal-800">Kategori Yönetimi</h1>
                        <p className="text-warm-gray-500 font-sans mt-1">
                            Mağazanızdaki ürün kategorilerini yönetin ve yeni kategoriler ekleyin.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            loadCategories();
                            loadProductCounts();
                        }}
                        disabled={isLoading}
                        className="btn-outline flex items-center justify-center gap-2 self-start sm:self-auto"
                    >
                        <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
                        Yenile
                    </button>
                </div>

                {/* Yeni Kategori Ekle Formu */}
                <div className="card-luxury">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <FolderPlus className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl md:text-2xl text-charcoal-800">
                                Yeni Kategori Ekle
                            </h2>
                            <p className="text-2xs text-warm-gray-400 font-sans">
                                Eklenen kategori anında mağazada, filtrelerde ve ürün ekleme formunda görünecektir.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Kategori Adı */}
                            <div className="md:col-span-2">
                                <label className="label-bijou">Kategori Adı *</label>
                                <div className="relative">
                                    <Tag className="w-4 h-4 text-warm-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Örn: TAÇ & BANDANA, HALHAL..."
                                        className="input-bijou pl-10"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            {/* İkon / Emoji */}
                            <div>
                                <label className="label-bijou">İkon / Emoji</label>
                                <input
                                    type="text"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    maxLength={4}
                                    placeholder="🎀"
                                    className="input-bijou text-center text-lg"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        {/* Hızlı İkon Seçimi */}
                        <div>
                            <label className="text-2xs font-semibold text-warm-gray-500 font-sans uppercase tracking-wider block mb-2">
                                Hızlı İkon Seçin:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTED_ICONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setIcon(emoji)}
                                        className={cn(
                                            'w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition-all',
                                            icon === emoji
                                                ? 'border-gold bg-gold/15 scale-105 shadow-sm'
                                                : 'border-warm-gray-200 bg-white hover:bg-cream-100'
                                        )}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Buton */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting || !name.trim()}
                                className="btn-gold flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Ekleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Kategoriyi Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Mevcut Kategoriler Tablosu */}
                <div className="card-luxury">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h2 className="font-display text-xl md:text-2xl text-charcoal-800">
                                    Mevcut Kategoriler ({actualCategories.length})
                                </h2>
                                <p className="text-2xs text-warm-gray-400 font-sans">
                                    Aktif olarak kullanılan ve vitrinde listelenen kategoriler.
                                </p>
                            </div>
                        </div>
                    </div>

                    {isLoading && actualCategories.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6 md:-mx-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-warm-gray-200 text-left">
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 w-16">İkon</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600">Kategori Adı</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 text-center whitespace-nowrap">Bağlı Ürün Sayısı</th>
                                        <th className="px-4 py-3 font-sans font-semibold text-warm-gray-600 text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-warm-gray-100">
                                    {actualCategories.map((category) => {
                                        const count = productCounts[category.id] || 0;
                                        return (
                                            <tr key={category.id} className="hover:bg-cream-100/60 transition-colors">
                                                <td className="px-4 py-3 text-center text-xl">
                                                    {typeof category.icon === 'string' ? category.icon : category.icon || '🏷️'}
                                                </td>
                                                <td className="px-4 py-3 font-sans font-semibold text-charcoal-800">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                                                        count > 0 ? "bg-gold/15 text-charcoal-800" : "bg-warm-gray-100 text-warm-gray-400"
                                                    )}>
                                                        {count} ürün
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(category.id, category.name)}
                                                        disabled={deletingId === category.id}
                                                        className="p-2 text-warm-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Kategoriyi Sil"
                                                    >
                                                        {deletingId === category.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
