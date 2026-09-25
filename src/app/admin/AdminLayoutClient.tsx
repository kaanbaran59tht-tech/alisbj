'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuth';
import { LayoutDashboard, Package, Menu, X, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const [mounted, setMounted]   = useState(false);
  const [sidebarOpen, setSidebar] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, isLoading, mounted, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Login sayfasında layout'u gösterme
  if (pathname === '/admin/login') return <>{children}</>;

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-cream-50">
      {/* ─── Sidebar ────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-charcoal-800 text-ivory-100',
          'flex flex-col transform transition-transform duration-300',
          'md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-8 border-b border-charcoal-700">
          <a href="/" className="font-display text-3xl text-gold block mb-1">ALİŞ BİJUTERİ</a>
          <p className="text-xs text-warm-gray-500 font-sans uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Navigasyon */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                'font-sans text-sm font-medium',
                pathname === href
                  ? 'bg-gold text-charcoal-800'
                  : 'text-ivory-200 hover:bg-charcoal-700'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </a>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-charcoal-700 space-y-2">
          <div className="px-4 py-2">
            <p className="text-2xs text-warm-gray-500 font-sans truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg
                       text-warm-gray-400 hover:bg-charcoal-700 hover:text-ivory-100
                       font-sans text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ─── Overlay (mobil) ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* ─── Ana İçerik ──────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobil Üst Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 bg-charcoal-800 text-ivory-100">
          <span className="font-display text-xl text-gold">ALİŞ BİJUTERİ Admin</span>
          <button onClick={() => setSidebar(!sidebarOpen)} className="btn-icon text-ivory-100">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sayfa İçeriği */}
        <main className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
