'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CheckCircle2, Eye, Hotel, Megaphone, Percent, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const OccupancyTrendChart = dynamic(() => import('@/components/Charts').then((module) => module.OccupancyTrendChart), { ssr: false });

const trend = [
  { m: 'W1 Jan', occ: 44 }, { m: 'W3 Jan', occ: 38 }, { m: 'W1 Feb', occ: 47 }, { m: 'W3 Feb', occ: 61 }, { m: 'W1 Mar', occ: 76 }, { m: 'W3 Mar', occ: 90 },
];

export default function BusinessPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const publishedOffers = useMasaarStore((state) => state.publishedOffers);
  const { pick } = useLocale();
  const [offerStatus, setOfferStatus] = useState('');
  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const revenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <AppShell role="business">
      <section className="grid gap-6">
        <div>
          <h1 className="masaar-title uppercase">{pick('Rose City Guesthouse', 'بيت ضيافة روز سيتي')}</h1>
          <p className="eyebrow mt-6">{pick('Occupancy - Today', 'الإشغال - اليوم')}</p>
          <strong className="block text-[106px] font-black leading-[.88] tracking-[-.1em] text-[var(--navy)]">30<span className="text-[54px] tracking-[-.06em]">%</span></strong>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <KpiCard icon={Hotel} label={pick('Empty rooms', 'غرف فارغة')} value="4" />
          <KpiCard icon={Percent} label={pick('This week', 'هذا الأسبوع')} value="34%" note="+5" />
          <KpiCard icon={Megaphone} label={pick('Revenue', 'الإيراد')} value={`${revenue} JOD`} />
          <KpiCard icon={Eye} label={pick('Profile views', 'مشاهدات الملف')} value="72" />
          <KpiCard icon={Users} label={pick('Bookings', 'الحجوزات')} value={bookings.length} />
          <KpiCard icon={Hotel} label={pick('Published offers', 'العروض المنشورة')} value={publishedOffers.length} />
        </div>

        <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-[12px] font-black leading-5 tracking-[.16em] text-[var(--navy)]">
          {pick('AI - Peak season in March. Prepare early offers.', 'الذكاء - موسم الذروة في مارس. جهز العروض مبكرا.')}
        </p>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">{pick('Today action queue', 'مهام اليوم')}</p>
            <span className="eyebrow">{pending} {pick('pending', 'معلق')}</span>
          </div>
          <div className="grid gap-3">
            {[
              [pick('Accept pending guest request', 'اقبل طلب الضيف المعلق'), pick('Respond before 14:00 to protect conversion score.', 'استجب قبل 14:00 لحماية معدل التحويل.'), '/business/bookings'],
              [pick('Launch weekday recovery offer', 'أطلق عرض إنعاش منتصف الأسبوع'), pick('Fill 4 empty rooms with a 36-hour campaign.', 'املأ 4 غرف فارغة بحملة لمدة 36 ساعة.'), '/business/ai'],
              [pick('Raise March base rate', 'ارفع السعر الأساسي في مارس'), pick('Forecast shows 85% occupancy in peak window.', 'التوقعات تظهر إشغال 85% في فترة الذروة.'), '/business/forecast'],
            ].map(([title, body, href]) => (
              <Link key={title} href={href} className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
                <strong className="flex items-center gap-2 text-[var(--navy)]"><CheckCircle2 className="text-[#dd6534]" size={16} /> {title}</strong>
                <span className="muted-text mt-2 block text-xs font-semibold leading-5">{body}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-line pt-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">{pick('Demand forecast', 'توقع الطلب')}</p>
            <span className="eyebrow">12 W</span>
          </div>
          <OccupancyTrendChart data={trend} />
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="section-line py-3">
            <p className="eyebrow">{pick('Peak window', 'فترة الذروة')}</p>
            <strong className="text-2xl font-black">Mar 15 - Apr 10</strong>
            <p className="muted-text text-xs font-semibold">{pick('85% occ expected', 'إشغال متوقع 85%')}</p>
          </div>
          <div className="section-line py-3">
            <p className="eyebrow">{pick('Opportunity', 'فرصة')}</p>
            <strong className="text-2xl font-black">Jan 20 - Feb 5</strong>
            <p className="muted-text text-xs font-semibold">{pick('Launch flash', 'أطلق عرضا سريعا')}</p>
          </div>
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">{pick('Revenue controls', 'تحكم الإيرادات')}</p>
          <div className="grid grid-cols-2 gap-4">
            <Panel icon={TrendingUp} title={pick('Suggested ADR', 'السعر المقترح')} value="68 JOD" body={pick('+13 JOD vs current', '+13 دينار عن الحالي')} />
            <Panel icon={ShieldAlert} title={pick('Competitor gap', 'فجوة المنافسين')} value="-7%" body={pick('Below Petra peers', 'أقل من نظراء البتراء')} />
          </div>
        </section>

        <section className="section-line pt-5">
          <p className="eyebrow mb-5">{pick('Active offers', 'العروض النشطة')}</p>
          <article className="grid gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black">{pick('Double Room', 'غرفة مزدوجة')}</h2>
                <p className="eyebrow mt-2">{pick('2 available - 11h 30m - 47 views', '2 متاحة - 11س 30د - 47 مشاهدة')}</p>
              </div>
              <span className="eyebrow text-emerald-700">{pick('Active', 'نشط')}</span>
            </div>
            <strong className="text-[42px] font-black leading-none tracking-[-.08em]">55<span className="ml-1 text-xs tracking-normal">JOD</span></strong>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setOfferStatus(pick('Offer edit mode opened.', 'تم فتح وضع تعديل العرض.'))} className="line-button">{pick('Edit', 'تعديل')}</button>
              <button onClick={() => setOfferStatus(pick('Offer boosted in traveller discovery.', 'تم تعزيز العرض للظهور في اكتشاف المسافرين.'))} className="line-button primary-button">{pick('Boost', 'تعزيز')}</button>
            </div>
            {offerStatus && <p className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-3 text-sm font-bold text-emerald-700">{offerStatus}</p>}
          </article>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/business/ai" className="line-button primary-button">{pick('New offer', 'عرض جديد')}</Link>
          <Link href="/business/ai" className="line-button">{pick('Emergency', 'طوارئ')}</Link>
        </div>
        <Link href="/business/forecast" className="line-button primary-button w-full">{pick('Open business forecast', 'افتح توقعات الأعمال')} -&gt;</Link>
        <Link href="/business/bookings" className="line-button w-full">{pick('Open bookings', 'افتح الحجوزات')} ({pending})</Link>
      </section>
    </AppShell>
  );
}

function Panel({ icon: Icon, title, value, body }: { icon: React.ElementType; title: string; value: string; body: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
      <Icon className="mb-5 text-[#dd6534]" size={18} />
      <p className="eyebrow">{title}</p>
      <strong className="block text-3xl font-black">{value}</strong>
      <p className="muted-text mt-2 text-xs font-semibold">{body}</p>
    </div>
  );
}
