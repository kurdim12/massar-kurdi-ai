'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AlertTriangle, Banknote, Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { locations } from '@/data/mock';
import { rankInvestmentOpportunities } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const ForecastMap = dynamic(() => import('@/components/MapClient').then((module) => module.ForecastMap), { ssr: false });
const DemandSupplyChart = dynamic(() => import('@/components/Charts').then((module) => module.DemandSupplyChart), { ssr: false });
const ForecastChart = dynamic(() => import('@/components/ForecastChart').then((module) => module.ForecastChart), { ssr: false });

export default function InvestorForecastPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const { tx, pick } = useLocale();
  const ranked = useMemo(() => rankInvestmentOpportunities(locations, bookings), [bookings]);
  const [selectedId, setSelectedId] = useState(ranked[0]?.location.id ?? locations[0].id);
  const selected = ranked.find((item) => item.location.id === selectedId) ?? ranked[0];
  const chart = ranked.map((item) => ({ name: tx(item.location.name), demand: item.demandScore, supply: item.location.supplyScore }));
  const investmentBudget = 750000;
  const roi = Math.round(8 + selected.predictedGrowth * 0.9 + Math.max(0, selected.supplyGap) * 0.22);
  const payback = Math.max(2.1, Number((5.4 - roi / 18).toFixed(1)));

  return (
    <AppShell role="investor">
      <section className="grid gap-6">
        <div>
          <p className="eyebrow">Masaar Jordan</p>
          <h1 className="warm-accent masaar-title mt-5">{pick('Demand Forecast', 'توقعات الطلب')}</h1>
          <p className="muted-text mt-2 text-sm font-semibold leading-6">{pick('12-month AI demand model, supply gap, risk, and investment signal.', 'نموذج طلب سياحي لمدة 12 شهرا مع فجوة العرض والمخاطر وإشارة الاستثمار.')}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {ranked.map((item) => (
            <button key={item.location.id} onClick={() => setSelectedId(item.location.id)} className={`pill whitespace-nowrap ${selected.location.id === item.location.id ? 'pill-active' : ''}`}>
              {tx(item.location.name)}
            </button>
          ))}
        </div>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">{pick('Forecast model', 'نموذج التوقع')}</p>
              <h2 className="mt-2 text-3xl font-black leading-none">{tx(selected.location.name)}</h2>
            </div>
            <strong className="numeric text-[46px]">{selected.demandScore}</strong>
          </div>
          <ForecastChart forecast={selected} />
        </section>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Metric icon={TrendingUp} label={pick('Growth', 'النمو')} value={`${selected.predictedGrowth}%`} note={pick('Next season', 'الموسم القادم')} />
          <Metric icon={Building2} label={pick('Supply gap', 'فجوة العرض')} value={selected.supplyGap > 0 ? `+${selected.supplyGap}` : `${selected.supplyGap}`} note={pick('Demand minus supply', 'الطلب ناقص العرض')} />
          <Metric icon={ShieldCheck} label={pick('Confidence', 'الثقة')} value={`${selected.confidence}%`} note={pick('Model reliability', 'موثوقية النموذج')} />
          <Metric icon={Banknote} label={pick('ROI estimate', 'العائد المتوقع')} value={`${roi}%`} note={`${payback} ${pick('yr payback', 'سنة استرداد')}`} />
        </div>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">{pick('Opportunity map', 'خريطة الفرص')}</p>
            <span className="eyebrow">{pick('Imbalance', 'اختلال الطلب')}</span>
          </div>
          <ForecastMap forecasts={ranked} selectedId={selected.location.id} onSelect={setSelectedId} height={350} />
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">{pick('Recommended action', 'الإجراء المقترح')}</p>
          <article className="rounded-xl bg-[#d8742d] p-5 text-white">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.28em] text-[#69250f]"><AlertTriangle size={14} /> AI insight</p>
            <p className="text-base font-black leading-7">
              {selected.redistributionStrategy} {pick('Estimated ROI is', 'العائد المتوقع')} {roi}% {pick('on a', 'على تجربة')} {investmentBudget.toLocaleString()} JOD {pick('pilot with', 'مع')} {payback} {pick('year payback.', 'سنة استرداد.')}
            </p>
          </article>
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">{pick('Methodology', 'منهجية النموذج')}</p>
          <div className="muted-text grid gap-3 text-sm font-semibold leading-6">
            <p>{pick('Model inputs: historical seasonality, event signal, weather comfort, active bookings, base demand, and supply score.', 'مدخلات النموذج: الموسمية التاريخية، إشارة الفعاليات، راحة الطقس، الحجوزات النشطة، الطلب الأساسي، ودرجة العرض.')}</p>
            <p>{pick('Decision logic: high demand plus low supply raises opportunity; low confidence and extreme supply gaps raise risk.', 'منطق القرار: الطلب العالي مع العرض المنخفض يرفع الفرصة؛ الثقة المنخفضة وفجوات العرض الحادة ترفع المخاطر.')}</p>
          </div>
          <DemandSupplyChart data={chart} />
        </section>

        <Link href="/investor/tenders" className="line-button primary-button w-full">{pick('Open matching tenders', 'افتح العطاءات المناسبة')} -&gt;</Link>
      </section>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string | number; note: string }) {
  return (
    <article className="section-line py-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-[#dd6534]" size={14} />
        <p className="eyebrow">{label}</p>
      </div>
      <strong className="block text-[30px] font-black leading-none tracking-[-.06em] text-[var(--navy)]">{value}</strong>
      <span className="muted-text mt-2 block text-xs font-semibold">{note}</span>
    </article>
  );
}
