"use client";

import { useState } from "react";
import site from "@/data/site.json";
import { NavIcon } from "@/components/icons";

/** Carte Google chargée seulement au clic (aucun appel tiers avant). */
export function MapLoader({ label, note, title, lang }: { label: string; note: string; title: string; lang: string }) {
  const [on, setOn] = useState(false);
  const src = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=14&hl=${lang}&output=embed`;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-cream-deep md:aspect-auto md:h-full md:min-h-80">
      {on ? (
        <iframe src={src} title={title} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-earth">
          <svg viewBox="0 0 200 80" className="w-48 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 60c30-22 60-26 92-14 22 8 40 8 62-2 14-6 26-6 38-2" />
            <path d="M4 74c40-14 84-18 128-12 22 3 42 8 64 14" opacity=".6" />
          </svg>
          <span className="btn btn-line btn-sm">
            <NavIcon className="h-4 w-4" />
            {label}
          </span>
          <span className="text-xs text-muted">{note}</span>
        </button>
      )}
    </div>
  );
}
