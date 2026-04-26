'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Tender } from '@/data/mock';
import { useLocale } from '@/lib/i18n';

const requirements = [
  'Valid Jordanian commercial registration',
  'Min. 3 years sector experience',
  'Financial statements for last 2 years',
  'Tax clearance certificate',
  'Environmental & community sustainability plan',
];

export function TenderDetailClient({ tender }: { tender: Tender }) {
  const { tx, pick } = useLocale();
  const [analysis, setAnalysis] = useState('');
  const isAqaba = tender.id === 't3';

  return (
    <AppShell role="investor">
      <section className="grid gap-6">
        <div className="flex items-center gap-3">
          <Link href="/investor/tenders" className="grid size-10 place-items-center rounded-lg border border-[#d2c5b8] bg-[#fffaf5]"><ArrowLeft size={18} /></Link>
          <h1 className="masaar-title uppercase">{pick('Tender Detail', 'تفاصيل العطاء')}</h1>
        </div>

        <section>
          <p className="eyebrow mb-3">{isAqaba ? pick('Entertainment - Aqaba', 'ترفيه - العقبة') : `${tender.status} - ${tender.locationId}`}</p>
          <h2 className="text-[38px] font-black leading-[.9] tracking-[-.055em] text-[var(--navy)]">{isAqaba ? pick('Aqaba Waterfront Development', 'تطوير واجهة العقبة البحرية') : tx(tender.title)}</h2>
          <p className="muted-text mt-4 text-sm font-semibold">{isAqaba ? pick('Aqaba Special Economic Zone Authority', 'سلطة منطقة العقبة الاقتصادية الخاصة') : tx(tender.agency)}</p>
        </section>

        <div className="grid grid-cols-3 gap-4">
          <Metric label={pick('Budget', 'الميزانية')} value={isAqaba ? '2M-10M JD' : `${Math.round(tender.budgetUsd / 1000)}K JD`} />
          <Metric label={pick('Deadline', 'الموعد النهائي')} value={isAqaba ? '2026-11-01' : `${tender.deadlineDays}d`} />
          <Metric label={pick('Days left', 'الأيام المتبقية')} value={isAqaba ? '191d' : `${tender.deadlineDays}d`} />
        </div>

        <section>
          <p className="eyebrow mb-4">{pick('Requirements', 'المتطلبات')}</p>
          <div className="grid gap-3">
            {requirements.map((item) => (
              <p key={item} className="flex items-start gap-3 text-sm font-semibold leading-6 text-[var(--navy)]">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#dd6534]" size={15} /> {item}
              </p>
            ))}
          </div>
        </section>

        <section className="section-line py-5">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-black"><Sparkles className="text-[#dd6534]" /> {pick('AI Eligibility Check', 'فحص الأهلية بالذكاء')}</h3>
          <p className="muted-text text-sm font-semibold leading-6">{pick('Get an instant assessment of how well your profile matches this tender before applying.', 'احصل على تقييم فوري لمدى ملاءمة ملفك لهذا العطاء قبل التقديم.')}</p>
          <button className="line-button mt-5 w-full" onClick={() => setAnalysis(pick('Fit score 84/100. Strong match on location and sector experience. Gaps: add bank letter, environmental plan, and a stronger local employment appendix.', 'درجة الملاءمة 84/100. توافق قوي في الموقع والخبرة القطاعية. الفجوات: أضف خطابا بنكيا وخطة بيئية وملحق توظيف محلي أقوى.'))}>{pick('Run analysis', 'تشغيل التحليل')}</button>
          {analysis && <p className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-semibold leading-6 text-[var(--muted)]">{analysis}</p>}
        </section>

        <Link href={`/investor/tenders/${tender.id}/submit`} className="line-button primary-button w-full">{pick('Start submission', 'ابدأ التقديم')} -&gt;</Link>
      </section>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="section-line py-3">
      <p className="eyebrow">{label}</p>
      <strong className="block text-lg font-black leading-tight text-[var(--navy)]">{value}</strong>
    </article>
  );
}
