'use client';

import Link from 'next/link';
import { Bot, ChevronRight, Globe2, Info, LogOut, Sparkles, Sun, UserRound } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Role } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const names: Record<Role, { en: string; ar: string }> = {
  traveller: { en: 'Layla Hassan', ar: 'ليلى حسن' },
  investor: { en: 'Khaled Amaireh', ar: 'خالد العمايرة' },
  business: { en: 'Rose City Guesthouse', ar: 'بيت ضيافة المدينة الوردية' },
  government: { en: 'Ministry Operations', ar: 'عمليات الوزارة' },
};

const actionLabels: Record<Role, { label: { en: string; ar: string }; href: string }[]> = {
  traveller: [
    { label: { en: 'Trip cart', ar: 'سلة الرحلة' }, href: '/traveller/cart' },
    { label: { en: 'AI advisor', ar: 'المساعد الذكي' }, href: '/traveller/ai' },
    { label: { en: 'Discover', ar: 'اكتشف' }, href: '/traveller' },
    { label: { en: 'Permits', ar: 'التصاريح' }, href: '/traveller' },
  ],
  investor: [
    { label: { en: 'My submissions', ar: 'طلباتي' }, href: '/investor/tenders' },
    { label: { en: 'Forecast', ar: 'التوقعات' }, href: '/investor/forecast' },
    { label: { en: 'Opportunity map', ar: 'خريطة الفرص' }, href: '/investor' },
    { label: { en: 'Tenders', ar: 'العطاءات' }, href: '/investor/tenders' },
  ],
  business: [
    { label: { en: 'Bookings', ar: 'الحجوزات' }, href: '/business/bookings' },
    { label: { en: 'Create offer', ar: 'إنشاء عرض' }, href: '/business/ai' },
    { label: { en: 'Dashboard', ar: 'لوحة التحكم' }, href: '/business' },
    { label: { en: 'AI advisor', ar: 'المساعد الذكي' }, href: '/business/ai' },
  ],
  government: [
    { label: { en: 'National map', ar: 'الخريطة الوطنية' }, href: '/government' },
    { label: { en: 'Tender admin', ar: 'إدارة العطاءات' }, href: '/government/tenders' },
    { label: { en: 'Policy panel', ar: 'لوحة السياسات' }, href: '/government' },
    { label: { en: 'Impact', ar: 'الأثر' }, href: '/government' },
  ],
};

export default function ProfilePage() {
  const role = (useMasaarStore((state) => state.role) ?? 'traveller') as Role;
  const theme = useMasaarStore((state) => state.theme);
  const toggleTheme = useMasaarStore((state) => state.toggleTheme);
  const { locale, setLocale, tx, pick, t } = useLocale();
  const cart = useMasaarStore((state) => state.cart);
  const bookings = useMasaarStore((state) => state.bookings);
  const submissions = useMasaarStore((state) => state.submissions);

  const stats = role === 'traveller'
    ? [[pick('Favourites', 'المفضلة'), 3], [pick('In trip', 'في الرحلة'), cart.length], [pick('Interests', 'الاهتمامات'), 4]]
    : role === 'investor'
      ? [[pick('Submissions', 'الطلبات'), submissions.length], [pick('Submitted', 'المقدمة'), submissions.filter((item) => item.status === 'submitted').length], [pick('Capital', 'رأس المال'), pick('Ready', 'جاهز')]]
      : role === 'business'
        ? [[pick('Bookings', 'الحجوزات'), bookings.length], [pick('Pending', 'المعلقة'), bookings.filter((item) => item.status === 'pending').length], [pick('Offers', 'العروض'), 3]]
        : [[pick('Regions', 'المناطق'), 8], [pick('Alerts', 'التنبيهات'), 3], [pick('Tenders', 'العطاءات'), 3]];

  const displayName = tx(names[role]);
  const initials = displayName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('');

  return (
    <AppShell role={role}>
      <section className="grid gap-6">
        <h1 className="masaar-title uppercase">{t('profile')}</h1>
        <section className="flex items-start gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-3xl font-black text-[#dd6534]">{initials}</div>
          <div className="min-w-0">
            <h2 className="break-words text-2xl font-black leading-none text-[#dd7332]">{displayName}</h2>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{pick('Not signed in', 'غير مسجل الدخول')}</p>
            <p className="eyebrow mt-3 text-[#dd6534]">{t(role)} <span className="mx-2 rounded-full bg-[#f3dfcf] px-2 py-1 text-[9px] text-[#8c402b]">MASAAR</span></p>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3">
          {stats.map(([label, value]) => (
            <article key={String(label)} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
              <p className="eyebrow mb-2">{label}</p>
              <strong className="block break-words text-[26px] font-black leading-none text-[var(--navy)]">{String(value)}</strong>
            </article>
          ))}
        </div>

        <section>
          <p className="eyebrow mb-3">{pick('Quick actions', 'إجراءات سريعة')}</p>
          <div className="grid grid-cols-2 gap-2">
            {actionLabels[role].map((action) => (
              <Link key={action.label.en} href={action.href} className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-3 py-3 text-sm font-black text-[var(--navy)] active:scale-[.99]">
                <Sparkles size={15} className="shrink-0 text-[#dd6534]" /> <span>{tx(action.label)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">{pick('Settings', 'الإعدادات')}</p>
          <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="flex min-h-14 w-full items-center justify-between gap-4 border-t border-[var(--line)] py-4 text-start text-[var(--navy)]">
            <span className="flex items-center gap-3 font-black"><Globe2 /> {t('language')}</span>
            <span className="text-sm font-semibold text-[var(--muted)]">{locale === 'ar' ? 'العربية' : 'English'}</span>
          </button>
          <button onClick={toggleTheme} className="flex min-h-14 w-full items-center justify-between gap-4 border-t border-[var(--line)] py-4 text-start text-[var(--navy)]">
            <span className="flex items-center gap-3 font-black"><Sun /> {t('theme')}</span>
            <span className="text-sm font-semibold text-[var(--muted)]">{theme === 'dark' ? pick('Dark', 'داكن') : pick('Light', 'فاتح')}</span>
          </button>
          <div className="flex min-h-14 w-full items-center justify-between gap-4 border-t border-[var(--line)] py-4">
            <span className="flex items-center gap-3 font-black"><Bot className="text-[#dd6534]" /> {pick('AI assistant', 'المساعد الذكي')}</span>
            <span className="text-sm font-semibold text-emerald-700">{pick('Gemini enabled', 'Gemini مفعل')}</span>
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">{pick('Account', 'الحساب')}</p>
          {[
            { label: pick('About Masaar', 'عن مسار'), icon: Info, href: '/about' },
            { label: pick('Switch role', 'تغيير الدور'), icon: UserRound, href: '/' },
            { label: pick('Sign out', 'تسجيل الخروج'), icon: LogOut, href: '/' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="flex min-h-14 items-center justify-between gap-4 border-t border-[var(--line)] py-4 font-black text-[var(--navy)]">
                <span className="flex items-center gap-3"><Icon className="text-[#dd6534]" size={19} />{item.label}</span>
                <ChevronRight size={16} className="rtl:rotate-180" />
              </Link>
            );
          })}
        </section>
        <p className="eyebrow py-6 text-center">Masaar / v0.4 / Jordan</p>
      </section>
    </AppShell>
  );
}
