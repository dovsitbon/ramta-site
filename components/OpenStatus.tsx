"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { getStatus, type Status } from "@/lib/hours";

/** Texte du statut « ouvert maintenant / fermé · ouvre … », calculé à l'heure d'Israël. */
export function useStatusText() {
  const { lang, d } = useLocale();
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    const update = () => setStatus(getStatus(lang));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [lang]);
  if (!status) return null;
  if (status.open) return { open: true, main: d.status.openNow, sub: fill(d.status.until, { time: status.until }) };
  const n = status.next;
  const sub = status.closure
    ? fill(d.status.closure, { reason: status.closure })
    : !n
      ? ""
      : n.offset === 0
        ? fill(d.status.opensToday, { time: n.time })
        : n.offset === 1
          ? fill(d.status.opensTomorrow, { time: n.time })
          : fill(d.status.opensOn, { day: d.days[n.day], time: n.time });
  return { open: false, main: d.status.closedNow, sub };
}

export function OpenStatus({ className = "" }: { className?: string }) {
  const s = useStatusText();
  return (
    <p className={`inline-flex min-h-6 items-center gap-2 text-[0.95rem] ${className}`} aria-live="polite">
      {s ? (
        <>
          <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${s.open ? "bg-[#6f8f3a]" : "bg-current opacity-50"}`} />
          <span className="font-medium">{s.main}</span>
          {s.sub && <span className="opacity-80">· {s.sub}</span>}
        </>
      ) : (
        <span className="opacity-0">·</span>
      )}
    </p>
  );
}
