"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import carte from "@/data/carte.json";
import { CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { openDays, pickupSlots } from "@/lib/hours";
import { recap, waMain } from "@/lib/wa";

/** Commande à l'avance pour retrait : plats et quantités, créneau aux heures d'ouverture, envoi WhatsApp au 055. */
export function OrderDialog({ onClose }: { onClose: () => void }) {
  const { lang, d } = useLocale();
  const t = d.order;
  const items = useMemo(() => carte.categories.flatMap((c) => c.items.filter((i) => !("placeholder" in i && i.placeholder))), []);
  const days = useMemo(() => openDays(), []);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [day, setDay] = useState(days[0]?.offset ?? -1);
  const slots = useMemo(() => (day < 0 ? [] : pickupSlots(day)), [day]);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    opener.current = document.activeElement;
    ref.current?.querySelector<HTMLElement>("button, input, select")?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  useEffect(() => setTime(slots[0] ?? ""), [slots]);

  const dayLabel = (o: { offset: number; day: number }) => {
    const date = new Date(Date.now() + o.offset * 86_400_000);
    return `${d.days[o.day]} ${new Intl.DateTimeFormat(lang, { day: "numeric", month: "numeric", timeZone: "Asia/Jerusalem" }).format(date)}`;
  };

  const send = () => {
    const chosen = items.filter((i) => (qty[i.id] ?? 0) > 0);
    const missing = [!chosen.length && t.empty, !name.trim() && t.name, !phone.trim() && t.phone, !time && t.time].filter(Boolean);
    if (missing.length) {
      setError(d.eventForm.required.replace("{fields}", missing.join(", ")));
      return;
    }
    const pickupDay = days.find((x) => x.offset === day);
    const lines = chosen.map((i) => `${qty[i.id]} × ${i.name.he}${lang !== "he" ? ` (${i.name[lang]})` : ""}`);
    const text = [
      recap(t.waTitle, lines.map((l) => [l, ""] as [string, string]), true),
      "",
      recap("", [
        [t.waPickup, `${pickupDay ? dayLabel(pickupDay) : ""} · ${time}`],
        [t.waName, name],
        [t.waPhone, phone],
        [t.waNotes, notes],
      ]),
    ].join("\n");
    window.open(waMain(text), "_blank", "noopener");
  };

  return (
    <div className="fade-in fixed inset-0 z-[70] flex items-end justify-center bg-night/60 sm:items-center sm:p-6" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="order-title" onClick={(e) => e.stopPropagation()} className="max-h-[92svh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-2xl bg-paper p-6 shadow-xl sm:rounded-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="order-title" className="text-[1.8rem] leading-tight">
              {t.title}
            </h2>
            <p className="mt-2 text-[0.95rem] text-muted">{t.lead}</p>
          </div>
          <button type="button" onClick={onClose} className="-me-2 flex h-11 w-11 shrink-0 items-center justify-center text-earth" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {items.map((i) => {
            const n = qty[i.id] ?? 0;
            const set = (v: number) => setQty((q) => ({ ...q, [i.id]: Math.max(0, Math.min(20, v)) }));
            return (
              <li key={i.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p lang="he" className="font-medium text-earth">
                    {i.name.he}
                  </p>
                  {lang !== "he" && <p className="text-sm text-muted">{i.name[lang]}</p>}
                </div>
                <div className="flex items-center gap-1" role="group" aria-label={`${t.qty} – ${i.name[lang]}`}>
                  <button type="button" onClick={() => set(n - 1)} disabled={!n} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-earth disabled:opacity-35" aria-label={t.less}>
                    <MinusIcon />
                  </button>
                  <span className="num w-7 text-center font-medium" aria-live="polite">
                    {n}
                  </span>
                  <button type="button" onClick={() => set(n + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-earth" aria-label={t.more}>
                    <PlusIcon />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="field">
            {t.day}
            <select className="input" value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {days.map((o) => (
                <option key={o.offset} value={o.offset}>
                  {dayLabel(o)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t.time}
            <select className="input num" value={time} onChange={(e) => setTime(e.target.value)} disabled={!slots.length}>
              {slots.length ? (
                slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))
              ) : (
                <option value="">{t.noSlots}</option>
              )}
            </select>
          </label>
          <label className="field">
            {t.name}
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} name="name" autoComplete="name" />
          </label>
          <label className="field">
            {t.phone}
            <input className="input" name="tel" type="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label className="field sm:col-span-2">
            {t.notes}
            <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[0.95rem] font-medium text-ember">
            {error}
          </p>
        )}
        <button type="button" onClick={send} className="btn btn-ember mt-6 w-full">
          <WhatsAppIcon className="h-5 w-5" />
          {t.send}
        </button>
      </div>
    </div>
  );
}
