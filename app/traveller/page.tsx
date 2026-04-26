'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Route, ShieldCheck, ShoppingBag, Star, UsersRound } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { locations } from '@/data/mock';
import { forecastAll } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';
import { getAllOffers, useMasaarStore } from '@/lib/store';

const ForecastMap = dynamic(() => import('@/components/MapClient').then((module) => module.ForecastMap), { ssr: false });

const filters = [
  { id: 'all', en: 'All', ar: 'الكل' },
  { id: 'cultural', en: 'Cultural', ar: 'ثقافي' },
  { id: 'nature', en: 'Nature', ar: 'طبيعة' },
  { id: 'coastal', en: 'Coastal', ar: 'ساحلي' },
  { id: 'religious', en: 'Religious', ar: 'ديني' },
];

function formatCurrency(value: number, locale: 'en' | 'ar') {
  return locale === 'ar' ? `${value} د.أ` : `${value} JOD`;
}

export default function TravellerPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const addToCart = useMasaarStore((state) => state.addToCart);
  const cart = useMasaarStore((state) => state.cart);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const { locale, tx, pick } = useLocale();
  const offers = getAllOffers(publishedOffers);
  const forecasts = useMemo(() => forecastAll(locations, bookings), [bookings]);
  const [filter, setFilter] = useState('all');
  const filteredLocations = locations.filter((location) => {
    if (filter === 'all') return true;
    if (filter === 'nature') return location.category.en.toLowerCase().includes('nature') || location.id === 'wadi-rum' || location.id === 'ajloun';
    if (filter === 'coastal') return location.id === 'aqaba' || location.id === 'dead-sea';
    if (filter === 'cultural') return ['petra', 'jerash', 'madaba', 'karak'].includes(location.id);
    if (filter === 'religious') return ['madaba', 'dead-sea', 'petra'].includes(location.id);
    return true;
  });

  return (
    <AppShell role="traveller">
      <section className="grid gap-6">
        <article className="relative min-h-[310px] overflow-hidden rounded-3xl text-white shadow-xl shadow-black/10">
          <img src={locations[1].image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-[#061224]/58 to-[#061224]/10" />
          <div className="relative flex min-h-[310px] flex-col justify-end p-5">
            <p className="eyebrow mb-2 text-[#f2c66d]">{pick('Discover Jordan', 'اكتشف الأردن')}</p>
            <h1 className="text-[clamp(3.2rem,17vw,5.4rem)] font-black leading-[.86] tracking-[-.08em] text-white">{pick('Jordan', 'الأردن')}</h1>
            <p className="mt-3 max-w-[290px] text-sm font-semibold leading-6 text-white/90">{pick('Eight destinations. A thousand stories. Tourism intelligence, curated.', 'ثماني وجهات. ألف حكاية. ذكاء سياحي منظم.')}</p>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-3">
          <KpiCard icon={Route} label={pick('Jordan Pass', 'بطاقة الأردن')} value="40+" note={pick('Sites / 70 JOD', 'موقع / 70 د.أ')} />
          <KpiCard icon={ShoppingBag} label={pick('Permits', 'التصاريح')} value="5" note={pick('Wadi Rum / Dana', 'وادي رم / ضانا')} />
        </div>

        <section className="grid gap-3">
          <ForecastMap forecasts={forecasts} />
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none]">
            {filters.map((item) => (
              <button key={item.id} onClick={() => setFilter(item.id)} className={`pill min-h-11 shrink-0 whitespace-nowrap ${filter === item.id ? 'pill-active' : ''}`}>{locale === 'ar' ? item.ar : item.en}</button>
            ))}
          </div>
          <p className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 text-[12px] font-black leading-6 tracking-[.08em] text-[var(--muted)]">
            {pick('AI insight: Wadi Rum is best from October to March for comfortable temperatures and lower crowd pressure.', 'رؤية الذكاء: وادي رم أفضل من أكتوبر إلى مارس لدرجات حرارة مريحة وضغط ازدحام أقل.')}
          </p>
        </section>

        <section className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock3, title: pick('Best time', 'أفضل وقت'), value: pick('Early morning', 'الصباح الباكر') },
              { icon: UsersRound, title: pick('Crowd strategy', 'استراتيجية الزحام'), value: pick('Use alternatives', 'استخدم البدائل') },
              { icon: ShieldCheck, title: pick('Travel safety', 'سلامة السفر'), value: pick('Verified offers', 'عروض موثقة') },
              { icon: CalendarDays, title: pick('Seasonal guide', 'دليل الموسم'), value: pick('Oct - Mar peak', 'أكتوبر - مارس') },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
                  <Icon size={20} className="mb-3 text-[#dd6534]" />
                  <p className="eyebrow mb-2">{item.title}</p>
                  <strong className="block text-lg leading-6 text-[var(--navy)]">{item.value}</strong>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="masaar-title text-[28px]">{pick('Destinations', 'الوجهات')}</h2>
            <span className="eyebrow shrink-0">{String(filteredLocations.length).padStart(2, '0')} / {String(locations.length).padStart(2, '0')}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredLocations.map((location, index) => {
              const forecast = forecasts.find((item) => item.location.id === location.id)!;
              const offer = offers.find((item) => item.locationId === location.id);
              const isAdded = cart.some((item) => item.locationId === location.id);
              return (
                <article key={location.id} className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={location.image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061224]/92 via-[#061224]/28 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="eyebrow min-w-0 text-white/75">0{index + 1} / {forecast.crowdLevel}</p>
                        <span className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-full bg-black/35 px-3 text-xs font-black text-white backdrop-blur">
                          <Star size={12} fill="white" /> {(4.5 + index / 20).toFixed(1)}
                        </span>
                      </div>
                      <h3 className="break-words text-[clamp(1.9rem,8vw,2.45rem)] font-black leading-none tracking-[-.06em] text-white">{tx(location.name)}</h3>
                    </div>
                  </div>
                  <div className="grid gap-3 p-4">
                    <p className="muted-text flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold">
                      <MapPin size={14} className="text-[#dd6534]" />
                      <span>{tx(location.category)}</span>
                      <span>/</span>
                      <span>{tx(location.governorate)}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl bg-[var(--surface)] p-2">
                        <p className="eyebrow mb-1">{pick('Demand', 'الطلب')}</p>
                        <strong>{forecast.demandScore}</strong>
                      </div>
                      <div className="rounded-2xl bg-[var(--surface)] p-2">
                        <p className="eyebrow mb-1">{pick('Growth', 'النمو')}</p>
                        <strong>{forecast.predictedGrowth}%</strong>
                      </div>
                      <div className="rounded-2xl bg-[var(--surface)] p-2">
                        <p className="eyebrow mb-1">{pick('From', 'من')}</p>
                        <strong>{offer ? formatCurrency(offer.price, locale) : pick('Open', 'مفتوح')}</strong>
                      </div>
                    </div>
                    {offer && (
                      <button onClick={() => addToCart(offer)} className="line-button primary-button w-full">
                        {isAdded ? pick('Added to trip', 'أضيفت للرحلة') : pick('Add matching offer', 'أضف العرض المناسب')}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <Link href="/traveller/ai" className="line-button primary-button w-full">{pick('Ask Masaar AI', 'اسأل ذكاء مسار')} -&gt;</Link>
      </section>
    </AppShell>
  );
}
