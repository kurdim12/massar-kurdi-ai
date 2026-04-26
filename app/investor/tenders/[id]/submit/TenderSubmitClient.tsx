'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, Check, FileUp, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Tender } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const docs = ['Commercial registration', 'Financial statements (last 2 years)', 'Experience portfolio', 'Tax clearance'];
const stepNames = ['Company', 'Proposal', 'Budget', 'Documents', 'Review'];

export function TenderSubmitClient({ tender }: { tender: Tender }) {
  const router = useRouter();
  const addSubmission = useMasaarStore((state) => state.addSubmission);
  const { tx, pick } = useLocale();
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('Acme Tourism Ltd.');
  const [reg, setReg] = useState('JOR-2024-8841');
  const [email, setEmail] = useState('ceo@acme.io');
  const [phone, setPhone] = useState('+962 79 000 0000');
  const [proposalAr, setProposalAr] = useState('');
  const [proposalEn, setProposalEn] = useState('');
  const [budget, setBudget] = useState(500);
  const [timeline, setTimeline] = useState(12);
  const [readyDocs, setReadyDocs] = useState<string[]>([]);
  const [validation, setValidation] = useState('');

  const title = tx(tender.title);
  const readyCount = readyDocs.length;
  const canGoNext = step < 5;
  const progress = useMemo(() => Array.from({ length: 5 }, (_, index) => index + 1 <= step), [step]);

  const generateProposal = () => {
    setProposalAr('تقترح شركة Acme Tourism Ltd. تطوير تجربة سياحية مستدامة تعزز قيمة الوجهة، وتزيد مدة إقامة الزوار، وتخلق فرص عمل محلية مع التزام واضح بمعايير البيئة والسلامة وخدمة المجتمع.');
    setProposalEn('Acme Tourism Ltd. proposes a sustainable tourism experience that increases visitor length of stay, creates local jobs, and applies clear environmental, safety, and community benefit standards.');
  };

  const validateSubmit = () => {
    if (!company.trim() || !email.trim() || !phone.trim()) {
      setStep(1);
      return pick('Complete company name, email, and phone before submitting.', 'أكمل اسم الشركة والبريد والهاتف قبل الإرسال.');
    }
    if (!proposalEn.trim() && !proposalAr.trim()) {
      setStep(2);
      return pick('Write or generate a proposal before submitting.', 'اكتب أو ولد المقترح قبل الإرسال.');
    }
    if (budget <= 0 || timeline <= 0) {
      setStep(3);
      return pick('Budget and timeline must be greater than zero.', 'يجب أن تكون الميزانية والمدة أكبر من صفر.');
    }
    if (readyCount < docs.length) {
      setStep(4);
      return pick('Upload or mark all required documents before submitting.', 'ارفع أو علم كل الوثائق المطلوبة قبل الإرسال.');
    }
    return '';
  };

  const save = (status: 'draft' | 'submitted') => {
    const issue = status === 'submitted' ? validateSubmit() : '';
    if (issue) {
      setValidation(issue);
      return;
    }
    addSubmission({
      id: `s-${Date.now()}`,
      tenderId: tender.id,
      title,
      status,
      company,
      budget,
      timeline,
      documentsReady: readyCount,
      proposalAr,
      proposalEn,
    });
    router.push('/investor/tenders?tab=mine');
  };

  return (
    <AppShell role="investor">
      <section className="grid gap-6">
        <div className="flex items-center gap-3">
          <Link href={`/investor/tenders/${tender.id}`} className="grid size-10 place-items-center rounded-lg border border-[var(--line)] bg-[var(--card)]"><ArrowLeft size={18} /></Link>
          <h1 className="masaar-title uppercase">{pick('Submit Tender', 'تقديم عطاء')}</h1>
        </div>

        <section>
          <p className="eyebrow">{pick('Tender', 'العطاء')}</p>
          <h2 className="mt-2 text-xl font-black text-[var(--navy)]">{title}</h2>
          <div className="mt-7 grid grid-cols-5 gap-1">
            {progress.map((active, index) => (
              <button key={index} onClick={() => setStep(index + 1)} className={`h-1 rounded-full ${active ? 'bg-[#d8742d]' : 'bg-[var(--line)]'}`} aria-label={`Step ${index + 1}`} />
            ))}
          </div>
        </section>

        <p className="eyebrow">{pick('Step', 'الخطوة')} {step} / 5 - {stepNames[step - 1]}</p>
        {validation && <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-bold text-[#dd6534]">{validation}</p>}

        {step === 1 && (
          <section className="grid gap-0">
            <Field label={pick('Company name *', 'اسم الشركة *')} value={company} setValue={setCompany} />
            <Field label={pick('Commercial reg. number', 'رقم السجل التجاري')} value={reg} setValue={setReg} />
            <Field label={pick('Contact email', 'البريد الإلكتروني')} value={email} setValue={setEmail} />
            <Field label={pick('Phone', 'الهاتف')} value={phone} setValue={setPhone} />
          </section>
        )}

        {step === 2 && (
          <section className="grid gap-5">
            <button onClick={generateProposal} className="line-button w-full"><Sparkles size={16} /> {pick('Draft proposal with AI', 'صياغة المقترح بالذكاء')}</button>
            <label className="section-line block py-4">
              <span className="eyebrow mb-3 block">{pick('Proposal (Arabic)', 'المقترح (العربية)')}</span>
              <textarea value={proposalAr} onChange={(event) => setProposalAr(event.target.value)} placeholder={pick('Write or generate with AI...', 'اكتب أو ولد بالذكاء...')} dir="rtl" className="min-h-[145px] w-full resize-none bg-transparent text-sm font-semibold leading-6 text-[var(--navy)] outline-none placeholder:text-[var(--muted)]" />
            </label>
            <label className="section-line block py-4">
              <span className="eyebrow mb-3 block">{pick('Proposal (English)', 'المقترح (الإنجليزية)')}</span>
              <textarea value={proposalEn} onChange={(event) => setProposalEn(event.target.value)} placeholder={pick('Write or generate with AI...', 'اكتب أو ولد بالذكاء...')} className="min-h-[125px] w-full resize-none bg-transparent text-sm font-semibold leading-6 text-[var(--navy)] outline-none placeholder:text-[var(--muted)]" />
            </label>
          </section>
        )}

        {step === 3 && (
          <section className="grid gap-0">
            <NumberField label={pick('Proposed budget (K JOD)', 'الميزانية المقترحة (ألف دينار)')} value={budget} setValue={setBudget} note={pick('Reference range: 200K - 10M JOD', 'النطاق المرجعي: 200 ألف - 10 مليون دينار')} />
            <NumberField label={pick('Timeline (months)', 'المدة (أشهر)')} value={timeline} setValue={setTimeline} />
          </section>
        )}

        {step === 4 && (
          <section className="grid gap-4">
            <p className="muted-text text-sm font-semibold">{pick('Mark documents you have ready. Upload is simulated for this local build.', 'علم الوثائق الجاهزة لديك. الرفع هنا محاكاة في النسخة المحلية.')}</p>
            <div className="grid">
              {docs.map((doc) => {
                const active = readyDocs.includes(doc);
                return (
                  <button key={doc} onClick={() => setReadyDocs((items) => active ? items.filter((item) => item !== doc) : [...items, doc])} className="section-line flex items-center gap-4 py-5 text-left rtl:text-right">
                    {active ? <Check className="text-emerald-700" /> : <FileUp className="text-[var(--muted)]" />}
                    <span>
                      <strong className="block text-base text-[var(--navy)]">{doc}</strong>
                      <span className="muted-text text-xs font-semibold">{active ? pick('Ready', 'جاهز') : pick('Tap to upload', 'اضغط للرفع')}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="muted-text text-center text-sm font-semibold">{readyCount} / 4 {pick('ready', 'جاهز')}</p>
          </section>
        )}

        {step === 5 && (
          <section className="grid gap-4">
            <Review label={pick('Company', 'الشركة')} value={company || '-'} />
            <Review label={pick('Budget / Timeline', 'الميزانية / المدة')} value={`${budget}K JOD - ${timeline} mo`} />
            <Review label={pick('Documents', 'الوثائق')} value={`${readyCount} / 4 ${pick('uploaded', 'مرفوعة')}`} />
            <Review label={pick('Proposal', 'المقترح')} value={proposalEn || proposalAr ? pick('Written', 'مكتوب') : pick('Not written yet', 'لم يكتب بعد')} />
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 pt-4">
          {step === 1 ? (
            <Link href={`/investor/tenders/${tender.id}`} className="line-button">{pick('Cancel', 'إلغاء')}</Link>
          ) : (
            <button onClick={() => setStep((value) => Math.max(1, value - 1))} className="line-button">{pick('Back', 'رجوع')}</button>
          )}
          {canGoNext ? (
            <button onClick={() => { setValidation(''); setStep((value) => Math.min(5, value + 1)); }} className="line-button">{pick('Next', 'التالي')} -&gt;</button>
          ) : (
            <button onClick={() => save('submitted')} className="line-button">{pick('Submit now', 'إرسال الآن')} -&gt;</button>
          )}
        </div>
        {step === 5 && <button onClick={() => save('draft')} className="line-button w-full">{pick('Save draft', 'حفظ مسودة')}</button>}
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

function NumberField({ label, value, setValue, note }: { label: string; value: number; setValue: (value: number) => void; note?: string }) {
  return (
    <label className="section-line block py-4">
      <span className="eyebrow block">{label}</span>
      <input type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-2 w-full bg-transparent text-[42px] font-black leading-none tracking-[-.08em] text-[var(--navy)] outline-none" />
      {note && <span className="muted-text mt-2 block text-xs font-semibold">{note}</span>}
    </label>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <article className="section-line py-4">
      <p className="eyebrow mb-2">{label}</p>
      <strong className="text-xl font-black text-[var(--navy)]">{value}</strong>
    </article>
  );
}
