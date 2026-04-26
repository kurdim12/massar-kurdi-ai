'use client';

import { useState } from 'react';
import { Check, CalendarDays, UserRound, WalletCards, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { useMasaarStore } from '@/lib/store';

const tabs = ['Inbox', 'Calendar', 'Guests', 'Revenue'];

export default function BusinessBookingsPage() {
  const bookings = useMasaarStore((state) => state.bookings);
  const updateBooking = useMasaarStore((state) => state.updateBooking);
  const [tab, setTab] = useState('Inbox');
  const pending = bookings.filter((booking) => booking.status === 'pending');

  return (
    <AppShell role="business">
      <section className="grid gap-5">
        <h1 className="masaar-title">Bookings</h1>
        <div className="grid grid-cols-4 rounded-full bg-[#e5ddd5] p-1">
          {tabs.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-full py-2 text-[11px] font-black ${tab === item ? 'bg-[#fffaf5] text-[#dd6534]' : 'text-[#68758a]'}`}>{item}</button>
          ))}
        </div>

        {tab === 'Inbox' && (
          <div className="grid gap-4">
            {(pending.length ? pending : bookings).map((booking) => (
              <article key={booking.id} className="section-line py-4">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black">{booking.guest}</h2>
                    <p className="text-xs font-semibold text-[#425676]">{booking.locationId.toUpperCase()} - {booking.nights} guest(s)</p>
                  </div>
                  <span className="eyebrow text-[#dd6534]">{booking.status}</span>
                </div>
                <div className="grid grid-cols-3 text-center">
                  <div>
                    <p className="eyebrow">Check-in</p>
                    <strong className="text-xl">04-26</strong>
                  </div>
                  <div>
                    <p className="eyebrow">Check-out</p>
                    <strong className="text-xl">04-29</strong>
                  </div>
                  <div>
                    <p className="eyebrow">Nights</p>
                    <strong className="text-xl">{booking.nights}</strong>
                  </div>
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-[#d7cabd] pt-4">
                  <div>
                    <p className="eyebrow">Total</p>
                    <strong className="text-2xl">{booking.amount} <span className="text-xs">JOD</span></strong>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateBooking(booking.id, 'declined')} className="line-button min-h-0 px-4 py-2"><X size={14} /> Decline</button>
                    <button onClick={() => updateBooking(booking.id, 'accepted')} className="line-button min-h-0 px-4 py-2"><Check size={14} /> Accept</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === 'Calendar' && <Panel icon={CalendarDays} title="Month occupancy" value="34%" body="Heatmap view: Thursdays and Fridays carry the strongest demand. Keep emergency offers for Sunday to Tuesday." />}
        {tab === 'Guests' && <Panel icon={UserRound} title="Guest CRM" value={`${bookings.length}`} body="Returning guests, pending contacts, check-in, and check-out actions are grouped here for the operator." />}
        {tab === 'Revenue' && <Panel icon={WalletCards} title="Revenue" value={`${bookings.reduce((sum, item) => sum + item.amount, 0)} JOD`} body="ADR and nights are calculated from accepted and completed bookings." />}
      </section>
    </AppShell>
  );
}

function Panel({ icon: Icon, title, value, body }: { icon: React.ElementType; title: string; value: string; body: string }) {
  return (
    <article className="section-line py-6">
      <Icon className="mb-6 text-[#dd6534]" size={26} />
      <p className="eyebrow">{title}</p>
      <strong className="numeric mt-2 block">{value}</strong>
      <p className="mt-4 text-sm font-semibold leading-6 text-[#53647e]">{body}</p>
    </article>
  );
}
