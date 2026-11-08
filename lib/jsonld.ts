import site from "@/data/site.json";
import carte from "@/data/carte.json";
import { week } from "@/lib/hours";
import { getDict, type Locale } from "@/lib/i18n";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Données structurées : Restaurant (food truck) avec horaires, position, carte et FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const he = lang === "he";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Restaurant", "FoodEstablishment"],
        "@id": `${site.url}/#restaurant`,
        name: he ? "רמתא" : site.nameLatin,
        alternateName: ["רַמְתָּא", "רמתא", "Ramta", "פודטראק רמתא", "Ramta food truck"],
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/hero/terrasse-coucher-fleurs.jpg`],
        logo: `${site.url}/icon.svg`,
        telephone: site.phone.intl.replace(/[\s-]/g, ""),
        servesCuisine: ["Grill", "Meat", "Burgers", "Israeli", "Kosher"],
        priceRange: "₪₪",
        acceptsReservations: true,
        hasMenu: `${site.url}/${lang}#menu`,
        address: {
          "@type": "PostalAddress",
          addressLocality: he ? "ברוכין" : "Brukhin",
          addressRegion: he ? "שומרון" : "Samaria",
          addressCountry: "IL",
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        hasMap: site.waze,
        openingHoursSpecification: week
          .filter((s) => s.open && s.close)
          .map((s) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAYS[s.day]}`, opens: s.open, closes: s.close })),
        sameAs: [site.instagram, site.facebook],
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Kosher mehadrin", value: true },
          { "@type": "LocationFeatureSpecification", name: "Outdoor seating with view", value: true },
          { "@type": "LocationFeatureSpecification", name: "Free parking", value: true },
        ],
        hasMenuSection: carte.categories.map((c) => ({
          "@type": "MenuSection",
          name: d.menu.tabs[c.id as keyof typeof d.menu.tabs],
          hasMenuItem: c.items
            .filter((i) => !("placeholder" in i && i.placeholder))
            .map((i) => ({ "@type": "MenuItem", name: i.name.he, alternateName: i.name[lang], description: i.desc[lang] })),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}
