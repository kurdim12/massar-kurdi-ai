import { LucideIcon } from 'lucide-react';

export function KpiCard({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string | number; note?: string }) {
  return (
    <article className="surface-card p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dd6534]/10 text-[#dd6534]">
          <Icon size={15} />
        </span>
        <p className="eyebrow">{label}</p>
      </div>
      <strong className="numeric block text-[30px]">{value}</strong>
      {note && <span className="muted-text mt-2 block text-[11px] font-semibold">{note}</span>}
    </article>
  );
}
