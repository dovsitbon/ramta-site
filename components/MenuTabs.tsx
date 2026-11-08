"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import carte from "@/data/carte.json";
import sizes from "@/data/media-sizes.json";
import { useLocale } from "@/components/providers";
import { OrderDialog } from "@/components/OrderDialog";
import { altOf } from "@/lib/i18n";

type Item = (typeof carte.categories)[number]["items"][number] & { placeholder?: boolean };

/** La carte : une seule page, un onglet par catégorie (data/carte.json). Noms en hébreu, traduction dessous. */
export function MenuTabs() {
  const { lang, d } = useLocale();
  const [active, setActive] = useState(carte.categories[0].id);
  const [orderOpen, setOrderOpen] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  // Ancre #menu-<catégorie> (tuiles après le hero) : ouvre directement le bon onglet
  useEffect(() => {
    const onHash = () => {
      const id = location.hash.replace("#menu-", "");
      if (location.hash.startsWith("#menu-") && carte.categories.some((c) => c.id === id)) {
        setActive(id);
        document.getElementById("menu")?.scrollIntoView();
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const rtl = document.documentElement.dir === "rtl";
    const fwd = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let n = -1;
    if (e.key === fwd) n = (i + 1) % carte.categories.length;
    if (e.key === back) n = (i - 1 + carte.categories.length) % carte.categories.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = carte.categories.length - 1;
    if (n < 0) return;
    e.preventDefault();
    setActive(carte.categories[n].id);
    tabs.current[n]?.focus();
  };

  const cat = carte.categories.find((c) => c.id === active)!;
  const price = (p: number | null) => (p === null ? d.menu.priceTbd : `${p} ${carte.currency}`);

  return (
    <div>
      <div role="tablist" aria-label={d.menu.kicker} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {carte.categories.map((c, i) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={on}
              aria-controls={`panel-${c.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(c.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-[0.95rem] transition-colors ${on ? "border-earth bg-earth text-cream" : "border-line text-earth hover:border-earth"}`}
            >
              {d.menu.tabs[c.id as keyof typeof d.menu.tabs]}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={cat.id}
          role="tabpanel"
          id={`panel-${cat.id}`}
          aria-labelledby={`tab-${cat.id}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(cat.items as Item[]).map((it) => {
            const size = it.photo ? (sizes as Record<string, number[]>)[it.photo] : null;
            return (
              <li key={it.id} className="flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream-deep">
                  {it.photo && size ? (
                    <Image src={it.photo} alt={altOf(d, it.photo)} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw" quality={70} className={`object-cover ${it.placeholder ? "opacity-45 grayscale-[40%]" : ""}`} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted">{d.gallery.slot}</div>
                  )}
                  {it.placeholder && <span className="absolute start-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-earth">{d.menu.toFill}</span>}
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 lang="he" dir="rtl" className={`font-[family-name:var(--font-suez)] text-[1.45rem] leading-tight text-earth ${lang === "he" ? "" : "text-left"}`}>
                      {it.name.he}
                    </h3>
                    {lang !== "he" && <p className="mt-0.5 text-[0.92rem] font-medium text-olive">{it.name[lang]}</p>}
                  </div>
                  <p className={`num shrink-0 pt-1 text-[0.95rem] ${it.price === null ? "text-muted" : "font-medium text-earth"}`}>{price(it.price)}</p>
                </div>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">{it.desc[lang]}</p>
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.95rem] text-muted">{d.menu.allergens}</p>
        <button type="button" onClick={() => setOrderOpen(true)} className="btn btn-line self-start sm:self-auto">
          {d.menu.orderCta}
        </button>
      </div>

      {orderOpen && <OrderDialog onClose={() => setOrderOpen(false)} />}
    </div>
  );
}
