import site from "@/data/site.json";
import { NavIcon, PhoneIcon, TableIcon } from "@/components/icons";
import type { Dict } from "@/lib/i18n";
import { telMain } from "@/lib/wa";

/** Barre fixée en bas de l'écran sur mobile : itinéraire, événement privé, appel. */
export function MobileBar({ d }: { d: Dict }) {
  const item = "flex flex-1 flex-col items-center justify-center gap-1 text-[0.78rem] font-medium";
  return (
    <nav aria-label={d.nav.contact} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/97 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="flex h-[4.25rem] items-stretch">
        <a href={site.waze} target="_blank" rel="noopener" className={`${item} text-earth`}>
          <NavIcon className="h-5 w-5" />
          {d.mobileBar.navigate}
        </a>
        <a href="#events" className={`${item} bg-ember text-paper`}>
          <TableIcon className="h-5 w-5" />
          {d.mobileBar.event}
        </a>
        <a href={telMain} className={`${item} text-earth`}>
          <PhoneIcon className="h-5 w-5" />
          {d.mobileBar.call}
        </a>
      </div>
    </nav>
  );
}
