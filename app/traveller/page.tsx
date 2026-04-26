'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Route, ShoppingBag, Star } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { locations } from '@/data/mock';
import { forecastAll } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';
import { getAllOffers, useMasaarStore } from '@/lib/store';

const ForecastMap = dynamic(() => import('@/components/MapClient').then((module) => module.ForecastMap), { ssr: false });

export default function TravellerPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const addToCart = useMasaarStore((state) => state.addToCart);
  const cart = useMasaarStore((state) => state.cart);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const { tx, pick } = useLocale();
  const offers = getAllOffers(publishedOffers);
  const forecasts = forecastAll(locations, bookings);
  const [filter, setFilter] = useState('All');
  const filteredLocations = locations.filter((location) => {
    if (filter === 'All') return true;
    if (filter === 'Nature') return location.category.en.toLowerCase().includes('nature') || location.id === 'wadi-rum';
    if (filter === 'Coastal') return location.id === 'aqaba' || location.id === 'dead-sea';
    if (filter === 'Cultural') return ['petra', 'ajloun'].includes(location.id);
    if (filter === 'Religious') return location.id === 'dead-sea' || location.id === 'petra';
    return true;
  });

  return (
    <AppShell role="traveller">
      <section className="grid gap-6">
        <article className="relative min-h-[270px] overflow-hidden rounded-sm text-white">
          <img src={locations[1].image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-[#061224]/42 to-transparent" />
          <div className="relative flex min-h-[270px] flex-col justify-end p-5">
            <p className="eyebrow mb-2 text-[#c7d0df]">{pick('Discover Jordan', 'اكتشف الأردن')}</p>
            <h1 className="text-[56px] font-black leading-[.82] tracking-[-.08em]">{pick('Jordan', 'الأردن')}</h1>
            <p className="mt-3 max-w-[270px] text-sm font-semibold text-white/88">{pick('Eight destinations. A thousand stories. Tourism intelligence, curated.', 'ثماني وجهات. ألف حكاية. ذكاء سياحي منظم.')}</p>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-5">
          <KpiCard icon={Route} label={pick('Jordan Pass', 'بطاقة الأردن')} value="40+" note={pick('Sites - 70 JOD', 'موقع - 70 دينار')} />
          <KpiCard icon={ShoppingBag} label={pick('Permits', 'التصاريح')} value="5" note={pick('Wadi Rum - Dana', 'وادي رم - ضانا')} />
        </div>

        <section className="grid gap-3">
          <ForecastMap forecasts={forecasts} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Cultural', 'Nature', 'Coastal', 'Religious'].map((item) => (
              <button key={item} onClick={() => setFilter(item)} className={`pill whitespace-nowrap ${filter === item ? 'pill-active' : ''}`}>{item}</button>
            ))}
          </div>
          <p className="rounded-lg border border-[#d7cabd] bg-[#fffaf5] p-4 text-[12px] font-black leading-5 tracking-[.16em] text-[#425676]">
            {pick('AI - Wadi Rum: best Oct-Mar for comfortable temperatures.', 'الذكاء - وادي رم: أفضل فترة من أكتوبر إلى مارس لدرجات حرارة مريحة.')}
          </p>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="masaar-title text-[25px]">{pick('Destinations', 'الوجهات')}</h2>
            <span className="eyebrow">{String(filteredLocations.length).padStart(2, '0')} / {String(locations.length).padStart(2, '0')}</span>
          </div>
          <div className="grid gap-5">
            {filteredLocations.map((location, index) => {
              const forecast = forecasts.find((item) => item.location.id === location.id)!;
              return (
                <article key={location.id} className="grid gap-2">
                  <div className="relative h-[174px] overflow-hidden rounded-sm">
                    <img src={location.image} alt="" className="h-full w-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061224]/88 via-[#061224]/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="eyebrow mb-2 text-white/70">0{index + 1} - {forecast.crowdLevel}</p>
                      <h3 className="text-[34px] font-black leading-none tracking-[-.07em] text-white">{tx(location.name)}</h3>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-black text-white">
                      <Star size={12} fill="white" /> {(4.5 + index / 20).toFixed(1)}
                    </div>
                  </div>
                  <p className="muted-text text-xs font-semibold">{tx(location.category)} - {tx(location.governorate)}</p>
                  {offers.find((offer) => offer.locationId === location.id) && (
                    <button onClick={() => addToCart(offers.find((offer) => offer.locationId === location.id)!)} className="line-button w-full">
                      {cart.some((item) => item.locationId === location.id) ? pick('Added to trip', 'أضيفت للرحلة') : pick('Add matching offer', 'أضف العرض المناسب')}
                    </button>
                  )}
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
