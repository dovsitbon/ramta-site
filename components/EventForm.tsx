"use client";

import { useRef, useState } from "react";
import ev from "@/data/evenements.json";
import { MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { recap, waEvents } from "@/lib/wa";

type Choice = Record<string, string>;

/**
 * Demande d'événement privé : « Combien d'invités ? » + date lancent la demande, puis le formulaire complet.
 * Envoi d'un récapitulatif formaté sur WhatsApp, dans la langue du visiteur, au numéro des événements.
 */
export function EventForm() {
  const { lang, d } = useLocale();
  const t = d.eventForm;
  const [guests, setGuests] = useState(ev.guests.default);
  const [date, setDate] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [c, setC] = useState<Choice>({ type: "", moment: "", menu: "", music: "" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const detailsRef = useRef<HTMLFieldSetElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  const start = () => {
    setStep(2);
    requestAnimationFrame(() => detailsRef.current?.querySelector<HTMLInputElement>("input")?.focus());
  };

  const send = () => {
    const missing = [!c.type && t.type, !date && d.events.date, !name.trim() && t.name, !phone.trim() && t.phone].filter(Boolean);
    if (missing.length) {
      setError(t.required.replace("{fields}", missing.join(", ")));
      return;
    }
    setError("");
    const dateLabel = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
    const text = recap(t.waTitle, [
      [t.waType, t.types[c.type as keyof typeof t.types]],
      [t.waDate, dateLabel],
      [t.waGuests, guests],
      [t.waMoment, c.moment && t.moments[c.moment as keyof typeof t.moments]],
      [t.waMenu, c.menu && t.menuPrefs[c.menu as keyof typeof t.menuPrefs]],
      [t.waMusic, c.music && t.musics[c.music as keyof typeof t.musics]],
      [t.waBudget, budget && `${budget} ₪`],
      [t.waName, name],
      [t.waPhone, phone],
      [t.waMessage, message],
    ]);
    window.open(waEvents(text), "_blank", "noopener");
  };

  const Chips = ({ name: field, options, legend }: { name: string; options: Record<string, string>; legend: string }) => (
    <fieldset>
      <legend className="mb-2 text-[0.9rem] font-medium text-earth">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {Object.entries(options).map(([k, label]) => (
          <label key={k}>
            <input type="radio" name={`ev-${field}`} value={k} checked={c[field] === k} onChange={() => setC((x) => ({ ...x, [field]: k }))} className="peer sr-only" />
            <span className="chip">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const g = ev.guests;
  const clamp = (v: number) => Math.max(g.min, Math.min(g.max, Number.isFinite(v) ? v : g.default));

  return (
    <form
      className="rounded-2xl bg-paper p-5 shadow-[0_1px_0_var(--color-line),0_18px_50px_-30px_rgb(74_52_38/0.35)] sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 1) start();
        else send();
      }}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr_auto] sm:items-end">
        <div className="field">
          <label htmlFor="ev-guests" className="font-[family-name:var(--font-display)] text-[1.35rem] font-normal">
            {d.events.guests}
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setGuests((v) => clamp(v - g.step))} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-earth" aria-label={d.order.less}>
              <MinusIcon />
            </button>
            <input id="ev-guests" type="number" inputMode="numeric" min={g.min} max={g.max} step={g.step} value={guests} onChange={(e) => setGuests(Number(e.target.value))} onBlur={() => setGuests(clamp(guests))} className="input num text-center text-[1.15rem]" />
            <button type="button" onClick={() => setGuests((v) => clamp(v + g.step))} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-earth" aria-label={d.order.more}>
              <PlusIcon />
            </button>
          </div>
        </div>
        <label className="field">
          <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-normal">{d.events.date}</span>
          <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </label>
        {step === 1 && (
          <button type="submit" className="btn btn-ember">
            {d.events.start}
          </button>
        )}
      </div>

      {step === 2 && (
        <fieldset ref={detailsRef} className="fade-in mt-8 grid gap-6 border-t border-line pt-8">
          <legend className="sr-only">{t.title}</legend>
          <Chips name="type" legend={t.type} options={t.types} />
          <div className="grid gap-6 md:grid-cols-3">
            <Chips name="moment" legend={t.moment} options={t.moments} />
            <Chips name="menu" legend={t.menuPref} options={t.menuPrefs} />
            <Chips name="music" legend={t.music} options={t.musics} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="field">
              {t.name}
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} name="name" autoComplete="name" required />
            </label>
            <label className="field">
              {t.phone}
              <input className="input" name="tel" type="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required />
            </label>
            <label className="field">
              {t.budget}
              <input className="input num" type="number" inputMode="numeric" min={0} placeholder={t.budgetPh} value={budget} onChange={(e) => setBudget(e.target.value)} />
            </label>
          </div>
          <label className="field">
            {t.message}
            <textarea className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          {error && (
            <p role="alert" className="text-[0.95rem] font-medium text-ember">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.9rem] text-muted">{t.note}</p>
            <button type="submit" className="btn btn-ember">
              <WhatsAppIcon className="h-5 w-5" />
              {t.send}
            </button>
          </div>
        </fieldset>
      )}
    </form>
  );
}
