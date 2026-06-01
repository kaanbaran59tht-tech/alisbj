'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { ShoppingBag, X, Plus, Minus, MessageCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

/**
 * WhatsApp siparişi mesajı oluştur
 * Paket sistemi için: N Paket = N*6 Adet
 */
function generateWhatsAppMessage(items: any[], total: number): string {
  const itemsList = items
    .map((item) => {
      const packageCount = item.quantity;
      const unitCount = item.quantity * 6;
      const variantInfo = item.selectedVariant ? ` [${item.selectedVariant.name}]` : '';
      return `• ${item.title}${variantInfo}\n  ${packageCount} Paket (${unitCount} Adet) = ₺${(
        item.packagePrice * item.quantity
      ).toFixed(2)}`;
    })
    .join('\n');

  return (
    `🛍️ *TOPTAN SİPARİŞ TALEP*\n\n` +
    `${itemsList}\n\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Toplam: ₺${total.toFixed(2)}*\n` +
    `📦 *Toplam Adet: ${items.reduce((sum, i) => sum + i.quantity * 6, 0)}*`
  );
}

/**
 * WhatsApp linki oluştur
 */
function generateWhatsAppLink(phoneNumber: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

/**
 * Sipariş Onay Modali
 */
function OrderConfirmationModal({
  isOpen,
  items,
  total,
  onClose,
}: {
  isOpen: boolean;
  items: any[];
  total: number;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const phoneNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905xxxxxxxxx';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-modal animate-fade-in">
      <div className="card-luxury max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between">
          <h3 className="font-display text-lg text-charcoal-800">
            ✅ Siparişiniz Gönderildi!
          </h3>
          <button
            onClick={onClose}
            className="btn-icon hover:bg-red-50 text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Uyarı */}
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-3">
            <p className="text-sm text-warm-gray-700 font-sans">
              Siparişiniz WhatsApp'a yönlendirildi. Eğer WhatsApp açılmadıysa,
              aşağıdaki bilgileri<strong> {phoneNumber}</strong>'ye gönderin.
            </p>
          </div>

          {/* Sipariş Detayları */}
          <div className="bg-cream-100 rounded-lg p-4 space-y-3">
            <h4 className="font-sans font-600 text-charcoal-800 text-sm">
              📋 Sipariş Detayları
            </h4>
            <div className="space-y-3 text-2xs font-sans">
              {items.map((item) => (
                <div key={item.id} className="pb-2 border-b border-warm-gray-300 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-600 text-charcoal-700">{item.title}</span>
                    <span className="font-600 text-gold">
                      ₺{(item.packagePrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {item.selectedVariant && (
                    <div className="text-warm-gray-600 mb-1">
                      Seçenek: {item.selectedVariant.name}
                    </div>
                  )}
                  <div className="text-warm-gray-600">
                    {item.quantity} Paket ({item.quantity * 6} Adet)
                  </div>
                </div>
              ))}
            </div>

            {/* Toplam */}
            <div className="pt-3 border-t border-warm-gray-400 flex items-center justify-between">
              <span className="font-sans font-600 text-charcoal-800">
                Toplam Tutar:
              </span>
              <span className="font-display text-xl font-600 text-gold">
                ₺{total.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-2xs text-warm-gray-600">
              <span className="font-sans">Toplam Adet:</span>
              <span className="font-sans font-600">
                {items.reduce((sum, i) => sum + i.quantity * 6, 0)} Adet
              </span>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-outline">
              Kapat
            </button>
            <button
              onClick={() => {
                const details = items
                  .map((item) => {
                    const var_text = item.selectedVariant
                      ? ` [${item.selectedVariant.name}]`
                      : '';
                    return (
                      `${item.title}${var_text}\n` +
                      `${item.quantity} Paket (${item.quantity * 6} Adet) = ₺${(
                        item.packagePrice * item.quantity
                      ).toFixed(2)}`
                    );
                  })
                  .join('\n\n');

                const message =
                  `SIPARIŞ DETAYLARI:\n\n${details}\n\nTOPLAM: ₺${total.toFixed(2)}`;

                navigator.clipboard.writeText(message);
                toast.success('📋 Detaylar kopyalandı!');
              }}
              className="flex-1 btn-gold"
            >
              📋 Kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sepet Drawer Bileşeni
 */
export function CartDrawer() {
  const { items, isOpen, closeCart, updatePackageQuantity, removeItem, getTotal, getTotalPackages, getTotalUnits, clearCart } = useCartStore();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const total = getTotal();
  const totalPackages = getTotalPackages();
  const totalUnits = getTotalUnits();
  const phoneNumber = (process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905xxxxxxxxx').replace(
    /\D/g,
    ''
  );

  const handleOrderClick = async () => {
    if (items.length === 0) {
      toast.error('Sepet boş');
      return;
    }

    const message = generateWhatsAppMessage(items, total);
    const whatsappLink = generateWhatsAppLink(phoneNumber, message);

    // WhatsApp'a yönlendir
    window.open(whatsappLink, '_blank');

    // Modal göster
    setTimeout(() => {
      setShowConfirmation(true);
    }, 500);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-modal-overlay transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-full max-w-md bg-ivory-300 shadow-xl transform transition-transform duration-300 z-modal flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-gray-200">
          <h2 className="font-display text-2xl text-charcoal-800">Sepet</h2>
          <button
            onClick={closeCart}
            className="btn-icon hover:bg-warm-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sepet İçeriği */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-warm-gray-300 mx-auto mb-3" />
              <p className="text-warm-gray-500 font-sans">Sepet boş</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-ivory rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Görsel */}
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                {/* Detaylar */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Başlık */}
                  <h3 className="font-sans font-600 text-charcoal-800 truncate">
                    {item.title}
                  </h3>

                  {/* Varyant */}
                  {item.selectedVariant && (
                    <p className="text-2xs text-warm-gray-500 font-sans mb-1">
                      {item.selectedVariant.name}
                    </p>
                  )}

                  {/* Fiyat */}
                  <p className="text-gold font-display font-600 text-sm mb-2">
                    ₺{item.packagePrice.toFixed(2)}/Paket
                  </p>

                  {/* Paket Kontrolleri */}
                  <div className="flex items-center gap-2">
                    {/* Eksi */}
                    <button
                      onClick={() =>
                        updatePackageQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                      className="inline-flex items-center justify-center w-6 h-6 rounded border border-warm-gray-300 hover:bg-warm-gray-200 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-warm-gray-600" />
                    </button>

                    {/* Paket Sayısı */}
                    <div className="flex-1 text-center px-2">
                      <span className="font-sans font-600 text-charcoal-700 text-sm">
                        {item.quantity}
                      </span>
                      <span className="block text-2xs text-warm-gray-500">
                        ({item.quantity * 6} adet)
                      </span>
                    </div>

                    {/* Artı */}
                    <button
                      onClick={() =>
                        updatePackageQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                      className="inline-flex items-center justify-center w-6 h-6 rounded border border-warm-gray-300 hover:bg-warm-gray-200 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-warm-gray-600" />
                    </button>

                    {/* Sil */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Sepet Boş Değilse */}
        {items.length > 0 && (
          <div className="border-t border-warm-gray-200 p-6 space-y-4 bg-ivory-200">
            {/* Özet */}
            <div className="space-y-2 text-sm font-sans">
              <div className="flex items-center justify-between">
                <span className="text-warm-gray-600">Paket Sayısı:</span>
                <span className="font-600 text-charcoal-700">{totalPackages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-warm-gray-600">Toplam Adet:</span>
                <span className="font-600 text-charcoal-700">{totalUnits}</span>
              </div>
              <div className="pt-2 border-t border-warm-gray-300 flex items-center justify-between">
                <span className="font-600 text-charcoal-800">Toplam Tutar:</span>
                <span className="font-display text-2xl font-600 text-gold">
                  ₺{total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* WhatsApp Siparişi */}
            <button
              onClick={handleOrderClick}
              className="btn-gold w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp ile Sipariş Ver
            </button>

            {/* Sepeti Boşalt */}
            <button
              onClick={clearCart}
              className="btn-outline w-full text-red-600 border-red-200 hover:border-red-600"
            >
              🗑️ Sepeti Boşalt
            </button>
          </div>
        )}
      </div>

      {/* Onay Modali */}
      <OrderConfirmationModal
        isOpen={showConfirmation}
        items={items}
        total={total}
        onClose={() => {
          setShowConfirmation(false);
          closeCart();
          clearCart();
        }}
      />

      <Toaster position="top-right" />
    </>
  );
}
