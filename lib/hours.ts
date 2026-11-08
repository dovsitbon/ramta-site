import horaires from "@/data/horaires.json";
import type { Locale } from "@/lib/locales";

type Slot = { day: number; open: string | null; close: string | null };
export const week = horaires.week as Slot[];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Jour (0 = dimanche), minutes et date ISO à l'heure d'Israël, quel que soit le fuseau du visiteur. */
export function nowInIsrael(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: horaires.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", year: "numeric", month: "2-digit", day: "2-digit", hourCycle: "h23" })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  return { day, minutes: Number(parts.hour) * 60 + Number(parts.minute), iso: `${parts.year}-${parts.month}-${parts.day}` };
}

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function closureOn(iso: string, lang: Locale): string | null {
  const c = horaires.closures.find((x) => x.date === iso && (x.reason.he || x.reason.en));
  return c ? c.reason[lang] || c.reason.he || "" : null;
}

export type Status =
  | { open: true; until: string }
  | { open: false; next: { offset: number; day: number; time: string } | null; closure: string | null };

export function getStatus(lang: Locale, date = new Date()): Status {
  const now = nowInIsrael(date);
  const closure = closureOn(now.iso, lang);
  const today = week[now.day];
  if (!closure && today.open && today.close && now.minutes >= toMin(today.open) && now.minutes < toMin(today.close)) {
    return { open: true, until: today.close };
  }
  for (let offset = 0; offset < 8; offset++) {
    const day = (now.day + offset) % 7;
    const s = week[day];
    if (!s.open) continue;
    if (offset === 0 && (closure || now.minutes >= toMin(s.open))) continue;
    if (closureOn(addDays(now.iso, offset), lang)) continue;
    return { open: false, next: { offset, day, time: s.open }, closure };
  }
  return { open: false, next: null, closure };
}

export const todaySlot = (date = new Date()) => week[nowInIsrael(date).day];

/** Créneaux de retrait (toutes les 15 min, à partir de +30 min) pour un jour donné, aux heures d'ouverture. */
export function pickupSlots(offset: number, date = new Date()) {
  const now = nowInIsrael(date);
  const s = week[(now.day + offset) % 7];
  if (!s.open || !s.close || closureOn(addDays(now.iso, offset), "he")) return [];
  const start = toMin(s.open) + 15;
  const end = toMin(s.close) - 15;
  const min = offset === 0 ? now.minutes + 30 : 0;
  const out: string[] = [];
  for (let m = start; m <= end; m += 15) if (m >= min) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  return out;
}

/** Jours d'ouverture des 7 prochains jours (décalage par rapport à aujourd'hui). */
export function openDays(date = new Date()) {
  const out: { offset: number; day: number }[] = [];
  for (let o = 0; o < 7; o++) if (pickupSlots(o, date).length) out.push({ offset: o, day: (nowInIsrael(date).day + o) % 7 });
  return out;
}
