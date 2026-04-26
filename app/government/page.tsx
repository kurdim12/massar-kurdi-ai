'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AlertTriangle, Banknote, BriefcaseBusiness, Building2, CalendarCheck, Landmark, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { locations } from '@/data/mock';
import { forecastAll, rankInvestmentOpportunities } from '@/lib/forecast';
import { policyInsights } from '@/lib/ai';
import { useLocale } from '@/lib/i18n';
import { getAllTenders, useMasaarStore } from '@/lib/store';

const ForecastMap = dynamic(() => import('@/components/MapClient').then((module) => module.ForecastMap), { ssr: false });
const DemandSupplyChart = dynamic(() => import('@/components/Charts').then((module) => module.DemandSupplyChart), { ssr: false });

export default function GovernmentPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const submissions = useMasaarStore((state) => state.submissions);
  const publishedTenders = useMasaarStore((state) => state.publishedTenders);
  const { tx } = useLocale();
  const forecasts = forecastAll(locations, bookings);
  const ranked = rankInvestmentOpportunities(locations, bookings);
  const highGap = forecasts.filter((forecast) => forecast.supplyGap > 20);
  const underused = forecasts.filter((forecast) => forecast.underutilized);
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;
  const impact = bookings.reduce((sum, booking) => sum + booking.amount, 0) * 4.2;
  const insights = policyInsights(forecasts);
  const tenders = getAllTenders(publishedTenders);
  const chart = forecasts.map((forecast) => ({ name: tx(forecast.location.name), demand: forecast.demandScore, supply: forecast.location.supplyScore }));

  return (
    <AppShell role="government">
      <section className="grid gap-6">
        <div>
          <p className="eyebrow">Ministry command center</p>
          <h1 className="masaar-title mt-5 text-[38px]">National Tourism Control Layer</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#425676]">
            Full access to traveller demand, investor opportunities, business capacity, tenders, submissions, and policy recommendations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <KpiCard icon={AlertTriangle} label="High-gap" value={highGap.length} note="Needs capacity" />
          <KpiCard icon={TrendingUp} label="Underused" value={underused.length} note="Needs campaigns" />
          <KpiCard icon={Banknote} label="Impact" value={`${Math.round(impact)} JOD`} note="Simulation model" />
          <KpiCard icon={ShieldCheck} label="Confidence" value="89%" note="Policy model" />
        </div>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">National heatmap</p>
            <span className="eyebrow">All regions</span>
          </div>
          <ForecastMap forecasts={forecasts} height={360} />
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">Control access</p>
          <div className="grid grid-cols-2 gap-3">
            <Access href="/traveller" icon={Users} title="Traveller demand" body="Public discovery, cart, AI plan" />
            <Access href="/investor" icon={Building2} title="Investor layer" body="Opportunities and ROI" />
            <Access href="/business" icon={CalendarCheck} title="Business ops" body="Bookings and occupancy" />
            <Access href="/government/tenders" icon={BriefcaseBusiness} title="Tender admin" body="Publish and monitor" />
          </div>
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">Policy recommendation panel</p>
          <div className="grid gap-3">
            {insights.map((insight) => (
              <p key={insight} className="rounded-lg border border-[#d7cabd] bg-[#fffaf5] p-4 text-sm font-bold leading-6 text-[var(--navy)]">{insight}</p>
            ))}
          </div>
        </section>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">System inbox</p>
            <span className="eyebrow">Live system</span>
          </div>
          <div className="grid gap-3">
            <Inbox title={`${pendingBookings} business booking requests`} body="Operator-side requests waiting for accept/decline." href="/business/bookings" />
            <Inbox title={`${submissions.length} investor submissions`} body="Tender applications submitted or saved as drafts." href="/investor/tenders" />
            <Inbox title={`${tenders.length} open tenders`} body="Public economic instruments available to investors." href="/government/tenders" />
          </div>
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">Demand vs capacity</p>
          <DemandSupplyChart data={chart} />
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">Priority regions</p>
          <div className="grid gap-2">
            {ranked.slice(0, 4).map((item, index) => (
              <article key={item.location.id} className="grid grid-cols-[32px_1fr_auto] items-center gap-3 border-b border-[#d7cabd] py-3">
                <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong className="block text-lg">{tx(item.location.name)}</strong>
                  <span className="text-xs font-semibold text-[#65738b]">{item.redistributionStrategy}</span>
                </div>
                <strong>{item.opportunityScore}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}

function Access({ href, icon: Icon, title, body }: { href: string; icon: React.ElementType; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-lg border border-[#d7cabd] bg-[#fffaf5] p-4">
      <Icon className="mb-5 text-[#dd6534]" size={18} />
      <strong className="block text-sm">{title}</strong>
      <span className="mt-2 block text-xs font-semibold leading-5 text-[#65738b]">{body}</span>
    </Link>
  );
}

function Inbox({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-[#d7cabd] bg-[#fffaf5] p-4">
      <span>
        <strong className="block text-sm">{title}</strong>
        <span className="mt-1 block text-xs font-semibold leading-5 text-[#65738b]">{body}</span>
      </span>
      <Landmark className="text-[#dd6534]" size={17} />
    </Link>
  );
}
