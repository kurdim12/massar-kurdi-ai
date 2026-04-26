'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPinned,
  ReceiptText,
  Route,
  Send,
  Sparkles,
  Trash2,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { getAllOffers, useMasaarStore } from '@/lib/store';
import { locations, Offer } from '@/data/mock';
import { forecastLocation } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';

type PlanMode = 'balanced' | 'crowds' | 'budget' | 'hidden';

const modeCopy: Record<PlanMode, { en: string; ar: string }> = {
  balanced: {
    en: 'Balanced route: keep the current order, with early starts for high-demand sites.',
    ar: 'مسار متوازن: حافظ على الترتيب الحالي مع انطلاق مبكر للمواقع الأعلى طلبا.',
  },
  crowds: {
    en: 'Crowd-aware route: visit busy locations before 9:00 AM and move wellness/coastal stops later.',
    ar: 'مسار لتجنب الازدحام: زر المواقع المزدحمة قبل 9 صباحا وانقل محطات الاستجمام والساحل إلى وقت لاحق.',
  },
  budget: {
    en: 'Budget route: prioritize lower-cost experiences and keep premium stays to one night.',
    ar: 'مسار اقتصادي: أعط الأولوية للتجارب الأقل تكلفة واجعل الإقامات الفاخرة ليلة واحدة فقط.',
  },
  hidden: {
    en: 'Hidden gems added: route overflow toward Ajloun, Madaba, and Karak for a richer national journey.',
    ar: 'تمت إضافة الجواهر الهادئة: وجّه جزءا من الرحلة إلى عجلون ومادبا والكرك لتجربة أردنية أعمق.',
  },
};

function money(value: number) {
  return `${value} JOD`;
}

function findLocation(offer: Offer) {
  return locations.find((location) => location.id === offer.locationId) ?? locations[0];
}

export default function TripCartPage() {
  const cart = useMasaarStore((state) => state.cart);
  const bookings = useMasaarStore((state) => state.bookings);
  const checkout = useMasaarStore((state) => state.checkout);
  const removeFromCart = useMasaarStore((state) => state.removeFromCart);
  const addToCart = useMasaarStore((state) => state.addToCart);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const { tx, pick, dir } = useLocale();
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<PlanMode>('balanced');
  const [peopleByOffer, setPeopleByOffer] = useState<Record<string, number>>({});
  const [dateByOffer, setDateByOffer] = useState<Record<string, string>>({});

  const allOffers = useMemo(() => getAllOffers(publishedOffers), [publishedOffers]);
  const suggestedOffers = allOffers.filter((offer) => !cart.some((item) => item.id === offer.id)).slice(0, 4);
  const planningOffers = cart.length ? cart : suggestedOffers.slice(0, 3);
  const selectedLocations = planningOffers.map(findLocation);
  const forecasts = selectedLocations.map((location) => forecastLocation(location, bookings));
  const total = cart.reduce((sum, item) => sum + item.price * (peopleByOffer[item.id] || 1), 0);
  const averageDemand = forecasts.length ? Math.round(forecasts.reduce((sum, item) => sum + item.demandScore, 0) / forecasts.length) : 0;
  const highCrowdCount = forecasts.filter((forecast) => forecast.crowdLevel === 'high').length;
  const duration = Math.max(3, cart.length || 3);

  const itinerary = planningOffers.slice(0, 3).map((offer, index) => {
    const location = findLocation(offer);
    const forecast = forecastLocation(location, bookings);
    const early = forecast.crowdLevel === 'high' || mode === 'crowds';
    return {
      offer,
      location,
      forecast,
      day: index + 1,
      time: early ? pick('08:00 - 11:30', '08:00 - 11:30') : pick('10:30 - 15:00', '10:30 - 15:00'),
      activity: mode === 'hidden'
        ? pick(`Explore ${tx(location.name)} with a local cultural stop nearby.`, `استكشف ${tx(location.name)} مع محطة ثقافية قريبة.`)
        : pick(`${tx(offer.title)} with smart timing and transfer buffer.`, `${tx(offer.title)} مع توقيت ذكي وهامش للتنقل.`),
      warning: forecast.crowdLevel === 'high'
        ? pick('High demand window. Start early or keep a backup stop.', 'فترة طلب مرتفع. ابدأ مبكرا أو جهز محطة بديلة.')
        : forecast.crowdLevel === 'medium'
          ? pick('Moderate demand. Reserve ahead for smoother movement.', 'طلب متوسط. احجز مسبقا لتسهيل الحركة.')
          : pick('Quiet window. Good fit for relaxed exploration.', 'فترة هادئة. مناسبة لاستكشاف مريح.'),
    };
  });

  const submitCheckout = () => {
    const booking = checkout();
    setMessage(
      booking
        ? pick('Booking request sent. The business owner will see it in Bookings > Inbox.', 'تم إرسال طلب الحجز. سيظهر لصاحب العمل في الحجز > الوارد.')
        : pick('Add at least one trip item before sending a booking request.', 'أضف عنصرا واحدا على الأقل قبل إرسال طلب الحجز.'),
    );
  };

  return (
    <AppShell role="traveller">
      <section className="grid gap-5">
        <div className="flex items-center gap-3">
          <Link href="/traveller" className="grid size-11 shrink-0 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <p className="eyebrow">{pick('Traveller workspace', 'مساحة تخطيط المسافر')}</p>
            <h1 className="masaar-title">{pick('Plan your Jordan trip', 'خطط رحلتك في الأردن')}</h1>
          </div>
        </div>

        <section className="glass-card overflow-hidden rounded-[1.35rem]">
          <div className="relative min-h-[190px] p-5">
            <img
              src={selectedLocations[0]?.image || '/places/wadi-rum.webp'}
              alt={tx(selectedLocations[0]?.name || locations[0].name)}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1726]/90 via-[#0b1726]/35 to-transparent" />
            <div className="relative z-10 flex min-h-[150px] flex-col justify-end text-white">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/75">{pick('Trip overview', 'ملخص الرحلة')}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight">{pick('MASAAR Jordan Route', 'مسار الأردن')}</h2>
              <p className="mt-2 max-w-sm text-sm font-semibold text-white/85">
                {pick(modeCopy[mode].en, modeCopy[mode].ar)}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <KpiCard icon={MapPinned} label={pick('Destinations', 'الوجهات')} value={selectedLocations.length} note={selectedLocations.map((location) => tx(location.name)).join(' · ')} />
          <KpiCard icon={CalendarDays} label={pick('Duration', 'المدة')} value={pick(`${duration} days`, `${duration} أيام`)} />
          <KpiCard icon={WalletCards} label={pick('Budget', 'الميزانية')} value={cart.length ? money(total) : pick('Suggested', 'مقترحة')} />
          <KpiCard icon={AlertTriangle} label={pick('Crowd level', 'مستوى الازدحام')} value={highCrowdCount ? pick('Watch', 'تنبيه') : pick('Good', 'مناسب')} note={averageDemand ? pick(`${averageDemand}/100 demand average`, `متوسط الطلب ${averageDemand}/100`) : undefined} />
        </div>

        <section className="surface-card p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--gold)]/15 text-[var(--gold)]">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="eyebrow">{pick('AI recommendation', 'توصية الذكاء')}</p>
              <p className="mt-1 text-sm font-bold leading-6 text-[var(--navy)]">{pick(modeCopy[mode].en, modeCopy[mode].ar)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['balanced', pick('Optimize my route', 'حسّن المسار')],
              ['crowds', pick('Avoid crowds', 'تجنب الازدحام')],
              ['budget', pick('Lower my budget', 'خفّض الميزانية')],
              ['hidden', pick('Add hidden gems', 'أضف جواهر هادئة')],
            ] as [PlanMode, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`min-h-11 rounded-2xl border px-3 text-sm font-black transition active:scale-95 ${mode === key ? 'border-[var(--navy)] bg-[var(--navy)] text-[var(--cream)]' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--navy)]'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow">{pick('Itinerary builder', 'بناء البرنامج')}</p>
              <h2 className="text-xl font-black text-[var(--navy)]">{pick('Three-day smart plan', 'خطة ذكية لثلاثة أيام')}</h2>
            </div>
            <Route className="text-[var(--terracotta)]" size={22} />
          </div>

          {itinerary.map((item) => (
            <article key={`${item.offer.id}-${item.day}`} className="surface-card overflow-hidden">
              <div className="grid grid-cols-[92px_1fr] gap-3 p-3">
                <div className="relative min-h-[118px] overflow-hidden rounded-2xl">
                  <img src={item.location.image} alt={tx(item.location.name)} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="eyebrow">{pick(`Day ${item.day}`, `اليوم ${item.day}`)}</p>
                      <h3 className="mt-1 text-lg font-black leading-tight text-[var(--navy)]">{tx(item.location.name)}</h3>
                    </div>
                    {cart.some((offer) => offer.id === item.offer.id) && (
                      <button onClick={() => removeFromCart(item.offer.id)} className="grid size-10 shrink-0 place-items-center rounded-2xl border border-[var(--line)] text-[var(--terracotta)]" aria-label={pick('Remove day item', 'إزالة عنصر اليوم')}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="mt-3 grid gap-2 text-sm font-semibold text-[var(--navy)]">
                    <p className="flex items-center gap-2"><Clock3 size={15} className="text-[var(--muted)]" /> <span>{item.time}</span></p>
                    <p className="leading-6">{item.activity}</p>
                    <p className="font-black text-[var(--terracotta)]">{money(item.offer.price)}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-[var(--line)] bg-[var(--cream)]/60 px-3 py-3 text-sm font-bold text-[var(--muted)]">
                {item.warning}
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-3">
          <div>
            <p className="eyebrow">{pick('Selected places', 'العناصر المختارة')}</p>
            <h2 className="text-xl font-black text-[var(--navy)]">{cart.length ? pick('Ready for booking request', 'جاهزة لطلب الحجز') : pick('Start with suggested destinations', 'ابدأ بوجهات مقترحة')}</h2>
          </div>

          {cart.length === 0 ? (
            <div className="surface-card p-4">
              <div className="mb-4 text-center">
                <MapPinned className="mx-auto mb-3 text-[var(--olive)]" size={34} />
                <h3 className="text-xl font-black text-[var(--navy)]">{pick('Your planning board is ready', 'لوحة التخطيط جاهزة')}</h3>
                <p className="muted-text mt-2 text-sm font-semibold leading-6">
                  {pick('Choose an experience below or open Discover to build a bookable route.', 'اختر تجربة من الأسفل أو افتح صفحة الاكتشاف لبناء مسار قابل للحجز.')}
                </p>
              </div>
              <div className="grid gap-2">
                {suggestedOffers.map((offer) => {
                  const location = findLocation(offer);
                  return (
                    <button key={offer.id} onClick={() => addToCart(offer)} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 text-start active:scale-[.99]">
                      <span className="relative block size-16 overflow-hidden rounded-xl">
                        <img src={location.image} alt={tx(location.name)} className="absolute inset-0 h-full w-full object-cover" />
                      </span>
                      <span className="min-w-0">
                        <strong className="block truncate text-sm text-[var(--navy)]">{tx(offer.title)}</strong>
                        <span className="muted-text block text-xs font-bold">{tx(location.name)}</span>
                      </span>
                      <span className="text-sm font-black text-[var(--terracotta)]">{money(offer.price)}</span>
                    </button>
                  );
                })}
              </div>
              <Link href="/traveller" className="line-button mt-4 w-full">{pick('Open Traveller Discover', 'افتح اكتشاف المسافر')}</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {cart.map((offer) => {
                const location = findLocation(offer);
                return (
                  <article key={offer.id} className="surface-card p-3">
                    <div className="grid grid-cols-[74px_1fr_auto] gap-3">
                      <div className="relative min-h-[78px] overflow-hidden rounded-2xl">
                        <img src={location.image} alt={tx(location.name)} className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-base font-black leading-tight text-[var(--navy)]">{tx(offer.title)}</strong>
                        <p className="muted-text mt-1 text-xs font-bold">{tx(location.name)} · {offer.businessName}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-[var(--muted)]">
                            {pick('People', 'الأشخاص')}
                            <input
                              type="number"
                              min={1}
                              max={8}
                              value={peopleByOffer[offer.id] || 1}
                              onChange={(event) => setPeopleByOffer((state) => ({ ...state, [offer.id]: Number(event.target.value) || 1 }))}
                              className="min-h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-sm font-black text-[var(--navy)]"
                            />
                          </label>
                          <label className="grid gap-1 text-[10px] font-black uppercase tracking-[.12em] text-[var(--muted)]">
                            {pick('Date', 'التاريخ')}
                            <input
                              type="date"
                              value={dateByOffer[offer.id] || ''}
                              onChange={(event) => setDateByOffer((state) => ({ ...state, [offer.id]: event.target.value }))}
                              className="min-h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2 text-xs font-black text-[var(--navy)]"
                            />
                          </label>
                        </div>
                      </div>
                      <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                        <strong className="block text-lg text-[var(--navy)]">{money(offer.price)}</strong>
                        <button onClick={() => removeFromCart(offer.id)} className="mt-3 inline-grid size-10 place-items-center rounded-2xl border border-[var(--line)] text-[var(--terracotta)]" aria-label={pick('Remove item', 'إزالة العنصر')}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="surface-card p-4">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--terracotta)]/10 text-[var(--terracotta)]">
              <ReceiptText size={18} />
            </span>
            <div>
              <p className="eyebrow">{pick('Checkout', 'إرسال الطلب')}</p>
              <h2 className="text-xl font-black text-[var(--navy)]">{pick('Booking request summary', 'ملخص طلب الحجز')}</h2>
              <p className="muted-text mt-1 text-sm font-semibold">
                {cart.length
                  ? pick(`${cart.length} item(s), estimated total ${money(total)}.`, `${cart.length} عناصر، الإجمالي التقديري ${money(total)}.`)
                  : pick('Add a suggested experience before sending a request.', 'أضف تجربة مقترحة قبل إرسال الطلب.')}
              </p>
            </div>
          </div>
          {message && (
            <div className="mb-3 flex items-start gap-2 rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-3 text-sm font-bold text-[var(--navy)]">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--olive)]" size={18} />
              <span>{message}</span>
            </div>
          )}
          <button onClick={submitCheckout} className="line-button primary-button w-full disabled:opacity-50" disabled={!cart.length}>
            <Send size={16} /> {pick('Send booking request', 'إرسال طلب الحجز')}
          </button>
          <p className="muted-text mt-3 flex items-center gap-2 text-xs font-semibold">
            <UsersRound size={14} />
            {pick('After sending, switch to Business > Bookings to see the pending request in the demo loop.', 'بعد الإرسال، انتقل إلى الأعمال > الحجز لرؤية الطلب المعلق ضمن تجربة العرض.')}
          </p>
        </section>
      </section>
    </AppShell>
  );
}
