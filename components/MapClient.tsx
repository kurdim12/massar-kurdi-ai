'use client';

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { ForecastResult } from '@/lib/forecast';
import { useLocale } from '@/lib/i18n';

function colorFor(score: number) {
  if (score > 78) return '#d94841';
  if (score > 56) return '#c8a96a';
  return '#2f9c95';
}

export function ForecastMap({
  forecasts,
  selectedId,
  onSelect,
  height = 320,
}: {
  forecasts: ForecastResult[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  height?: number;
}) {
  const { tx, pick } = useLocale();
  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[#111827]" style={{ minHeight: height }}>
      <MapContainer center={[31.2, 36.1]} zoom={7} scrollWheelZoom={false} style={{ minHeight: height }}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {forecasts.map((forecast) => {
          const selected = selectedId === forecast.location.id;
          return (
            <CircleMarker
              key={forecast.location.id}
              center={[forecast.location.lat, forecast.location.lng]}
              radius={selected ? 24 : 13 + forecast.demandScore / 8}
              eventHandlers={{ click: () => onSelect?.(forecast.location.id) }}
              pathOptions={{
                color: selected ? '#0b1f3a' : colorFor(forecast.demandScore),
                weight: selected ? 4 : 2,
                fillColor: colorFor(forecast.demandScore),
                fillOpacity: selected ? 0.9 : 0.66,
              }}
            >
              <Popup>
                <strong>{tx(forecast.location.name)}</strong>
                <br />
                {pick('Demand', 'الطلب')} {forecast.demandScore}% - {forecast.crowdLevel}
                <br />
                {pick('Supply gap', 'فجوة العرض')} {forecast.supplyGap > 0 ? '+' : ''}{forecast.supplyGap}
                <br />
                {pick('Confidence', 'الثقة')} {forecast.confidence}%
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="absolute bottom-3 left-3 z-[500] rounded-lg border border-[var(--line)] bg-[var(--card)]/95 p-3 text-[10px] font-black uppercase tracking-[.18em] text-[var(--navy)] shadow-sm">
        <div className="mb-2">{pick('Demand layer', 'طبقة الطلب')}</div>
        <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#2f9c95]" /> {pick('Low', 'منخفض')}</div>
        <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#c8a96a]" /> {pick('Medium', 'متوسط')}</div>
        <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#d94841]" /> {pick('High', 'مرتفع')}</div>
      </div>
    </div>
  );
}
