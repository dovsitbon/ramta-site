import site from "@/data/site.json";
import { FacebookIcon, InstagramIcon, NavIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { week } from "@/lib/hours";
import type { Dict, Locale } from "@/lib/i18n";
import { telEvents, telMain, waMain } from "@/lib/wa";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  // Semaine affichée du dimanche au samedi ; jours fermés regroupés
  const open = week.filter((s) => s.open);
  return (
    <footer className="on-dark bg-night text-cream">
      <div className="wrap grid gap-12 pt-16 pb-10 md:grid-cols-[1.3fr_1fr_1fr] md:pt-20">
        <div className="flex flex-col gap-5">
          <Logo className="text-cream" />
          <p className="max-w-xs text-[0.95rem] text-cream/75">{d.footer.tagline}</p>
          <div className="flex gap-1">
            <a href={site.instagram} target="_blank" rel="noopener" className="flex h-11 w-11 items-center justify-center rounded-full hover:text-sun" aria-label={`${d.nav.instagram} ${d.a11y.newTab}`}>
              <InstagramIcon />
            </a>
            <a href={site.facebook} target="_blank" rel="noopener" className="flex h-11 w-11 items-center justify-center rounded-full hover:text-sun" aria-label={`Facebook ${d.a11y.newTab}`}>
              <FacebookIcon />
            </a>
            <a href={waMain(d.whatsapp.hello)} target="_blank" rel="noopener" className="flex h-11 w-11 items-center justify-center rounded-full hover:text-sun" aria-label={`WhatsApp ${d.a11y.newTab}`}>
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-sun">{d.info.hoursTitle}</h2>
          <ul className="mt-4 space-y-1.5 text-[0.95rem] text-cream/85">
            {open.map((s) => (
              <li key={s.day} className="flex justify-between gap-4">
                <span>{d.days[s.day]}</span>
                <span className="num" dir="ltr">
                  {s.open}–{s.close}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-4 text-cream/60">
              <span>{week.filter((s) => !s.open).map((s) => d.days[s.day]).join(", ")}</span>
              <span>{d.info.closed}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-sun">{d.info.contactTitle}</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem] text-cream/85">
            <li>
              <a href={site.waze} target="_blank" rel="noopener" className="inline-flex min-h-8 items-center gap-2 hover:text-sun">
                <NavIcon className="h-4 w-4" />
                {d.info.address}
              </a>
            </li>
            <li>
              <a href={telMain} className="inline-flex min-h-8 items-center gap-2 hover:text-sun">
                <PhoneIcon className="h-4 w-4" />
                <span>{d.info.questions}:</span>
                <span dir="ltr" className="num">
                  {site.phone.display}
                </span>
              </a>
            </li>
            <li>
              <a href={telEvents} className="inline-flex min-h-8 items-center gap-2 hover:text-sun">
                <PhoneIcon className="h-4 w-4" />
                <span>
                  {d.info.eventsContact} ({site.eventsPhone.contact[lang]}):
                </span>
                <span dir="ltr" className="num">
                  {site.eventsPhone.display}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-cream/12 py-6 text-[0.82rem] text-cream/60 md:flex-row md:items-start md:justify-between">
        <p>
          © {year} {site.name} · {site.nameLatin}. {d.footer.rights}. {d.footer.photos}
        </p>
        <details className="md:max-w-md">
          <summary className="inline-flex min-h-8 items-center underline underline-offset-4 hover:text-cream">{d.footer.legal}</summary>
          <p className="mt-2 leading-relaxed">{d.footer.legalText}</p>
        </details>
      </div>
    </footer>
  );
}
