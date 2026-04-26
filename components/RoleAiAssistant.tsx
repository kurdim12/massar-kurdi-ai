'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Send, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { locations, Role } from '@/data/mock';
import { askMasaarAI, AiMode } from '@/lib/ai';
import { forecastAll, rankInvestmentOpportunities } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';
import { getAllOffers, getAllTenders, useMasaarStore } from '@/lib/store';

type Message = { from: 'ai' | 'you'; text: string };

const modeByRole: Record<Role, AiMode> = {
  traveller: 'traveller-chat',
  investor: 'investor-chat',
  business: 'business-chat',
  government: 'government-chat',
};

const introByRole: Record<Role, { en: string; ar: string }> = {
  traveller: {
    en: "I'm your traveller advisor. Ask me for routes, crowd timing, budgets, alternatives, or what to add to your trip.",
    ar: 'أنا مستشار المسافر. اسألني عن المسارات، أوقات الازدحام، الميزانية، البدائل، أو ما تضيفه لرحلتك.',
  },
  investor: {
    en: "I'm your investor analyst. Ask me about ROI signals, regional risk, demand gaps, and tender fit.",
    ar: 'أنا محلل المستثمر. اسألني عن إشارات العائد، مخاطر المناطق، فجوات الطلب، وملاءمة العطاءات.',
  },
  business: {
    en: "I'm your business operator. Ask me how to fill rooms, price offers, improve conversion, or respond to demand.",
    ar: 'أنا مساعد تشغيل الأعمال. اسألني كيف تملأ الغرف، وتسعر العروض، وتحسن التحويل، وتستجيب للطلب.',
  },
  government: {
    en: "I'm your ministry command advisor. Ask me about imbalance, tenders, policy actions, and national impact.",
    ar: 'أنا مستشار القيادة للوزارة. اسألني عن اختلال الطلب، العطاءات، الإجراءات السياسية، والأثر الوطني.',
  },
};

const promptByRole: Record<Role, { en: string; ar: string }[]> = {
  traveller: [
    { en: 'Plan a 4-day balanced Jordan route', ar: 'خطط رحلة متوازنة في الأردن لمدة 4 أيام' },
    { en: 'Avoid crowds in Petra and Wadi Rum', ar: 'جنبني الازدحام في البتراء ووادي رم' },
    { en: 'Best low-budget cultural route', ar: 'أفضل مسار ثقافي بميزانية منخفضة' },
    { en: 'What should I add to my trip?', ar: 'ماذا أضيف إلى رحلتي؟' },
  ],
  investor: [
    { en: 'Rank the top investment regions', ar: 'رتب أفضل مناطق الاستثمار' },
    { en: 'Explain Wadi Rum ROI risk', ar: 'اشرح مخاطر عائد وادي رم' },
    { en: 'Which tender should I apply for?', ar: 'أي عطاء يجب أن أتقدم له؟' },
    { en: 'Where is supply below demand?', ar: 'أين العرض أقل من الطلب؟' },
  ],
  business: [
    { en: 'Create a 48-hour occupancy recovery plan', ar: 'أنشئ خطة إنعاش إشغال لمدة 48 ساعة' },
    { en: 'How should I price this week?', ar: 'كيف أسعر هذا الأسبوع؟' },
    { en: 'Write an offer for empty rooms', ar: 'اكتب عرضا للغرف الفارغة' },
    { en: 'Improve booking conversion', ar: 'حسن تحويل الحجوزات' },
  ],
  government: [
    { en: 'Detect national demand imbalance', ar: 'اكشف اختلال الطلب الوطني' },
    { en: 'Recommend a tender strategy', ar: 'اقترح استراتيجية عطاءات' },
    { en: 'What policy action should we take?', ar: 'ما الإجراء السياسي المناسب؟' },
    { en: 'Summarize national impact', ar: 'لخص الأثر الوطني' },
  ],
};

const titleByRole: Record<Role, { en: string; ar: string }> = {
  traveller: { en: 'Traveller AI Advisor', ar: 'مستشار المسافر الذكي' },
  investor: { en: 'Investor AI Analyst', ar: 'محلل المستثمر الذكي' },
  business: { en: 'Business AI Operator', ar: 'مشغل الأعمال الذكي' },
  government: { en: 'Government AI Command', ar: 'قيادة الحكومة الذكية' },
};

export function RoleAiAssistant({ role }: { role: Role }) {
  const { locale, tx, pick } = useLocale();
  const pathname = usePathname();
  const cart = useMasaarStore((state) => state.cart);
  const bookings = useMasaarStore((state) => state.bookings);
  const submissions = useMasaarStore((state) => state.submissions);
  const publishedTenders = useMasaarStore((state) => state.publishedTenders);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const tenders = getAllTenders(publishedTenders);
  const offers = getAllOffers(publishedOffers);
  const forecasts = useMemo(() => forecastAll(locations, bookings), [bookings]);
  const ranked = useMemo(() => rankInvestmentOpportunities(locations, bookings), [bookings]);
  const [messages, setMessages] = useState<Message[]>([{ from: 'ai', text: tx(introByRole[role]) }]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [error, setError] = useState('');

  const context = {
    role,
    locale,
    page: pathname,
    cart: cart.map((offer) => tx(offer.title)),
    bookings: bookings.map((booking) => ({ locationId: booking.locationId, status: booking.status, nights: booking.nights, amount: booking.amount })),
    tenders: tenders.map((tender) => ({ title: tx(tender.title), locationId: tender.locationId, budgetUsd: tender.budgetUsd, deadlineDays: tender.deadlineDays, status: tender.status })),
    submissions: submissions.map((submission) => ({ title: submission.title, status: submission.status, documentsReady: submission.documentsReady })),
    offers: offers.map((offer) => ({ title: tx(offer.title), locationId: offer.locationId, price: offer.price, capacity: offer.capacity })),
    forecasts: forecasts.map((forecast) => ({
      location: tx(forecast.location.name),
      demandScore: forecast.demandScore,
      crowdLevel: forecast.crowdLevel,
      supplyGap: forecast.supplyGap,
      predictedGrowth: forecast.predictedGrowth,
      confidence: forecast.confidence,
    })),
    topInvestorRegions: ranked.slice(0, 4).map((item) => ({
      location: tx(item.location.name),
      opportunityScore: item.opportunityScore,
      riskScore: item.riskScore,
      supplyGap: item.supplyGap,
    })),
  };

  const send = async (text = draft) => {
    if (!text.trim() || loading) return;
    const userText = text.trim();
    setError('');
    setLoading(true);
    setTypingText('');
    setDraft('');
    setMessages((items) => [...items, { from: 'you', text: userText }]);

    try {
      const answer = await askMasaarAI(modeByRole[role], {
        ...context,
        prompt: userText,
        conversation: messages.slice(-6),
      });
      let index = 0;
      setTypingText('');
      await new Promise<void>((resolve) => {
        const timer = window.setInterval(() => {
          index += Math.max(2, Math.ceil(answer.length / 60));
          setTypingText(answer.slice(0, index));
          if (index >= answer.length) {
            window.clearInterval(timer);
            resolve();
          }
        }, 18);
      });
      setMessages((items) => [...items, { from: 'ai', text: answer }]);
      setTypingText('');
    } catch {
      setError(pick('AI failed safely and returned fallback guidance.', 'تعذر الاتصال بالذكاء وتم عرض إرشاد احتياطي آمن.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell role={role}>
      <section className="grid min-h-[calc(100dvh-190px)] content-between gap-6">
        <div>
          <h1 className="masaar-title flex items-center gap-2"><Sparkles className="text-[#dd6534]" /> {tx(titleByRole[role])}</h1>
          <p className="eyebrow mt-3 text-emerald-700">Gemini 1.5 Flash - {pick('Role-aware prompt engine', 'محرك أوامر حسب الدور')}</p>
          <div className="mt-4 grid gap-3">
            {messages.map((message, index) => (
              <p key={index} className={`max-w-[86%] rounded-lg border border-[var(--line)] p-4 text-sm font-semibold leading-6 ${message.from === 'you' ? 'ml-auto bg-[var(--navy)] text-[var(--cream)] rtl:ml-0 rtl:mr-auto' : 'bg-[var(--card)] text-[var(--navy)]'}`}>
                {message.text}
              </p>
            ))}
            {loading && (
              <p className="max-w-[86%] rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-bold leading-6 text-[var(--navy)]">
                {typingText || pick('Masaar is reading the forecast context...', 'مسار يقرأ سياق التوقعات...')}
              </p>
            )}
            {error && <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-bold text-[#dd6534]">{error}</p>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {promptByRole[role].map((prompt) => (
              <button key={prompt.en} onClick={() => send(tx(prompt))} className="pill">{tx(prompt)}</button>
            ))}
          </div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex items-center rounded-full bg-[#0b1320] p-2 shadow-lg">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={pick('Type your question...', 'اكتب سؤالك...')} className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-white/50" />
          <button disabled={loading} className="grid size-11 place-items-center rounded-full bg-[#8f3d2d] text-white disabled:opacity-50" aria-label={pick('Send', 'إرسال')}><Send size={18} /></button>
        </form>
      </section>
    </AppShell>
  );
}
