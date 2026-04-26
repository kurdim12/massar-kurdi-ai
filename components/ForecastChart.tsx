'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ForecastResult } from '@/lib/forecast';

export function ForecastChart({ forecast }: { forecast: ForecastResult }) {
  return (
    <div className="h-80 rounded-xl border border-[var(--line)] bg-[var(--card)] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecast.points}>
          <defs>
            <linearGradient id={`demand-${forecast.location.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c8a96a" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#c8a96a" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="month" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip />
          <Area type="monotone" dataKey="demandScore" stroke="#0b1f3a" fill={`url(#demand-${forecast.location.id})`} strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
