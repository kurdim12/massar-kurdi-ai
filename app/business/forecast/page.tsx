'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Banknote, CalendarDays, Hotel, Percent } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { locations } from '@/data/mock';
import { forecastLocation } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const ForecastChart = dynamic(() => import('@/components/ForecastChart').then((module) => module.ForecastChart), { ssr: false });

export default function BusinessForecastPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const { pick } = useLocale();
  const forecast = forecastLocation(locations.find((item) => item.id === 'petra') ?? locations[0], bookings);
  const peak = forecast.points.reduce((max, point) => point.demandScore > max.demandScore ? point : max, forecast.points[0]);
  const low = forecast.points.reduce((min, point) => point.demandScore < min.demandScore ? point : min, forecast.points[0]);

  return (
    <AppShell role="business">
      <section className="grid gap-6">
        <div>
          <p className="eyebrow">Rose City Guesthouse</p>
          <h1 className="masaar-title mt-5 text-[36px]">{pick('Business Forecast', 'توقعات الأعمال')}</h1>
          <p className="muted-text mt-3 text-sm font-semibold leading-6">{pick('Occupancy, pricing, and demand actions for Rose City Guesthouse.', 'الإشغال والتسعير وإجراءات الطلب لبيت ضيافة روز سيتي.')}</p>
        </div>

        <ForecastChart forecast={forecast} />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Metric icon={CalendarDays} label={pick('Peak window', 'فترة الذروة')} value={peak.month} note={`${peak.demandScore}% demand`} />
          <Metric icon={Hotel} label={pick('Soft window', 'فترة الهدوء')} value={low.month} note={`${low.demandScore}% demand`} />
          <Metric icon={Banknote} label={pick('Suggested ADR', 'السعر المقترح')} value="68 JOD" note="+13 vs current" />
          <Metric icon={Percent} label={pick('Recovery offer', 'عرض إنعاش')} value="-18%" note="Sun-Tue only" />
        </div>

        <section className="section-line pt-5">
          <p className="eyebrow mb-4">{pick('Recommended actions', 'الإجراءات المقترحة')}</p>
          <div className="grid gap-3">
            {[
              pick('Raise base rate in March and April.', 'ارفع السعر الأساسي في مارس وأبريل.'),
              pick('Run a January flash offer for empty rooms.', 'شغل عرضا سريعا في يناير للغرف الفارغة.'),
              pick('Bundle the offer with early Petra routes to reduce crowd pressure.', 'اربط العرض بمسارات البتراء الصباحية لتقليل أثر الازدحام.'),
            ].map((item) => <p key={item} className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 text-sm font-bold leading-6">{item}</p>)}
          </div>
        </section>

        <Link href="/business/ai" className="line-button primary-button w-full">{pick('Create forecast offer', 'إنشاء عرض من التوقع')} -&gt;</Link>
      </section>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: React.ElementType; label: string; value: string; note: string }) {
  return (
    <article className="section-line py-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-[#dd6534]" size={14} />
        <p className="eyebrow">{label}</p>
      </div>
      <strong className="block text-[30px] font-black leading-none tracking-[-.06em]">{value}</strong>
      <span className="muted-text mt-2 block text-xs font-semibold">{note}</span>
    </article>
  );
}
