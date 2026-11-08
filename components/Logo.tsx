/**
 * Logo de Ramta redessiné d'après l'illustration Instagram (vigne et olivier sur les collines) :
 * un trait de collines, des rangs de vigne, un olivier et une petite braise.
 * Remplaçable : il suffit de changer <Mark /> (et app/icon.svg pour le favicon).
 */
export function Mark({ className = "h-8 w-auto", ember = true }: { className?: string; ember?: boolean }) {
  return (
    <svg viewBox="0 0 120 52" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* soleil couchant */}
      <path d="M44 27a10 10 0 0 1 20 0" stroke="var(--color-sun)" strokeWidth="1.6" />
      {/* collines du fond */}
      <path d="M3 30c12-9 24-12 37-8 9 3 16 3 25-2 14-7 32-6 52 4" strokeWidth="1.5" />
      {/* colline de devant avec les rangs de vigne */}
      <path d="M3 44c18-10 40-14 62-12 20 2 36 7 52 12" strokeWidth="1.5" />
      <path d="M22 41l6-5M31 39l6-5.6M40 37.4l6-5.8M49 36.4l6-5.6M58 36l5.6-5" strokeWidth="1.1" opacity=".75" />
      {/* olivier */}
      <path d="M90 33.5v-7.5" strokeWidth="1.4" />
      <path d="M90 27c-6 0-9.5-3-9.5-6.5S84 14 90 14s9.5 3 9.5 6.5S96 27 90 27Z" strokeWidth="1.3" />
      <path d="M90 26l-3-3.5M90 24.5l3.2-3" strokeWidth="1" />
      {/* braise */}
      {ember && <circle cx="110" cy="46" r="1.8" fill="var(--color-ember)" stroke="none" className="ember-dot" />}
    </svg>
  );
}

export function Logo({ className = "", tagline, compact = false }: { className?: string; tagline?: string; compact?: boolean }) {
  return (
    <span translate="no" className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className={compact ? "h-7 w-auto" : "h-9 w-auto"} />
      <span className="flex flex-col items-start leading-none">
        <span lang="he" className="font-[family-name:var(--font-suez)] text-[1.55rem] leading-[1.05] tracking-normal">
          רַמְתָּא
        </span>
        <span className="mt-1 font-[family-name:var(--font-jost)] text-[0.62rem] font-normal tracking-[0.42em]" lang="en" dir="ltr">
          RAMTA
        </span>
        {tagline && <span className="sr-only">{tagline}</span>}
      </span>
    </span>
  );
}
