'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export function FloatingCartButton() {
  const { openCart, getTotalUnits } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      // 300px scroll sonrası göster
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = mounted ? getTotalUnits() : 0;

  if (!mounted) return null;

  return (
    <button
      onClick={openCart}
      className={cn(
        'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full',
        'bg-gold hover:bg-gold-light text-charcoal-800',
        'shadow-gold-lg hover:shadow-gold-xl',
        'transition-all duration-300',
        'flex items-center justify-center',
        'md:hidden', // Sadece mobilde
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      )}
      aria-label="Sepet"
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-charcoal-800 text-ivory-100 text-2xs font-sans font-600 rounded-full flex items-center justify-center animate-gold-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
