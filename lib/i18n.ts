'use client';

import { LocalizedText } from '@/data/mock';
import { useMasaarStore } from '@/lib/store';

export const dictionary = {
  en: {
    platform: 'Jordan National Tourism Intelligence Platform',
    traveller: 'Traveller',
    investor: 'Investor',
    business: 'Business Owner',
    government: 'Government',
    discover: 'Discover',
    dashboard: 'Dashboard',
    forecast: 'Forecast',
    map: 'Map',
    tenders: 'Tenders',
    bookings: 'Bookings',
    profile: 'Profile',
    trip: 'Trip',
    ai: 'AI',
    opportunities: 'Opportunities',
    search: 'Search',
    quickSearch: 'Quick search',
    notifications: 'Notifications',
    theme: 'Theme',
    language: 'Language',
    signIn: 'Sign in',
    openSystem: 'Open system',
    accessProfile: 'National access',
    loading: 'Loading',
    error: 'Something went wrong. Showing safe guidance.',
  },
  ar: {
    platform: 'منصة الأردن الوطنية لذكاء السياحة',
    traveller: 'المسافر',
    investor: 'المستثمر',
    business: 'صاحب العمل',
    government: 'الحكومة',
    discover: 'اكتشف',
    dashboard: 'المؤشرات',
    forecast: 'التوقعات',
    map: 'الخريطة',
    tenders: 'العطاءات',
    bookings: 'الحجوزات',
    profile: 'الملف',
    trip: 'الرحلة',
    ai: 'الذكاء',
    opportunities: 'الفرص',
    search: 'بحث',
    quickSearch: 'بحث سريع',
    notifications: 'الإشعارات',
    theme: 'النمط',
    language: 'اللغة',
    signIn: 'تسجيل الدخول',
    openSystem: 'افتح النظام',
    accessProfile: 'دخول وطني',
    loading: 'جار التحميل',
    error: 'حدث خطأ. يتم عرض إرشاد آمن.',
  },
} as const;

export type TranslationKey = keyof typeof dictionary.en;

export function useLocale() {
  const locale = useMasaarStore((state) => state.locale);
  const setLocale = useMasaarStore((state) => state.setLocale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = (key: TranslationKey) => dictionary[locale][key] ?? key;
  const tx = (value: LocalizedText) => value[locale] || value.en;
  const pick = (en: string, ar: string) => (locale === 'ar' ? ar : en);

  return { locale, setLocale, dir, t, tx, pick };
}
