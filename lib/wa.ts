import site from "@/data/site.json";

/** Lien WhatsApp avec message pré-rempli. */
export const waLink = (number: string, text?: string) => `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const waMain = (text?: string) => waLink(site.phone.wa, text);
export const waEvents = (text?: string) => waLink(site.eventsPhone.wa, text);
export const telMain = `tel:${site.phone.intl.replace(/[\s-]/g, "")}`;
export const telEvents = `tel:${site.eventsPhone.intl.replace(/[\s-]/g, "")}`;

/**
 * Bloc de message : titre en gras (si fourni) puis une ligne par champ rempli.
 * `bare` : lignes sans valeur (« 2 × בורגרמתא »).
 */
export function recap(title: string, rows: [string, string | number | undefined | null][], bare = false) {
  const lines = rows
    .filter(([k, v]) => (bare ? k : v !== undefined && v !== null && String(v).trim() !== ""))
    .map(([k, v]) => (bare ? `• ${k}` : `• ${k}: ${v}`));
  return [...(title ? [`*${title}*`, ""] : []), ...lines].join("\n");
}
