'use client';

import { CartDrawer } from '@/components/ui/CartDrawer';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <>
      {children}
      <CartDrawer />
      <FloatingCartButton />
      <Toaster position="top-right" />
    </>
  );
}
