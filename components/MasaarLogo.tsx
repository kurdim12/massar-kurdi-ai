import Image from 'next/image';

export function MasaarLogo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 leading-none ${className}`}>
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--navy)] shadow-sm">
        <Image src="/favicon.svg" alt="" width={40} height={40} priority />
      </span>
      {!compact && (
        <span className="grid min-w-0 gap-0.5">
          <strong className="block truncate text-[16px] font-black uppercase tracking-[.28em] text-[var(--navy)]">MASAAR</strong>
          <span className="block truncate text-[10px] font-bold uppercase tracking-[.18em] text-[var(--muted)]">مسار / Jordan</span>
        </span>
      )}
    </span>
  );
}
