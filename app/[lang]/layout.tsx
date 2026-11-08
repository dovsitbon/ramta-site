import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales, ogLocale } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { MobileBar } from "@/components/MobileBar";

// Polices servies en local (app/fonts) : aucun appel à Google Fonts
const suez = localFont({
  src: [{ path: "../fonts/suez-one-hebrew-400-normal.woff2", weight: "400" }],
  variable: "--font-suez",
  display: "swap",
});
const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/fraunces-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
const jost = localFont({
  src: [
    { path: "../fonts/jost-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/jost-latin-400-normal.woff2", weight: "400" },
  ],
  variable: "--font-jost",
  display: "swap",
});
const heebo = localFont({
  src: [
    { path: "../fonts/heebo-hebrew-300-normal.woff2", weight: "300" },
    { path: "../fonts/heebo-hebrew-400-normal.woff2", weight: "400" },
    { path: "../fonts/heebo-hebrew-500-normal.woff2", weight: "500" },
    { path: "../fonts/heebo-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/heebo-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-heebo",
  display: "swap",
});

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(site.url),
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/he" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: `${site.name} ${site.nameLatin}`,
      title: d.meta.title,
      description: d.meta.description,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: ["/og.jpg"] },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#f5ede1", width: "device-width", initialScale: 1 };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

// Avant le premier rendu : ouverture déjà vue (ou animations réduites) et bandeau déjà fermé pendant la session
const headScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("ramta-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen");if(sessionStorage.getItem("ramta-banner")==="1")document.documentElement.classList.add("banner-closed")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${suez.variable} ${fraunces.variable} ${jost.variable} ${heebo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <Intro skipLabel={d.intro.skip} />
          {children}
          <Footer lang={lang} d={d} />
          <MobileBar d={d} />
        </Providers>
      </body>
    </html>
  );
}
