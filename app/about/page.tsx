'use client';

import Link from 'next/link';
import { ArrowLeft, Building2, Hotel, Landmark, Plane, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Role } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

export default function AboutPage() {
  const role = (useMasaarStore((state) => state.role) ?? 'traveller') as Role;
  const { pick } = useLocale();

  const sections = [
    {
      icon: Plane,
      title: pick('For travellers', 'للمسافرين'),
      body: pick('Masaar recommends routes, quieter alternatives, offers, permits, and timing guidance so visitors can enjoy Jordan with fewer crowd surprises.', 'يوصي مسار بالمسارات والبدائل الأقل ازدحاما والعروض والتصاريح وإرشادات التوقيت ليعيش الزائر تجربة الأردن بوضوح أكبر.'),
    },
    {
      icon: Building2,
      title: pick('For investors', 'للمستثمرين'),
      body: pick('The investor layer ranks regions by demand growth, supply gaps, risk, and tender fit, helping capital move toward underserved tourism opportunities.', 'ترتب طبقة المستثمر المناطق حسب نمو الطلب وفجوات العرض والمخاطر وملاءمة العطاءات لتوجيه رأس المال نحو فرص سياحية غير مخدومة.'),
    },
    {
      icon: Hotel,
      title: pick('For businesses', 'لأصحاب الأعمال'),
      body: pick('Tourism operators can monitor occupancy, publish offers, react to demand windows, and use AI to improve pricing and booking conversion.', 'يستطيع مشغلو السياحة مراقبة الإشغال ونشر العروض والاستجابة لنوافذ الطلب واستخدام الذكاء لتحسين التسعير والتحويل.'),
    },
    {
      icon: Landmark,
      title: pick('For government', 'للحكومة'),
      body: pick('The national layer shows tourism imbalance, economic impact, tenders, and policy recommendations for redistributing demand across Jordan.', 'تعرض الطبقة الوطنية اختلال الطلب السياحي والأثر الاقتصادي والعطاءات وتوصيات السياسات لإعادة توزيع الطلب في الأردن.'),
    },
  ];

  return (
    <AppShell role={role}>
      <section className="grid gap-6">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="grid size-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--card)] text-[var(--navy)]"><ArrowLeft size={18} className="rtl:rotate-180" /></Link>
          <h1 className="masaar-title">{pick('About Masaar', 'عن مسار')}</h1>
        </div>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--navy)] p-5 text-[var(--cream)] shadow-xl shadow-black/10">
          <Sparkles className="mb-5 text-[#c8a96a]" size={28} />
          <p className="eyebrow mb-3 text-[#c8a96a]">{pick('Jordan tourism intelligence', 'ذكاء السياحة الأردنية')}</p>
          <h2 className="text-[clamp(2.4rem,12vw,4.6rem)] font-black leading-[.88] tracking-[-.07em]">
            {pick('A national system for smarter tourism flow.', 'نظام وطني لتدفق سياحي أذكى.')}
          </h2>
          <p className="mt-5 text-sm font-semibold leading-7 text-[var(--cream)]/85">
            {pick(
              'MASAAR is a Jordan-focused tourism intelligence platform that connects traveller recommendations, investment signals, business operations, and government policy into one working system.',
              'مسار منصة ذكاء سياحي موجهة للأردن، تربط توصيات المسافرين وإشارات الاستثمار وتشغيل الأعمال والسياسات الحكومية في نظام واحد عامل.',
            )}
          </p>
        </article>

        <div className="grid gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.title} className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4">
                <Icon className="mb-4 text-[#dd6534]" size={24} />
                <h3 className="text-xl font-black text-[var(--navy)]">{section.title}</h3>
                <p className="muted-text mt-2 text-sm font-semibold leading-7">{section.body}</p>
              </article>
            );
          })}
        </div>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4">
          <p className="eyebrow mb-3">{pick('AI forecasting', 'التوقعات الذكية')}</p>
          <p className="text-sm font-semibold leading-7 text-[var(--navy)]">
            {pick(
              'The forecasting layer simulates seasonality, growth, weather comfort, events, demand scores, crowd levels, and supply gaps to recommend where travellers should go, where investors should build, where businesses should publish offers, and where government should intervene.',
              'تحاكي طبقة التوقعات الموسمية والنمو وراحة الطقس والفعاليات ودرجات الطلب ومستويات الازدحام وفجوات العرض لتوصي أين يذهب المسافرون، وأين يستثمر المستثمرون، ومتى تنشر الأعمال عروضها، وأين تتدخل الحكومة.',
            )}
          </p>
        </article>
      </section>
    </AppShell>
  );
}
