'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ReceiptText, Send, ShoppingBag, Trash2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { KpiCard } from '@/components/KpiCard';
import { locations } from '@/data/mock';
import { useLocale } from '@/lib/i18n';
import { useMasaarStore } from '@/lib/store';

export default function TripCartPage() {
  const cart = useMasaarStore((state) => state.cart);
  const checkout = useMasaarStore((state) => state.checkout);
  const removeFromCart = useMasaarStore((state) => state.removeFromCart);
  const { tx, pick } = useLocale();
  const [message, setMessage] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const submitCheckout = () => {
    const booking = checkout();
    setMessage(booking ? pick('Booking request sent to the Business Owner inbox.', 'تم إرسال طلب الحجز إلى صندوق صاحب العمل.') : pick('Your cart is empty.', 'سلة الرحلة فارغة.'));
  };

  return (
    <AppShell role="traveller">
      <section className="grid gap-6">
        <div className="flex items-center gap-3">
          <Link href="/traveller" className="grid size-10 place-items-center rounded-lg border border-[#d2c5b8] bg-[#fffaf5]"><ArrowLeft size={18} /></Link>
          <h1 className="masaar-title">{pick('Trip Cart', 'سلة الرحلة')}</h1>
        </div>
        {cart.length === 0 ? (
          <div className="grid min-h-[410px] place-items-center text-center">
            <div>
              <ShoppingBag className="mx-auto mb-6 text-[#536789]" size={48} />
              <h2 className="warm-accent text-2xl font-black">{message || pick('Your trip cart is empty', 'سلة الرحلة فارغة')}</h2>
              <p className="muted-text mt-3 text-sm font-semibold">{message ? pick('Switch to Business Owner > Bookings to see the pending request.', 'انتقل إلى صاحب العمل > الحجوزات لرؤية الطلب المعلق.') : pick('Add stays, permits and experiences from discover pages.', 'أضف الإقامات والتصاريح والتجارب من صفحات الاكتشاف.')}</p>
              <Link href="/traveller" className="line-button mt-7">{pick('Discover Jordan', 'اكتشف الأردن')} -&gt;</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5">
              <KpiCard icon={ShoppingBag} label={pick('Items', 'العناصر')} value={cart.length} />
              <KpiCard icon={ReceiptText} label={pick('Total', 'المجموع')} value={`${total} JOD`} />
            </div>
            <div className="grid gap-3">
              {cart.map((offer) => {
                const location = locations.find((item) => item.id === offer.locationId)!;
                return (
                  <article key={offer.id} className="section-line grid grid-cols-[1fr_auto] gap-4 py-4">
                    <div>
                      <strong className="block text-lg text-[var(--navy)]">{tx(offer.title)}</strong>
                      <p className="muted-text text-xs font-semibold">{tx(location.name)} - {offer.businessName}</p>
                    </div>
                    <div className="text-right">
                      <strong className="block text-xl text-[var(--navy)]">{offer.price}</strong>
                      <button onClick={() => removeFromCart(offer.id)} className="mt-2 inline-grid size-8 place-items-center rounded-lg border border-[var(--line)]" aria-label={pick('Remove item', 'إزالة العنصر')}><Trash2 size={14} /></button>
                    </div>
                  </article>
                );
              })}
              <button onClick={submitCheckout} className="line-button primary-button mt-3 w-full">
                <Send size={16} /> {pick('Checkout request', 'إرسال طلب الحجز')}
              </button>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
