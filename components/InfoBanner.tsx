"use client";

import { useEffect, useState } from "react";
import annonces from "@/data/annonces.json";
import { CloseIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { closureOn, nowInIsrael, todaySlot } from "@/lib/hours";

const KEY = "ramta-banner";

/** Bandeau d'infos pratiques qu'on peut fermer : horaires du jour + annonce active (data/annonces.json). */
export function InfoBanner({ initialNote }: { initialNote: string | null }) {
  const { lang, d } = useLocale();
  const [today, setToday] = useState<string>("");
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    const now = nowInIsrael();
    const closure = closureOn(now.iso, lang);
    const s = todaySlot();
    setToday(closure ? fill(d.status.closure, { reason: closure }) : s.open && s.close ? fill(d.status.todayOpen, { from: s.open, to: s.close }) : d.status.todayClosed);
    const a = annonces.items.find((x) => x.active && x.from <= now.iso && now.iso <= x.to);
    setNote(a ? a.text[lang] : null);
  }, [lang, d]);

  const close = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.classList.add("banner-closed");
  };

  return (
    <aside aria-label={d.banner.label} className="info-banner relative z-40 bg-olive-deep text-cream">
      <div className="wrap flex min-h-11 items-center gap-3 py-2 pe-12 text-[0.9rem] md:justify-center">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="num font-medium">{today || " "}</span>
          {note && (
            <>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span className="opacity-90">{note}</span>
            </>
          )}
        </p>
        <button type="button" onClick={close} className="absolute end-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center opacity-80 hover:opacity-100" aria-label={d.banner.close}>
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
