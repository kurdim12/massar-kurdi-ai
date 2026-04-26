'use client';

import { useEffect } from 'react';
import { useMasaarStore } from '@/lib/store';

export function AppRuntime({ children }: { children: React.ReactNode }) {
  const locale = useMasaarStore((state) => state.locale);
  const theme = useMasaarStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = theme;
  }, [locale, theme]);

  return children;
}
