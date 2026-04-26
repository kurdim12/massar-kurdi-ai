import Image from 'next/image';

export function MasaarLogo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 leading-none ${className}`}>
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--navy)] shadow-sm">
        <Image src="/favicon.svg" alt="" width={40} height={40} priority />
      </span>
      {!compact && (
        <span className="grid gap-0.5">
          <strong className="block text-[17px] font-black uppercase tracking-[.34em] text-[var(--navy)]">MASAAR</strong>
          <span className="block text-[10px] font-bold uppercase tracking-[.24em] text-[var(--muted)]">مسار / Jordan</span>
        </span>
      )}
    </span>
  );
}
