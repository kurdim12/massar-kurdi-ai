'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Bot, Building2, Check, MapPin, Send } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { useLocale } from '@/lib/i18n';
import { getAllTenders, useMasaarStore } from '@/lib/store';

export default function InvestorTendersPage() {
  const submissions = useMasaarStore((state) => state.submissions);
  const publishedTenders = useMasaarStore((state) => state.publishedTenders);
  const { tx, pick } = useLocale();
  const [tab, setTab] = useState<'browse' | 'mine'>('browse');
  const [analysis, setAnalysis] = useState('');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (window.location.search.includes('tab=mine')) setTab('mine');
  }, []);
  const tenders = getAllTenders(publishedTenders);
  const filteredTenders = tenders.filter((tender) => {
    if (filter === 'All') return true;
    if (filter === 'Hotel') return tender.title.en.toLowerCase().includes('hotel') || tender.title.en.toLowerCase().includes('lodge');
    if (filter === 'Entertainment') return tender.locationId === 'aqaba' || tender.title.en.toLowerCase().includes('experience');
    if (filter === 'Medical') return tender.title.en.toLowerCase().includes('wellness') || tender.locationId === 'dead-sea';
    return true;
  });

  return (
    <AppShell role="investor">
      <section className="grid gap-5">
        <h1 className="masaar-title uppercase">{pick('Government Tenders', 'العطاءات الحكومية')}</h1>
        <div className="grid grid-cols-2 rounded-full bg-[var(--card)] p-1">
          <button onClick={() => setTab('browse')} className={`rounded-full py-3 text-sm font-black ${tab === 'browse' ? 'bg-[var(--surface)] text-[#dd6534]' : 'text-[var(--muted)]'}`}>{pick('Browse', 'تصفح')}</button>
          <button onClick={() => setTab('mine')} className={`rounded-full py-3 text-sm font-black ${tab === 'mine' ? 'bg-[var(--surface)] text-[#dd6534]' : 'text-[var(--muted)]'}`}>{pick('My Submissions', 'طلباتي')} ({submissions.length})</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Hotel', 'Entertainment', 'Medical'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`pill whitespace-nowrap ${filter === item ? 'pill-active' : ''}`}>{item}</button>)}
        </div>
        {notice && <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-sm font-bold text-emerald-700">{notice}</p>}

        {tab === 'browse' ? (
          <div className="grid gap-0">
            {filteredTenders.map((tender) => (
              <article key={tender.id} className="section-line grid gap-4 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/investor/tenders/${tender.id}`} className="text-xl font-black">{tx(tender.title)}</Link>
                    <p className="muted-text mt-3 text-sm font-semibold"><Building2 className="mr-1 inline" size={14} /> {tx(tender.agency)}</p>
                    <p className="muted-text mt-1 text-sm font-semibold"><MapPin className="mr-1 inline" size={14} /> {tender.locationId}</p>
                    <p className="muted-text mt-1 text-sm font-semibold">{pick('Deadline', 'الموعد النهائي')}: {tender.deadlineDays} {pick('days', 'يوم')}</p>
                  </div>
                  <button onClick={() => setNotice(pick(`Notifications enabled for ${tender.title.en}.`, `تم تفعيل الإشعارات لـ ${tender.title.ar}.`))} aria-label={`Notify me about ${tender.title.en}`}><Bell className="text-[var(--muted)] shrink-0" size={18} /></button>
                </div>
                <div className="flex items-center justify-between">
                  <strong className="text-xl font-black text-[#e9dfd4]">{Math.round(tender.budgetUsd / 1000)}K JOD</strong>
                  <Link href={`/investor/tenders/${tender.id}`} className="line-button min-h-0 px-5 py-3">
                    {pick('Apply', 'تقديم')} -&gt;
                  </Link>
                </div>
              </article>
            ))}
            <div className="section-line grid gap-3 py-5">
              <button onClick={() => setAnalysis('Fit score 84/100. Address three gaps: bank letter, environmental plan, and local employment appendix.')} className="line-button w-full">
                <Bot size={16} /> {pick('Run AI eligibility check', 'تشغيل فحص الأهلية')}
              </button>
              {analysis && <p className="rounded-lg border border-[#d7cabd] bg-[#fffaf5] p-4 text-sm font-semibold leading-6">{analysis}</p>}
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {submissions.length ? submissions.map((submission) => (
              <article key={submission.id} className="section-line grid grid-cols-[1fr_auto] py-4">
                <div>
                  <h2 className="font-black">{submission.title}</h2>
                  <p className="eyebrow mt-1">{submission.status}</p>
                </div>
                <Check className="text-emerald-700" />
              </article>
            )) : <p className="muted-text section-line py-10 text-center text-sm font-semibold">{pick('No submissions yet.', 'لا توجد طلبات بعد.')}</p>}
            <Link href="/investor/tenders/t3/submit" className="line-button primary-button"><Send size={16} /> {pick('Start proposal wizard', 'ابدأ معالج التقديم')}</Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
