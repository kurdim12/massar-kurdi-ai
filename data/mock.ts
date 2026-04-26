export type Role = 'traveller' | 'investor' | 'business' | 'government';
export type Locale = 'en' | 'ar';

export type LocalizedText = Record<Locale, string>;

export type Location = {
  id: string;
  name: LocalizedText;
  governorate: LocalizedText;
  category: LocalizedText;
  lat: number;
  lng: number;
  baseDemand: number;
  supplyScore: number;
  growthRate: number;
  seasonality: number[];
  events: number[];
  weatherComfort: number[];
  image: string;
};

export type Offer = {
  id: string;
  locationId: string;
  businessName: string;
  title: LocalizedText;
  price: number;
  capacity: number;
};

export type Tender = {
  id: string;
  locationId: string;
  title: LocalizedText;
  agency: LocalizedText;
  budgetUsd: number;
  deadlineDays: number;
  status: 'open' | 'review' | 'awarded';
};

export type Booking = {
  id: string;
  locationId: string;
  guest: string;
  nights: number;
  amount: number;
  status: 'pending' | 'accepted' | 'checked-in' | 'completed' | 'declined';
};

export const locations: Location[] = [
  {
    id: 'wadi-rum',
    name: { en: 'Wadi Rum', ar: 'وادي رم' },
    governorate: { en: 'Aqaba', ar: 'العقبة' },
    category: { en: 'Desert adventure', ar: 'مغامرات صحراوية' },
    lat: 29.576,
    lng: 35.42,
    baseDemand: 74,
    supplyScore: 42,
    growthRate: 0.21,
    seasonality: [46, 50, 66, 78, 84, 74, 58, 54, 72, 91, 96, 82],
    events: [2, 1, 4, 6, 8, 3, 2, 2, 5, 9, 10, 6],
    weatherComfort: [72, 78, 90, 95, 86, 62, 42, 40, 68, 92, 96, 82],
    image: '/places/wadi-rum.webp',
  },
  {
    id: 'petra',
    name: { en: 'Petra', ar: 'البتراء' },
    governorate: { en: "Ma'an", ar: 'معان' },
    category: { en: 'World heritage', ar: 'تراث عالمي' },
    lat: 30.3285,
    lng: 35.4444,
    baseDemand: 82,
    supplyScore: 58,
    growthRate: 0.16,
    seasonality: [55, 61, 76, 88, 94, 82, 70, 68, 86, 98, 99, 88],
    events: [2, 3, 5, 8, 9, 5, 3, 2, 6, 9, 10, 6],
    weatherComfort: [76, 82, 94, 96, 88, 60, 44, 42, 72, 94, 96, 84],
    image: 'https://images.unsplash.com/photo-1580834341580-8c17a3a630ca?auto=format&fit=crop&w=1400&q=82',
  },
  {
    id: 'ajloun',
    name: { en: 'Ajloun', ar: 'عجلون' },
    governorate: { en: 'Ajloun', ar: 'عجلون' },
    category: { en: 'Nature and forests', ar: 'طبيعة وغابات' },
    lat: 32.333,
    lng: 35.752,
    baseDemand: 48,
    supplyScore: 27,
    growthRate: 0.19,
    seasonality: [38, 42, 56, 71, 82, 76, 64, 61, 72, 78, 66, 48],
    events: [1, 1, 3, 6, 7, 4, 3, 2, 5, 6, 3, 1],
    weatherComfort: [56, 60, 72, 86, 94, 88, 74, 72, 88, 92, 78, 62],
    image: '/places/ajloun.webp',
  },
  {
    id: 'dead-sea',
    name: { en: 'Dead Sea', ar: 'البحر الميت' },
    governorate: { en: 'Balqa', ar: 'البلقاء' },
    category: { en: 'Wellness', ar: 'استجمام وعلاج' },
    lat: 31.559,
    lng: 35.473,
    baseDemand: 67,
    supplyScore: 64,
    growthRate: 0.08,
    seasonality: [66, 68, 74, 82, 86, 78, 70, 68, 78, 88, 84, 72],
    events: [1, 1, 2, 5, 6, 3, 2, 2, 4, 7, 4, 2],
    weatherComfort: [70, 76, 88, 82, 66, 42, 28, 28, 58, 84, 88, 76],
    image: '/places/dead-sea.jpg',
  },
  {
    id: 'aqaba',
    name: { en: 'Aqaba', ar: 'العقبة' },
    governorate: { en: 'Aqaba', ar: 'العقبة' },
    category: { en: 'Red Sea coast', ar: 'ساحل البحر الأحمر' },
    lat: 29.532,
    lng: 35.006,
    baseDemand: 70,
    supplyScore: 62,
    growthRate: 0.13,
    seasonality: [72, 74, 78, 82, 86, 92, 96, 97, 86, 82, 76, 72],
    events: [3, 2, 4, 5, 6, 8, 9, 9, 5, 4, 3, 3],
    weatherComfort: [82, 84, 88, 84, 72, 52, 36, 34, 62, 82, 88, 84],
    image: '/places/aqaba.avif',
  },
  {
    id: 'jerash',
    name: { en: 'Jerash', ar: 'جرش' },
    governorate: { en: 'Jerash', ar: 'جرش' },
    category: { en: 'Roman heritage', ar: 'تراث روماني' },
    lat: 32.2747,
    lng: 35.8914,
    baseDemand: 54,
    supplyScore: 34,
    growthRate: 0.14,
    seasonality: [42, 46, 61, 78, 86, 72, 62, 60, 76, 84, 68, 48],
    events: [1, 2, 3, 5, 7, 5, 6, 6, 5, 4, 2, 1],
    weatherComfort: [58, 63, 76, 88, 94, 82, 66, 65, 84, 92, 76, 60],
    image: '/places/jerash.jpg',
  },
  {
    id: 'madaba',
    name: { en: 'Madaba', ar: 'مادبا' },
    governorate: { en: 'Madaba', ar: 'مادبا' },
    category: { en: 'Mosaics and faith', ar: 'فسيفساء وسياحة دينية' },
    lat: 31.716,
    lng: 35.793,
    baseDemand: 46,
    supplyScore: 31,
    growthRate: 0.12,
    seasonality: [40, 43, 55, 68, 76, 67, 58, 55, 69, 77, 62, 46],
    events: [1, 1, 2, 4, 5, 3, 2, 2, 4, 5, 2, 1],
    weatherComfort: [62, 68, 82, 90, 88, 64, 48, 47, 76, 90, 82, 68],
    image: '/places/madaba.jpg',
  },
  {
    id: 'karak',
    name: { en: 'Karak', ar: 'الكرك' },
    governorate: { en: 'Karak', ar: 'الكرك' },
    category: { en: 'Castles and highlands', ar: 'قلاع ومرتفعات' },
    lat: 31.1853,
    lng: 35.7047,
    baseDemand: 44,
    supplyScore: 25,
    growthRate: 0.18,
    seasonality: [36, 39, 52, 66, 72, 68, 61, 58, 70, 74, 59, 42],
    events: [1, 1, 2, 3, 4, 3, 2, 2, 4, 5, 2, 1],
    weatherComfort: [60, 65, 80, 90, 92, 76, 58, 56, 82, 90, 78, 64],
    image: 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=1400&q=82',
  },
];

export const offers: Offer[] = [
  { id: 'o1', locationId: 'wadi-rum', businessName: 'Rum Sky Camp', title: { en: 'Stargazing camp night', ar: 'ليلة تخييم ومراقبة نجوم' }, price: 92, capacity: 14 },
  { id: 'o2', locationId: 'petra', businessName: 'Petra Routes', title: { en: 'Early Siq heritage walk', ar: 'مسار السيق التراثي صباحا' }, price: 64, capacity: 18 },
  { id: 'o3', locationId: 'ajloun', businessName: 'Ajloun Forest Lodge', title: { en: 'Forest cabin weekend', ar: 'عطلة أكواخ الغابة' }, price: 58, capacity: 10 },
  { id: 'o4', locationId: 'dead-sea', businessName: 'Salt Recovery Spa', title: { en: 'Recovery day pass', ar: 'تذكرة يوم استجمام' }, price: 110, capacity: 20 },
  { id: 'o5', locationId: 'aqaba', businessName: 'Aqaba Reef Club', title: { en: 'Reef discovery pass', ar: 'تذكرة اكتشاف الشعاب' }, price: 78, capacity: 16 },
  { id: 'o6', locationId: 'jerash', businessName: 'Jerash Heritage Walks', title: { en: 'Roman city guided walk', ar: 'جولة المدينة الرومانية' }, price: 36, capacity: 22 },
  { id: 'o7', locationId: 'madaba', businessName: 'Mosaic House', title: { en: 'Mosaic studio visit', ar: 'زيارة مشغل الفسيفساء' }, price: 28, capacity: 12 },
  { id: 'o8', locationId: 'karak', businessName: 'Karak Castle Trail', title: { en: 'Castle sunset route', ar: 'مسار القلعة وقت الغروب' }, price: 42, capacity: 15 },
];

export const tenders: Tender[] = [
  { id: 't1', locationId: 'ajloun', title: { en: 'Northern eco-lodge concession', ar: 'امتياز نزل بيئي في الشمال' }, agency: { en: 'Ministry of Tourism', ar: 'وزارة السياحة' }, budgetUsd: 420000, deadlineDays: 18, status: 'open' },
  { id: 't2', locationId: 'petra', title: { en: 'Petra visitor shuttle operations', ar: 'تشغيل حافلات زوار البتراء' }, agency: { en: 'Petra Authority', ar: 'سلطة إقليم البتراء' }, budgetUsd: 1200000, deadlineDays: 31, status: 'review' },
  { id: 't3', locationId: 'aqaba', title: { en: 'Aqaba reef experience licensing', ar: 'ترخيص تجارب الشعاب في العقبة' }, agency: { en: 'ASEZA', ar: 'سلطة منطقة العقبة الاقتصادية' }, budgetUsd: 760000, deadlineDays: 44, status: 'open' },
  { id: 't4', locationId: 'karak', title: { en: 'Karak castle night route', ar: 'مسار ليلي لقلعة الكرك' }, agency: { en: 'Ministry of Tourism', ar: 'وزارة السياحة' }, budgetUsd: 330000, deadlineDays: 27, status: 'open' },
];

export const seedBookings: Booking[] = [
  { id: 'b1', locationId: 'wadi-rum', guest: 'Maya Haddad', nights: 2, amount: 184, status: 'pending' },
  { id: 'b2', locationId: 'petra', guest: 'Omar Saleh', nights: 3, amount: 310, status: 'accepted' },
  { id: 'b3', locationId: 'dead-sea', guest: 'Nour Khalil', nights: 1, amount: 145, status: 'checked-in' },
];
