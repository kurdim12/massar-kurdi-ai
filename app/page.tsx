'use client';

import { useRouter } from 'next/navigation';
import { Building2, Hotel, Landmark, Plane } from 'lucide-react';
import { MasaarLogo } from '@/components/MasaarLogo';
import { Role } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const roles: {
  id: Role;
  title: { en: string; ar: string };
  kicker: { en: string; ar: string };
  body: { en: string; ar: string };
  access: { en: string; ar: string };
  href: string;
  icon: React.ElementType;
  image: string;
}[] = [
  {
    id: 'traveller',
    title: { en: 'Traveller', ar: 'المسافر' },
    kicker: { en: 'Experience', ar: 'التجربة' },
    body: { en: 'Discover Jordan with AI recommendations tailored to your interests and budget.', ar: 'اكتشف الأردن بتوصيات ذكية تناسب اهتماماتك وميزانيتك.' },
    access: { en: 'Enter as Layla Hassan', ar: 'الدخول كليلى حسن' },
    href: '/traveller',
    icon: Plane,
    image: '/places/wadi-rum.webp',
  },
  {
    id: 'investor',
    title: { en: 'Investor', ar: 'المستثمر' },
    kicker: { en: 'Intelligence', ar: 'الذكاء الاقتصادي' },
    body: { en: "Analyze Jordan's tourism market, ROI signals, and public tenders.", ar: 'حلل سوق السياحة الأردني وإشارات العائد والعطاءات الحكومية.' },
    access: { en: 'Enter as Khaled Amaireh', ar: 'الدخول كخالد العمايرة' },
    href: '/investor',
    icon: Building2,
    image: '/places/ajloun.webp',
  },
  {
    id: 'business',
    title: { en: 'Business Owner', ar: 'صاحب العمل' },
    kicker: { en: 'Business', ar: 'التشغيل' },
    body: { en: 'Grow your tourism business with flash offers, bookings, and smart analytics.', ar: 'نم عملك السياحي عبر العروض السريعة والحجوزات والتحليلات الذكية.' },
    access: { en: 'Enter as Nour Alkhatib', ar: 'الدخول كنور الخطيب' },
    href: '/business',
    icon: Hotel,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=82',
  },
  {
    id: 'government',
    title: { en: 'Government', ar: 'الحكومة' },
    kicker: { en: 'National Layer', ar: 'الطبقة الوطنية' },
    body: { en: 'Monitor tourism imbalance and publish policy actions with national indicators.', ar: 'راقب اختلال الطلب السياحي وانشر إجراءات مدعومة بالمؤشرات الوطنية.' },
    access: { en: 'Enter Ministry Office', ar: 'الدخول لمكتب الوزارة' },
    href: '/government',
    icon: Landmark,
    image: '/places/aqaba.avif',
  },
];

export default function HomePage() {
  const router = useRouter();
  const setRole = useMasaarStore((state) => state.setRole);
  const theme = useMasaarStore((state) => state.theme);
  const { locale, setLocale, dir, tx, pick, t } = useLocale();

  const choose = (role: Role, href: string) => {
    setRole(role);
    router.push(href);
  };

  return (
    <main dir={dir} data-theme={theme} className="min-h-dvh overflow-x-hidden bg-[var(--cream)] text-[var(--navy)]">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <header className="flex min-h-12 items-center justify-between gap-3">
          <MasaarLogo className="min-w-0" />
          <div className="flex shrink-0 items-center gap-2">
            <button
              className="min-h-11 rounded-full border border-[var(--line)] bg-[var(--card)] px-4 text-xs font-black uppercase tracking-[.16em] text-[var(--navy)] shadow-sm"
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            >
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              className="hidden min-h-11 rounded-full border border-[var(--line)] bg-[var(--card)] px-4 text-xs font-black uppercase tracking-[.16em] text-[var(--navy)] shadow-sm sm:inline-flex sm:items-center"
              onClick={() => choose('government', '/government')}
            >
              {t('signIn')}
            </button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-7 py-8 md:grid-cols-[.92fr_1.08fr] md:gap-10">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">{pick('Jordan National Tourism Intelligence Platform', 'منصة الأردن الوطنية لذكاء السياحة')}</p>
            <h1 className="masaar-title text-[clamp(3rem,14vw,5.7rem)] leading-[.88]">
              {pick('Intelligence tailored to every role', 'ذكاء وطني لكل دور')}
            </h1>
            <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-[var(--muted)]">
              {pick(
                'Choose a secure demo workspace for travellers, investors, business owners, or ministry teams. MASAAR opens directly into the working system.',
                'اختر مساحة عمل تجريبية للمسافرين أو المستثمرين أو أصحاب الأعمال أو فرق الوزارة. يفتح مسار مباشرة داخل النظام العامل.',
              )}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => choose(role.id, role.href)}
                  className="group relative min-h-[190px] overflow-hidden rounded-2xl text-start text-white shadow-xl shadow-black/10 transition duration-200 active:scale-[.99]"
                >
                  <img src={role.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/94 via-[#0b1f3a]/55 to-[#c87b3a]/10" />
                  <div className="relative flex min-h-[190px] flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-4">
                      <Icon size={25} className="text-[#f2c66d]" />
                      <span className="eyebrow max-w-[8rem] text-end text-[#f2c66d]">{tx(role.kicker)}</span>
                    </div>
                    <div>
                      <h2 className="text-[clamp(1.65rem,7vw,2.2rem)] font-black tracking-[-.04em] text-white">{tx(role.title)}</h2>
                      <p className="mt-2 text-sm font-semibold leading-5 text-white/90">{tx(role.body)}</p>
                      <span className="mt-5 inline-flex min-h-11 items-center text-sm font-black text-[#f2c66d]">{tx(role.access)} -&gt;</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
