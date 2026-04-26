'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function DemandSupplyChart({ data }: { data: { name: string; demand: number; supply: number }[] }) {
  return (
    <div className="h-[260px] min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="name" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip />
          <Bar dataKey="demand" fill="#0B1F3A" />
          <Bar dataKey="supply" fill="#C8A96A" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OccupancyTrendChart({ data }: { data: { m: string; occ: number }[] }) {
  return (
    <div className="h-[230px] min-h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="m" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip />
          <Line dataKey="occ" stroke="#0B1F3A" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
