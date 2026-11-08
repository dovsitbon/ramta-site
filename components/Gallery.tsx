"use client";

import Image from "next/image";
import { useState } from "react";
import galerie from "@/data/galerie.json";
import site from "@/data/site.json";
import { InstagramIcon } from "@/components/icons";
import { Lightbox, type LightboxItem } from "@/components/Lightbox";
import { useLocale } from "@/components/providers";
import { altOf } from "@/lib/i18n";
import { img } from "@/lib/media";

/** Galerie « אווירה » : leurs vraies photos (data/galerie.json) + une case pour les photos à venir. */
export function Gallery() {
  const { d } = useLocale();
  const [index, setIndex] = useState<number | null>(null);
  const items: LightboxItem[] = galerie.photos.map((p) => ({ ...img(p), alt: altOf(d, p) }));

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3">
        {items.map((it, i) => (
          <li key={it.src} className="break-inside-avoid">
            <button type="button" onClick={() => setIndex(i)} className="group block w-full overflow-hidden rounded-lg">
              <Image src={it.src} alt={it.alt} width={it.width} height={it.height} sizes="(min-width:1024px) 23vw, (min-width:768px) 31vw, 46vw" quality={70} className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
          </li>
        ))}
        <li className="break-inside-avoid">
          <a href={site.instagram} target="_blank" rel="noopener" className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-cream/30 p-6 text-center text-cream/85 hover:border-sun hover:text-sun">
            <InstagramIcon className="h-7 w-7" />
            <span className="text-[0.95rem]">{d.gallery.more}</span>
            <span dir="ltr" className="text-sm opacity-75">
              {site.instagramHandle}
            </span>
          </a>
        </li>
      </ul>
      <Lightbox items={items} index={index} onIndex={setIndex} labels={{ close: d.gallery.close, prev: d.gallery.prev, next: d.gallery.next, counter: d.gallery.counter }} />
    </>
  );
}
