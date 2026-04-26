import { Booking, Location } from '@/data/mock';

export type ForecastPoint = {
  month: string;
  demandScore: number;
  crowdLevel: 'low' | 'medium' | 'high';
};

export type ForecastResult = {
  location: Location;
  demandScore: number;
  crowdLevel: 'low' | 'medium' | 'high';
  predictedGrowth: number;
  supplyGap: number;
  underutilized: boolean;
  redistributionStrategy: string;
  confidence: number;
  points: ForecastPoint[];
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function crowdLevel(score: number): ForecastPoint['crowdLevel'] {
  if (score >= 76) return 'high';
  if (score >= 52) return 'medium';
  return 'low';
}

export function forecastLocation(location: Location, bookings: Booking[] = []): ForecastResult {
  const activeBookings = bookings.filter(
    (booking) => booking.locationId === location.id && ['pending', 'accepted', 'checked-in'].includes(booking.status),
  );
  const bookingSignal = Math.min(12, activeBookings.length * 4);
  const points = location.seasonality.map((season, index) => {
    const eventSignal = location.events[index] * 1.15;
    const weatherSignal = (location.weatherComfort[index] - 55) * 0.18;
    const growthSignal = location.growthRate * 100 * (index / 12);
    const demandScore = Math.round(clamp((season * 0.62) + (location.baseDemand * 0.18) + eventSignal + weatherSignal + growthSignal + bookingSignal));
    return {
      month: months[index],
      demandScore,
      crowdLevel: crowdLevel(demandScore),
    };
  });

  const demandScore = Math.round(points.reduce((sum, point) => sum + point.demandScore, 0) / points.length);
  const supplyGap = demandScore - location.supplyScore;
  const underutilized = demandScore < 64 && location.supplyScore < 45;
  const predictedGrowth = Math.round((location.growthRate * 100) + bookingSignal / 2);
  const confidence = Math.round(clamp(78 + activeBookings.length * 2 - Math.abs(supplyGap) / 10, 58, 96));

  return {
    location,
    demandScore,
    crowdLevel: crowdLevel(demandScore),
    predictedGrowth,
    supplyGap,
    underutilized,
    confidence,
    points,
    redistributionStrategy:
      supplyGap > 24
        ? 'Open new capacity, publish tenders, and route travellers to nearby lower-crowd regions.'
        : underutilized
          ? 'Bundle offers and route overflow campaigns toward this region.'
          : 'Maintain pricing discipline and monitor crowd pressure weekly.',
  };
}

export function forecastAll(locations: Location[], bookings: Booking[] = []) {
  return locations.map((location) => forecastLocation(location, bookings));
}

export function rankInvestmentOpportunities(locations: Location[], bookings: Booking[] = []) {
  return forecastAll(locations, bookings)
    .map((forecast) => ({
      ...forecast,
      opportunityScore: Math.round(clamp(forecast.demandScore * 0.55 + Math.max(0, forecast.supplyGap) * 0.8 + forecast.predictedGrowth * 0.65)),
      riskScore: Math.round(clamp(100 - forecast.confidence + Math.max(0, forecast.supplyGap - 35) * 0.5, 8, 72)),
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}
