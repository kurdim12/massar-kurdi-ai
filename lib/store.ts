'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking, Locale, Offer, Role, Tender, offers, seedBookings, tenders } from '@/data/mock';

export type Submission = {
  id: string;
  tenderId: string;
  title: string;
  status: 'draft' | 'submitted';
  company?: string;
  budget?: number;
  timeline?: number;
  documentsReady?: number;
  proposalEn?: string;
  proposalAr?: string;
};

export type AppNotification = {
  id: string;
  type: 'booking' | 'tender' | 'offer' | 'forecast' | 'submission';
  title: string;
  body: string;
  href: string;
  createdAt: string;
};

const initialNotifications = [
  notify('forecast', 'Wadi Rum demand peak', 'Forecast expects a strong March demand window.', '/investor/forecast'),
];

type MasaarState = {
  locale: Locale;
  role: Role | null;
  theme: 'light' | 'dark';
  apiKey: string;
  cart: Offer[];
  bookings: Booking[];
  submissions: Submission[];
  publishedTenders: Tender[];
  publishedOffers: Offer[];
  notifications: AppNotification[];
  setLocale: (locale: Locale) => void;
  setRole: (role: Role | null) => void;
  toggleTheme: () => void;
  setApiKey: (apiKey: string) => void;
  addToCart: (offer: Offer) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: () => Booking | null;
  updateBooking: (id: string, status: Booking['status']) => void;
  addSubmission: (submission: Submission) => void;
  publishTender: (tender: Omit<Tender, 'id' | 'status'> & { status?: Tender['status'] }) => Tender;
  publishOffer: (offer: Omit<Offer, 'id'>) => Offer;
  dismissNotification: (id: string) => void;
};

function notify(type: AppNotification['type'], title: string, body: string, href: string): AppNotification {
  return {
    id: `n-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title,
    body,
    href,
    createdAt: new Date().toISOString(),
  };
}

export function getAllTenders(publishedTenders: Tender[] = []) {
  const publishedIds = new Set(publishedTenders.map((tender) => tender.id));
  return [...publishedTenders, ...tenders.filter((tender) => !publishedIds.has(tender.id))];
}

export function getAllOffers(publishedOffers: Offer[] = []) {
  const publishedIds = new Set(publishedOffers.map((offer) => offer.id));
  return [...publishedOffers, ...offers.filter((offer) => !publishedIds.has(offer.id))];
}

export const useMasaarStore = create<MasaarState>()(
  persist(
    (set, get) => ({
      locale: 'ar',
      role: null,
      theme: 'light',
      apiKey: '',
      cart: [],
      bookings: seedBookings,
      submissions: [],
      publishedTenders: [],
      publishedOffers: [],
      notifications: initialNotifications,
      setLocale: (locale) => set({ locale }),
      setRole: (role) => set({ role }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setApiKey: (apiKey) => set({ apiKey }),
      addToCart: (offer) => set((state) => ({
        cart: state.cart.some((item) => item.id === offer.id) ? state.cart : [...state.cart, offer],
        notifications: state.cart.some((item) => item.id === offer.id)
          ? state.notifications
          : [notify('offer', 'Offer added to trip', `${offer.title.en} is ready for checkout.`, '/traveller/cart'), ...state.notifications],
      })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((offer) => offer.id !== id) })),
      clearCart: () => set({ cart: [] }),
      checkout: () => {
        const { cart, bookings } = get();
        if (!cart.length) return null;
        const amount = cart.reduce((sum, offer) => sum + offer.price, 0);
        const first = cart[0];
        const booking: Booking = {
          id: `b-${Date.now()}`,
          locationId: first.locationId,
          guest: 'MASAAR Traveller',
          nights: Math.max(1, cart.length),
          amount,
          status: 'pending',
        };
        set((state) => ({
          bookings: [booking, ...bookings],
          cart: [],
          notifications: [
            notify('booking', 'New booking request', `${booking.guest} requested ${booking.nights} night(s).`, '/business/bookings'),
            ...state.notifications,
          ],
        }));
        return booking;
      },
      updateBooking: (id, status) => set((state) => ({
        bookings: state.bookings.map((booking) => booking.id === id ? { ...booking, status } : booking),
        notifications: [
          notify('booking', 'Booking updated', `Booking ${id} marked ${status}.`, '/business/bookings'),
          ...state.notifications,
        ],
      })),
      addSubmission: (submission) => set((state) => ({
        submissions: [submission, ...state.submissions],
        notifications: [
          notify('submission', submission.status === 'submitted' ? 'Tender submitted' : 'Tender draft saved', submission.title, '/investor/tenders'),
          ...state.notifications,
        ],
      })),
      publishTender: (tender) => {
        const created: Tender = {
          ...tender,
          id: `t-${Date.now()}`,
          status: tender.status ?? 'open',
        };
        set((state) => ({
          publishedTenders: [created, ...state.publishedTenders],
          notifications: [
            notify('tender', 'New government tender', created.title.en, '/investor/tenders'),
            ...state.notifications,
          ],
        }));
        return created;
      },
      publishOffer: (offer) => {
        const created: Offer = { ...offer, id: `o-${Date.now()}` };
        set((state) => ({
          publishedOffers: [created, ...state.publishedOffers],
          notifications: [
            notify('offer', 'New traveller offer', created.title.en, '/traveller'),
            ...state.notifications,
          ],
        }));
        return created;
      },
      dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((notification) => notification.id !== id),
      })),
    }),
    {
      name: 'masaar-production-state',
      version: 3,
      migrate: (persisted) => {
        const state = persisted as Partial<MasaarState>;
        return {
          ...state,
          locale: 'ar',
          notifications: initialNotifications,
          publishedTenders: [],
          publishedOffers: [],
          submissions: [],
        };
      },
    },
  ),
);
