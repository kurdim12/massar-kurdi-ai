'use client';

import { useState } from 'react';
import { FileText, Send, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { locations } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { getAllTenders, useMasaarStore } from '@/lib/store';

export default function GovernmentTendersPage() {
  const submissions = useMasaarStore((state) => state.submissions);
  const publishedTenders = useMasaarStore((state) => state.publishedTenders);
  const publishTender = useMasaarStore((state) => state.publishTender);
  const { tx, pick } = useLocale();
  const tenders = getAllTenders(publishedTenders);
  const [title, setTitle] = useState('Northern eco-tourism accelerator');
  const [region, setRegion] = useState('ajloun');
  const [budget, setBudget] = useState(650000);
  const [deadlineDays, setDeadlineDays] = useState(30);
  const [justification, setJustification] = useState('Forecast engine shows underutilized nature capacity, high seasonal growth, and strong redistribution value away from crowded southern icons.');
  const [message, setMessage] = useState('');

  const publish = () => {
    const location = locations.find((item) => item.id === region) ?? locations[0];
    const tender = publishTender({
      locationId: location.id,
      title: { en: title, ar: title === 'Northern eco-tourism accelerator' ? 'مسرعة السياحة البيئية في الشمال' : title },
      agency: { en: 'Ministry of Tourism', ar: 'وزارة السياحة' },
      budgetUsd: budget,
      deadlineDays,
      status: 'open',
    });
    setMessage(pick(`Tender published to investor portal: ${tender.title.en}.`, `تم نشر العطاء في بوابة المستثمرين: ${tender.title.ar}.`));
  };

  return (
    <AppShell role="government">
      <section className="grid gap-6">
        <div>
          <p className="eyebrow">{pick('Tender publishing system', 'نظام نشر العطاءات')}</p>
          <h1 className="masaar-title mt-4 text-[36px]">{pick('Government Tender Administration', 'إدارة العطاءات الحكومية')}</h1>
          <p className="muted-text mt-3 text-sm font-semibold leading-6">{pick('Publish targeted tenders from forecast gaps and monitor investor applications.', 'انشر عطاءات موجهة بناء على فجوات التوقعات وراقب طلبات المستثمرين.')}</p>
        </div>

        <section className="section-line pt-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black"><Send className="text-[#dd6534]" /> {pick('Publish targeted tender', 'نشر عطاء موجه')}</h2>
          <div className="grid gap-0">
            <Field label={pick('Tender title', 'عنوان العطاء')} value={title} setValue={setTitle} />
            <label className="section-line block py-4">
              <span className="eyebrow block">{pick('Target region', 'المنطقة المستهدفة')}</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)} className="mt-2 w-full bg-transparent text-2xl font-black text-[var(--navy)] outline-none">
                {locations.map((location) => <option key={location.id} value={location.id}>{tx(location.name)}</option>)}
              </select>
            </label>
            <NumberField label={pick('Budget (JOD)', 'الميزانية (دينار)')} value={budget} setValue={setBudget} />
            <NumberField label={pick('Deadline days', 'أيام الموعد النهائي')} value={deadlineDays} setValue={setDeadlineDays} />
            <label className="section-line block py-4">
              <span className="eyebrow block">{pick('Forecast justification', 'مبرر التوقعات')}</span>
              <textarea value={justification} onChange={(event) => setJustification(event.target.value)} className="mt-2 min-h-28 w-full resize-none bg-transparent text-sm font-semibold leading-6 text-[var(--navy)] outline-none" />
            </label>
            <button onClick={publish} className="line-button primary-button mt-4 w-full">{pick('Publish tender', 'نشر العطاء')}</button>
            {message && <p className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-bold text-emerald-700">{message}</p>}
          </div>
        </section>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-black"><FileText className="text-[#dd6534]" /> {pick('Current tenders', 'العطاءات الحالية')}</h2>
            <span className="eyebrow">{tenders.length} {pick('open', 'مفتوح')}</span>
          </div>
          <div className="grid gap-2">
            {tenders.map((tender) => (
              <article key={tender.id} className="section-line grid grid-cols-[1fr_auto] gap-3 py-4">
                <div>
                  <strong>{tx(tender.title)}</strong>
                  <p className="muted-text mt-1 text-xs font-semibold">{tx(tender.agency)} - {tender.status}</p>
                </div>
                <strong className="text-[var(--muted)]">{Math.round(tender.budgetUsd / 1000)}K</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-black"><ShieldCheck className="text-[#dd6534]" /> {pick('Investor submissions', 'طلبات المستثمرين')}</h2>
            <span className="eyebrow">{submissions.length}</span>
          </div>
          {submissions.length ? (
            <div className="grid gap-2">
              {submissions.map((submission) => (
                <article key={submission.id} className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
                  <strong>{submission.title}</strong>
                  <p className="muted-text mt-1 text-xs font-semibold">{submission.company ?? 'MASAAR company'} - {submission.status} - {submission.documentsReady ?? 0}/4 docs</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-text rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-semibold">{pick('No investor submissions yet. Submit one from Investor Tenders to see it here.', 'لا توجد طلبات مستثمرين بعد. قدم طلبا من عطاءات المستثمر لرؤيته هنا.')}</p>
          )}
        </section>
      </section>
    </AppShell>
  );
}

function Field({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="section-line block py-4">
      <span className="eyebrow block">{label}</span>
      <input value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 w-full bg-transparent text-2xl font-black text-[var(--navy)] outline-none" />
    </label>
  );
}

function NumberField({ label, value, setValue }: { label: string; value: number; setValue: (value: number) => void }) {
  return (
    <label className="section-line block py-4">
      <span className="eyebrow block">{label}</span>
      <input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full bg-transparent text-2xl font-black text-[var(--navy)] outline-none" />
    </label>
  );
}
