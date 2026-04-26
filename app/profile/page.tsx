'use client';

import Link from 'next/link';
import { Bot, ChevronRight, Globe2, Info, LogIn, Sparkles, Sun, UserRound } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Role } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

const names: Record<Role, string> = {
  traveller: 'Layla Hassan',
  investor: 'Khaled Amaireh',
  business: 'Rose City Guesthouse',
  government: 'Ministry Operations',
};

const actions: Record<Role, { label: string; href: string }[]> = {
  traveller: [
    { label: 'Trip cart', href: '/traveller/cart' },
    { label: 'AI advisor', href: '/traveller/ai' },
    { label: 'Discover', href: '/traveller' },
    { label: 'Permits', href: '/traveller' },
  ],
  investor: [
    { label: 'My submissions', href: '/investor/tenders' },
    { label: 'Forecast', href: '/investor/forecast' },
    { label: 'Opportunity map', href: '/investor' },
    { label: 'Tenders', href: '/investor/tenders' },
  ],
  business: [
    { label: 'Bookings', href: '/business/bookings' },
    { label: 'Create offer', href: '/business/ai' },
    { label: 'Dashboard', href: '/business' },
    { label: 'AI advisor', href: '/business/ai' },
  ],
  government: [
    { label: 'National map', href: '/government' },
    { label: 'Tender admin', href: '/government/tenders' },
    { label: 'Policy panel', href: '/government' },
    { label: 'Impact', href: '/government' },
  ],
};

export default function ProfilePage() {
  const role = (useMasaarStore((state) => state.role) ?? 'traveller') as Role;
  const theme = useMasaarStore((state) => state.theme);
  const toggleTheme = useMasaarStore((state) => state.toggleTheme);
  const { locale, setLocale } = useLocale();
  const cart = useMasaarStore((state) => state.cart);
  const bookings = useMasaarStore((state) => state.bookings);
  const submissions = useMasaarStore((state) => state.submissions);

  const stats = role === 'traveller'
    ? [['Favourites', 3], ['In trip', cart.length], ['Interests', 4]]
    : role === 'investor'
      ? [['Submissions', submissions.length], ['Submitted', submissions.filter((item) => item.status === 'submitted').length], ['Capital', 'Yes']]
      : role === 'business'
        ? [['Bookings', bookings.length], ['Pending', bookings.filter((item) => item.status === 'pending').length], ['Offers', 3]]
        : [['Regions', 8], ['Alerts', 3], ['Tenders', 3]];

  return (
    <AppShell role={role}>
      <section className="grid gap-6">
        <h1 className="masaar-title uppercase">Profile</h1>
        <section className="flex items-start gap-6">
          <div className="grid size-16 shrink-0 place-items-center rounded-full text-3xl font-black text-[#dd6534]">{names[role].split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black leading-none text-[#dd7332]">{names[role]}</h2>
            <p className="text-sm font-semibold text-[#425676]">Not signed in</p>
            <p className="eyebrow mt-3 text-[#dd6534]">{role} <span className="ml-2 rounded-full bg-[#f3dfcf] px-2 py-1 text-[9px]">MASAAR</span></p>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-4">
          {stats.map(([label, value]) => (
            <article key={label} className="section-line py-3">
              <p className="eyebrow">{label}</p>
              <strong className="text-[30px] font-black leading-none">{String(value)}</strong>
            </article>
          ))}
        </div>

        <section>
          <p className="eyebrow mb-3">Quick actions</p>
          <div className="grid grid-cols-2 gap-2">
            {actions[role].map((action) => (
              <Link key={action.label} href={action.href} className="section-line flex min-h-12 items-center gap-3 px-3 py-3 text-sm font-black">
                <Sparkles size={15} className="text-[#dd6534]" /> {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">Settings</p>
          <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="section-line flex w-full items-center justify-between py-4 text-left">
            <span className="flex items-center gap-3 font-black"><Globe2 /> Language</span>
            <span className="text-sm font-semibold text-[#425676]">{locale === 'ar' ? 'Arabic' : 'English'}</span>
          </button>
          <button onClick={toggleTheme} className="section-line flex w-full items-center justify-between py-4 text-left">
            <span className="flex items-center gap-3 font-black"><Sun /> Theme</span>
            <span className="text-sm font-semibold text-[#425676]">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
          <div className="section-line flex w-full items-center justify-between py-4">
            <span className="flex items-center gap-3 font-black"><Bot className="text-[#dd6534]" /> AI assistant</span>
            <span className="text-sm font-semibold text-emerald-700">Gemini enabled</span>
          </div>
        </section>

        <section>
          <p className="eyebrow mb-3">Account</p>
          {[
            ['About Masaar', Info, '/'],
            ['Switch role', UserRound, '/'],
            ['Sign in', LogIn, '/'],
          ].map(([label, Icon, href]) => (
            <Link key={label as string} href={href as string} className="section-line flex items-center justify-between py-4 font-black">
              <span className="flex items-center gap-3"><Icon className="text-[#dd6534]" size={19} />{label as string}</span>
              <ChevronRight size={16} />
            </Link>
          ))}
        </section>
        <p className="eyebrow py-6 text-center">Masaar - v0.4 - Jordan</p>
      </section>
    </AppShell>
  );
}
