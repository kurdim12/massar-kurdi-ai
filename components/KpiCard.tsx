import { LucideIcon } from 'lucide-react';

export function KpiCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string | number; note?: string }) {
  return (
    <article className="section-line py-3">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="text-[#dd6534]" size={14} />
        <p className="eyebrow">{label}</p>
      </div>
      <strong className="block text-[30px] font-black leading-none tracking-[-.06em] text-[var(--navy)]">{value}</strong>
      {note && <span className="muted-text mt-2 block text-[11px] font-semibold">{note}</span>}
    </article>
  );
}
