'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { CategoryDropdown } from '@/components/ui/CategoryDropdown';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getTotalUnits } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = mounted ? getTotalUnits() : 0;

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-ivory-300/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container-bijou">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <a
              href="/"
              className="font-display text-2xl md:text-3xl text-charcoal-800 hover:text-gold transition-colors"
            >
              ALLURE
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Kategori Dropdown */}
              <CategoryDropdown />

              {/* Diğer Linkler */}
              <a
                href="#hakkimizda"
                className="font-sans text-sm font-400 uppercase tracking-wider text-charcoal-700 hover:text-gold transition-colors"
              >
                Hakkımızda
              </a>
             
            </div>

            {/* Sepet Butonu */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-4 py-2 ml-4 bg-[#F8F4EE] border border-[#E4E0D8] hover:border-[#D4A829] rounded-full transition-all group shadow-sm"
              aria-label="Sepet"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal-700 group-hover:text-gold transition-colors" />
              <span className="font-sans font-medium text-xs md:text-sm text-charcoal-800 tracking-wider hidden sm:block">SEPETİM</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-charcoal-800 text-2xs font-sans font-bold rounded-full flex items-center justify-center shadow-sm border border-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Butonu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn-icon ml-2"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-ivory-300 z-40 md:hidden transition-transform duration-300 overflow-y-auto',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ top: '80px' }}
      >
        <nav className="p-6 space-y-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold mb-3">
            Kategoriler
          </p>
          <a
            href="#hakkimizda"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block font-sans text-lg font-400 uppercase text-charcoal-700 hover:text-gold"
          >
            Hakkımızda
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block font-sans text-lg font-400 uppercase text-charcoal-700 hover:text-gold"
          >
            İletişim
          </a>
        </nav>
      </div>

      {/* Nav Spacer */}
      <div className="h-20 md:h-24" />
    </>
  );
}
