'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { Plus, Minus, ShoppingBag, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number; // 6 adetlik paket fiyatı
  image_url?: string;
  variants?: Array<{ id: string; name: string }>;
}

export function ProductCard({ id, title, description, price, image_url, variants }: ProductCardProps) {
  const [packages, setPackages] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(variants?.[0]);
  const { addPackage } = useCartStore();

  const unitPrice    = price / 6;
  const totalPrice   = price * packages;
  const totalUnits   = packages * 6;

  const handleAddToCart = () => {
    addPackage({
      productId: id,
      title,
      packagePrice: price,
      quantity: packages,      // seçilen paket sayısı
      selectedVariant,
      image_url,
    });

    toast.success(
      `${title} sepete eklendi — ${packages} paket (${totalUnits} adet)`,
      { duration: 2500, icon: '🛍️' }
    );
    setPackages(1);
  };

  return (
    <div className="card-product group h-full flex flex-col bg-white rounded-xl overflow-hidden border border-warm-gray-200 hover:border-gold/40 transition-all duration-300">

      {/* Görsel */}
      <div className="img-zoom relative bg-warm-gray-100 overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-warm-gray-300">
            <ShoppingBag className="w-10 h-10" />
            <span className="text-2xs font-sans">Görsel Yok</span>
          </div>
        )}

        {/* 6'lı Paket Rozeti */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-charcoal-800/80 backdrop-blur-sm text-ivory-100 px-2 py-1 rounded-full">
          <Package className="w-3 h-3 text-gold" />
          <span className="text-2xs font-sans font-600">6'lı Paket</span>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4 flex-1 flex flex-col gap-3">

        {/* Başlık */}
        <h3 className="font-display font-400 text-base leading-tight text-charcoal-800 group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Açıklama */}
        {description && (
          <p className="text-2xs text-warm-gray-500 font-sans line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Fiyat Bilgisi */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-2xs text-warm-gray-500 font-sans leading-none mb-1">
              Adet Fiyatı
            </p>
            <p className="text-sm font-sans font-500 text-charcoal-700">
              ₺{unitPrice.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xs text-warm-gray-500 font-sans leading-none mb-1">
              Paket Fiyatı (×6)
            </p>
            <p className="text-xl font-display font-500 text-gold leading-none">
              ₺{price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Varyant Seçimi */}
        {variants && variants.length > 0 && (
          <select
            value={selectedVariant?.id || ''}
            onChange={(e) => setSelectedVariant(variants.find((v) => v.id === e.target.value))}
            className="input-bijou text-sm py-2"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        )}

        {/* Paket Seçici + Sepete Ekle */}
        <div className="space-y-2 pt-1">

          {/* Paket Sayısı */}
          <div className="flex items-center rounded-lg border border-warm-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setPackages((p) => Math.max(1, p - 1))}
              className="flex items-center justify-center w-10 h-10 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 transition-colors flex-shrink-0"
              aria-label="Azalt"
            >
              <Minus className="w-4 h-4 text-charcoal-600" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center py-1 bg-white">
              <span className="font-sans font-700 text-base text-charcoal-800 leading-none">
                {packages}
              </span>
              <span className="text-2xs text-warm-gray-500 font-sans leading-none mt-0.5">
                {totalUnits} adet · ₺{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPackages((p) => p + 1)}
              className="flex items-center justify-center w-10 h-10 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 transition-colors flex-shrink-0"
              aria-label="Artır"
            >
              <Plus className="w-4 h-4 text-charcoal-600" />
            </button>
          </div>

          {/* Sepete Ekle */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gold hover:bg-gold-light active:bg-gold-dark text-charcoal-800 font-sans font-600 text-xs uppercase tracking-wider rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
