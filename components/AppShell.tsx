'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BarChart3, Bell, Bot, BriefcaseBusiness, Building2, CalendarCheck, Hotel, Landmark, Map, Plane, Search, Shield, Sparkles, UserRound, X } from 'lucide-react';
import { MasaarLogo } from '@/components/MasaarLogo';
import { Role } from '@/data/mock';
import { TranslationKey, useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const navByRole: Record<Role, { href: string; labelKey: TranslationKey; icon: React.ElementType }[]> = {
  traveller: [
    { href: '/traveller', labelKey: 'discover', icon: Plane },
    { href: '/traveller/cart', labelKey: 'trip', icon: Map },
    { href: '/traveller/ai', labelKey: 'ai', icon: Sparkles },
    { href: '/profile', labelKey: 'profile', icon: UserRound },
  ],
  investor: [
    { href: '/investor', labelKey: 'opportunities', icon: Building2 },
    { href: '/investor/forecast', labelKey: 'forecast', icon: BarChart3 },
    { href: '/investor/tenders', labelKey: 'tenders', icon: Landmark },
    { href: '/investor/ai', labelKey: 'ai', icon: Bot },
    { href: '/profile', labelKey: 'profile', icon: UserRound },
  ],
  business: [
    { href: '/business', labelKey: 'dashboard', icon: Hotel },
    { href: '/business/forecast', labelKey: 'forecast', icon: BarChart3 },
    { href: '/business/bookings', labelKey: 'bookings', icon: CalendarCheck },
    { href: '/business/ai', labelKey: 'ai', icon: Bot },
    { href: '/profile', labelKey: 'profile', icon: UserRound },
  ],
  government: [
    { href: '/government', labelKey: 'dashboard', icon: Shield },
    { href: '/government/tenders', labelKey: 'tenders', icon: BriefcaseBusiness },
    { href: '/government/ai', labelKey: 'ai', icon: Bot },
    { href: '/profile', labelKey: 'profile', icon: UserRound },
  ],
};

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir, t, pick } = useLocale();
  const theme = useMasaarStore((state) => state.theme);
  const notifications = useMasaarStore((state) => state.notifications);
  const bookings = useMasaarStore((state) => state.bookings);
  const submissions = useMasaarStore((state) => state.submissions);
  const publishedTenders = useMasaarStore((state) => state.publishedTenders);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const dismissNotification = useMasaarStore((state) => state.dismissNotification);
  const [panel, setPanel] = useState<'search' | 'notifications' | null>(null);
  const nav = navByRole[role];
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;

  const dynamicNotifications = useMemo(() => [
    ...notifications,
    ...(pendingBookings ? [{
      id: 'derived-pending-bookings',
      type: 'booking' as const,
      title: pick('Pending booking requests', 'طلبات حجز معلقة'),
      body: pick(`${pendingBookings} request(s) need action from the business owner.`, `${pendingBookings} طلب يحتاج إلى إجراء من صاحب العمل.`),
      href: '/business/bookings',
      createdAt: new Date().toISOString(),
    }] : []),
    ...(submissions.length ? [{
      id: 'derived-submissions',
      type: 'submission' as const,
      title: pick('Investor submissions received', 'تم استلام طلبات المستثمرين'),
      body: pick(`${submissions.length} tender submission(s) are visible to government.`, `${submissions.length} طلب عطاء ظاهر للحكومة.`),
      href: '/government/tenders',
      createdAt: new Date().toISOString(),
    }] : []),
    ...(publishedTenders.length ? [{
      id: 'derived-tenders',
      type: 'tender' as const,
      title: pick('Published tenders', 'عطاءات منشورة'),
      body: pick(`${publishedTenders.length} ministry tender(s) were published.`, `${publishedTenders.length} عطاء حكومي منشور.`),
      href: '/investor/tenders',
      createdAt: new Date().toISOString(),
    }] : []),
    ...(publishedOffers.length ? [{
      id: 'derived-offers',
      type: 'offer' as const,
      title: pick('Traveller offers live', 'عروض المسافرين فعالة'),
      body: pick(`${publishedOffers.length} business offer(s) are visible in discovery.`, `${publishedOffers.length} عرض من الأعمال ظاهر في الاكتشاف.`),
      href: '/traveller',
      createdAt: new Date().toISOString(),
    }] : []),
  ], [notifications, pendingBookings, pick, publishedOffers.length, publishedTenders.length, submissions.length]);

  const searchLinks = [
    { label: pick('Traveller discovery', 'اكتشاف المسافر'), href: '/traveller' },
    { label: pick('Investor forecast', 'توقعات المستثمر'), href: '/investor/forecast' },
    { label: pick('Government tenders', 'عطاءات الحكومة'), href: '/government/tenders' },
    { label: pick('Business bookings', 'حجوزات الأعمال'), href: '/business/bookings' },
    { label: pick('Traveller AI', 'مساعد المسافر'), href: '/traveller/ai' },
    { label: pick('Investor AI', 'مساعد المستثمر'), href: '/investor/ai' },
    { label: pick('Business AI', 'مساعد الأعمال'), href: '/business/ai' },
    { label: pick('Government AI', 'مساعد الحكومة'), href: '/government/ai' },
  ];

  return (
    <main dir={dir} data-theme={theme} className="masaar-app min-h-dvh overflow-x-hidden bg-[var(--cream)] text-[var(--navy)]">
      <section className="mx-auto min-h-dvh w-full max-w-full bg-[var(--surface)] sm:max-w-lg sm:border-x sm:border-[var(--line)] md:max-w-2xl">
        <header className="fixed inset-x-0 top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)]/96 px-4 py-2 pt-[calc(.55rem+env(safe-area-inset-top))] shadow-sm backdrop-blur">
          <div className="mx-auto flex min-h-14 max-w-full items-center justify-between gap-3 sm:max-w-lg md:max-w-2xl">
            <Link href="/" aria-label="MASAAR home" className="min-w-0">
              <MasaarLogo />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => setPanel('search')} className="grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] text-[var(--navy)] active:scale-95" aria-label={t('search')}><Search size={18} /></button>
              <button onClick={() => setPanel('notifications')} className="relative grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] text-[var(--navy)] active:scale-95" aria-label={t('notifications')}>
                <Bell size={18} />
                {dynamicNotifications.length > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-[#dd6534]" />}
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-5">{children}</div>

        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--surface)]/96 shadow-[0_-12px_30px_rgba(11,31,58,.08)] backdrop-blur">
          <div className={`mx-auto grid max-w-full gap-1 px-2 py-2 pb-[calc(.65rem+env(safe-area-inset-bottom))] sm:max-w-lg md:max-w-2xl ${nav.length >= 5 ? 'text-[8px] sm:text-[9px]' : 'text-[10px]'}`} style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
              return (
                <Link key={item.href} href={item.href} className={`grid min-h-[54px] place-items-center gap-1 rounded-2xl px-1 font-black uppercase tracking-[.08em] transition active:scale-95 ${active ? 'bg-[var(--navy)] text-[var(--cream)] shadow-sm' : 'text-[var(--muted)]'}`}>
                  <Icon size={18} />
                  <span className="w-full truncate text-center">{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {panel && (
          <div className="fixed inset-0 z-40 grid place-items-end bg-black/30 px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))]" onClick={() => setPanel(null)}>
            <section className="mx-auto w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-2xl sm:max-w-lg" onClick={(event) => event.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black">{panel === 'search' ? t('quickSearch') : t('notifications')}</h2>
                <button onClick={() => setPanel(null)} className="grid size-11 place-items-center rounded-2xl border border-[var(--line)] active:scale-95"><X size={17} /></button>
              </div>
              {panel === 'search' ? (
                <div className="grid gap-2">
                  {searchLinks.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setPanel(null)} className="flex min-h-12 items-center rounded-2xl border border-[var(--line)] p-3 text-sm font-black text-[var(--navy)] active:scale-[.99]">{item.label}</Link>
                  ))}
                </div>
              ) : (
                <div className="grid max-h-[55vh] gap-2 overflow-auto">
                  {dynamicNotifications.length === 0 && <p className="muted-text py-6 text-center text-sm font-bold">{pick('No notifications yet.', 'لا توجد إشعارات بعد.')}</p>}
                  {dynamicNotifications.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-[var(--line)] p-3 text-sm font-semibold leading-6">
                      <Link href={item.href} onClick={() => setPanel(null)} className="min-w-0">
                        <strong className="block text-[var(--navy)]">{item.title}</strong>
                        <span className="muted-text text-xs">{item.body}</span>
                      </Link>
                      {!item.id.startsWith('derived-') && <button onClick={() => dismissNotification(item.id)} className="grid size-9 place-items-center" aria-label="Dismiss notification"><X size={14} /></button>}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
