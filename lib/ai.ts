import { ForecastResult } from '@/lib/forecast';

export type AiMode = 'itinerary' | 'business-offer' | 'policy' | 'investor' | 'traveller-chat' | 'investor-chat' | 'business-chat' | 'government-chat';

const rolePrompts: Record<AiMode, string> = {
  itinerary: [
    'You are MASAAR Traveller Concierge.',
    'Create practical Jordan itineraries that reduce crowd pressure and redirect demand to suitable underutilized destinations.',
    'Always include timing, crowd avoidance, budget sensitivity, and one alternative destination.',
  ].join(' '),
  'business-offer': [
    'You are MASAAR Business Revenue Advisor.',
    'Generate operational tourism offers for Jordanian businesses.',
    'Prioritize occupancy recovery, clear pricing, capacity limits, conversion, and service quality.',
  ].join(' '),
  policy: [
    'You are MASAAR Government Policy Intelligence.',
    'Provide national tourism policy recommendations using demand imbalance, capacity gaps, tenders, and economic impact.',
    'Be concise, actionable, and suitable for a ministry dashboard.',
  ].join(' '),
  investor: [
    'You are MASAAR Investor Intelligence.',
    'Analyze Jordan tourism opportunities with demand, supply gap, ROI signal, risk, and tender fit.',
    'Return strategic and safe investment guidance.',
  ].join(' '),
  'traveller-chat': [
    'You are MASAAR Traveller AI Advisor.',
    'Help a public traveller plan routes, compare destinations, manage budget, avoid crowds, and add meaningful alternatives in Jordan.',
    'Never sound like generic travel marketing. Be specific and practical.',
  ].join(' '),
  'investor-chat': [
    'You are MASAAR Investor AI Analyst.',
    'Help an investor choose regions, interpret forecasts, estimate opportunity, understand tender fit, and reduce strategic risk.',
    'Use clear finance and tourism language without pretending to be a licensed financial advisor.',
  ].join(' '),
  'business-chat': [
    'You are MASAAR Business Owner AI Operator.',
    'Help a tourism operator improve occupancy, pricing, offers, guest conversion, revenue, and demand response.',
    'Recommend concrete actions that can be executed inside the app.',
  ].join(' '),
  'government-chat': [
    'You are MASAAR Ministry AI Command Advisor.',
    'Help a government tourism team detect imbalance, publish tenders, coordinate businesses and investors, and track national impact.',
    'Use policy-grade language and give measurable actions.',
  ].join(' '),
};

function isArabicText(value: unknown) {
  return /[\u0600-\u06ff]/.test(String(value ?? ''));
}

export async function askMasaarAI(mode: AiMode, context: Record<string, unknown>, apiKey?: string) {
  const resolvedApiKey = apiKey?.trim() || process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();
  const promptLanguage = isArabicText(context.prompt) ? 'Arabic' : 'English';
  if (!resolvedApiKey) return mockAi(mode, context);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${resolvedApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${rolePrompts[mode]}\n\nContext JSON:\n${JSON.stringify(context)}\n\nInstructions:\n- Detect the user's prompt language and answer in the same language. The detected language is ${promptLanguage}.\n- If the user writes Arabic, answer fully in natural Arabic. If the user writes English, answer fully in English.\n- Use MASAAR-specific context: Jordan destinations, forecasts, offers, tenders, bookings, and the current user role.\n- Keep the response concise, practical, and operational.\n- Use bullets only when useful.\n- Do not invent real-time data; treat supplied data as MASAAR local intelligence.\n- End with one next action the user can take in MASAAR.` }] }],
      }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? mockAi(mode, context);
  } catch {
    return mockAi(mode, context);
  }
}

export function mockAi(mode: AiMode, context: Record<string, unknown>) {
  const location = String(context.location ?? 'Jordan');
  const ar = isArabicText(context.prompt) || context.locale === 'ar';
  const messages: Record<AiMode, string> = ar ? {
    itinerary: `المسار المقترح: ابدأ مبكرا في ${location}، تجنب نافذة الازدحام بين 12:00 و15:00، وأضف وجهة قريبة أقل استخداما لتخفيف الضغط.`,
    'business-offer': `توصية العرض: أطلق حزمة أيام عمل لمدة 48 ساعة في ${location} مع حد سعة واضح للحفاظ على جودة الخدمة.`,
    policy: 'توصية سياسة: انشر عطاءات موجهة في المناطق ذات فجوة العرض، وحفز الوجهات الأقل استخداما، وراقب سرعة الحجوزات أسبوعيا.',
    investor: 'إشارة استثمار: أعط الأولوية للمناطق التي يكون فيها نمو الطلب أعلى من العرض مع ثقة مخاطرة تتجاوز 75%.',
    'traveller-chat': `خطط لزيارة ${location} مبكرا، وأضف وجهة أهدأ قريبة، وتجنب فترة 12:00-15:00. الخطوة التالية: أضف عرضا مناسبا إلى الرحلة.`,
    'investor-chat': `إشارة الاستثمار في ${location}: قارن نمو الطلب بفجوة العرض ثم راجع العطاء المناسب قبل تخصيص الميزانية. الخطوة التالية: افتح صفحة التوقعات.`,
    'business-chat': `إجراء تشغيلي في ${location}: انشر عرضا قصير المدة ومحدود السعة، راقب سرعة الحجز، وعدل متوسط السعر قبل ذروة الطلب. الخطوة التالية: أنشئ عرضا.`,
    'government-chat': `إجراء حكومي في ${location}: استخدم العطاءات والعروض الموجهة لنقل الطلب من الوجهات المزدحمة إلى المناطق الأقل استخداما. الخطوة التالية: انشر عطاء موجها.`,
  } : {
    itinerary: `Recommended route: start early in ${location}, avoid the 12:00-15:00 crowd window, and add one underutilized nearby destination to reduce pressure.`,
    'business-offer': `Offer recommendation: launch a 48-hour weekday bundle for ${location} with transfer included and a capacity cap to protect service quality.`,
    policy: 'Policy recommendation: publish targeted tenders in high-gap regions, incentivize underutilized areas, and monitor booking velocity weekly.',
    investor: 'Investor insight: prioritize regions where demand growth is above supply and risk confidence remains above 75%.',
    'traveller-chat': `Plan ${location} early, add one quieter nearby destination, and avoid the 12:00-15:00 crowd window. Next action: add a matching offer to Trip.`,
    'investor-chat': `Investment signal for ${location}: compare demand growth against supply gap, then open the matching tender before committing budget. Next action: review Forecast.`,
    'business-chat': `Business action for ${location}: publish a short capacity-limited offer, watch booking velocity, and adjust ADR before peak demand. Next action: generate an offer.`,
    'government-chat': `Policy action for ${location}: use tenders and targeted offers to move demand from crowded icons to underused regions. Next action: publish a targeted tender.`,
  };
  return messages[mode];
}

export function policyInsights(forecasts: ForecastResult[]) {
  const highGap = forecasts.filter((forecast) => forecast.supplyGap > 20);
  const underused = forecasts.filter((forecast) => forecast.underutilized);
  return [
    `${highGap.length} regions need capacity intervention or tender publishing.`,
    `${underused.length} regions can absorb redistributed demand through offers and transport bundles.`,
    'National target: reduce high-crowd destinations by 12% while raising underutilized demand by 18%.',
  ];
}
