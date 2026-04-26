'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Bookmark, CircleDollarSign, Landmark, ShieldAlert } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { locations } from '@/data/mock';
import { rankInvestmentOpportunities } from '@/lib/forecast';
import { useMasaarStore } from '@/lib/store';

const ForecastMap = dynamic(() => import('@/components/MapClient').then((module) => module.ForecastMap), { ssr: false });

export default function InvestorPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const ranked = rankInvestmentOpportunities(locations, bookings);
  const top = ranked[0];

  return (
    <AppShell role="investor">
      <section className="grid gap-6">
        <article className="relative min-h-[300px] overflow-hidden rounded-sm text-white">
          <img src={top.location.image} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-[#061224]/35 to-transparent" />
          <div className="relative flex min-h-[300px] flex-col justify-end p-5">
            <p className="eyebrow mb-2 text-white/70">Investment intelligence</p>
            <h1 className="text-[56px] font-black leading-[.82] tracking-[-.08em]">{top.location.name.en}</h1>
            <p className="mt-3 max-w-[290px] text-sm font-semibold text-white/88">Demand gap detected. Supply is below forecasted visitor growth.</p>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-5">
          <KpiCard icon={Landmark} label="Opportunity" value={`${top.opportunityScore}`} note="Score / 100" />
          <KpiCard icon={CircleDollarSign} label="ROI signal" value={`${top.predictedGrowth}%`} note="Projected growth" />
        </div>

        <section>
          <p className="eyebrow mb-3 text-right">Demand heatmap</p>
          <ForecastMap forecasts={ranked} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">Watchlist</p>
            <Link href="/investor/forecast" className="text-xs font-black text-[#dd6534]">Forecast -&gt;</Link>
          </div>
          <div className="grid gap-2">
            {ranked.slice(0, 2).map((item) => (
              <article key={item.location.id} className="section-line grid grid-cols-[1fr_auto] gap-3 py-4">
                <div className="flex gap-3">
                  <Bookmark className="mt-1 text-[var(--navy)]" size={14} fill="currentColor" />
                  <div>
                    <h2 className="text-lg font-black">{item.location.name.en}</h2>
                    <p className="eyebrow mt-1">Score {item.opportunityScore} - Added 2026-01-15</p>
                  </div>
                </div>
                <span className="text-xl font-black">{(item.opportunityScore / 10).toFixed(1)}</span>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow">Sites 08</p>
            <p className="eyebrow">Ranking</p>
          </div>
          <div className="grid gap-1">
            {ranked.map((item, index) => (
              <article key={item.location.id} className="section-line grid grid-cols-[44px_1fr_34px] items-center gap-3 py-4">
                <strong className="text-2xl font-black">{(item.opportunityScore / 10).toFixed(1)}</strong>
                <div>
                  <h3 className="text-lg font-black">{item.location.name.en}</h3>
                  <p className="text-xs font-semibold text-[#65738b]">{item.location.category.en}</p>
                </div>
                <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
              </article>
            ))}
          </div>
        </section>

        <Link href="/investor/tenders" className="line-button primary-button w-full">Open tenders -&gt;</Link>
      </section>
    </AppShell>
  );
}
