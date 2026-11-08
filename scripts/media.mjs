// Classe les visuels de Ramta dans assets/<catégorie>/ avec des noms lisibles, puis les prépare pour le web
// dans public/media/<catégorie>/ (next/image sert ensuite des variantes AVIF/WebP à la bonne taille).
//   npm run media
//
// Sources :
//   assets/raw/    visuels du profil Instagram public (640 px, 12 publications visibles sans connexion sur 19)
//   assets/picks/  images extraites des reels avec ffmpeg (720 × 1280, plus nettes que les couvertures)
// Écartées : affiches pleines de texte (horaires, « עכשיו גם אירועים »), images de nuit trop sombres,
// visages des clients (reel de Tamar Kosher Food, soirée dansante), image orange surexposée (reel DdwfRSrtsFS).
// `crop` = bande verticale gardée, en fractions de la hauteur (sert à retirer les sous-titres incrustés).
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const P = (n) => `picks/${n}.jpg`;

const PICKS = [
  [P("terrasse-coucher-fleurs"), "hero", "terrasse-coucher-fleurs"],
  [P("burger-oignons"), "hero", "burger-gros-plan", { top: 0.54, bottom: 1 }],

  [P("burger-frites-2"), "plats", "burger-frites", { top: 0.53, bottom: 1 }],
  [P("burger-oignons"), "plats", "burger-oignons", { top: 0.54, bottom: 1 }],
  [P("sandwich-sauce"), "plats", "sandwich-sauce"],
  [P("sandwich-boeuf"), "plats", "sandwich-boeuf"],
  [P("sandwich-frites"), "plats", "sandwich-frites"],
  [P("planche-kebabs"), "plats", "planche-kebabs", { top: 0.2, bottom: 1 }],
  ["raw/ramta_09_Ddeej2oN_1g.jpg", "plats", "planche-personnelle", { top: 0.47, bottom: 1 }],
  [P("salade-boeuf"), "plats", "brisket-tranche", { top: 0.32, bottom: 1 }],
  [P("salade-amandes"), "plats", "tartine-boeuf", { top: 0.32, bottom: 1 }],
  [P("pita-salade"), "plats", "lafa-boeuf", { top: 0.32, bottom: 1 }],
  [P("bruschetta"), "plats", "burger-maison", { top: 0.32, bottom: 1 }],
  [P("plancha"), "plats", "plancha", { top: 0.15, bottom: 1 }],

  [P("soleil-couchant"), "lieu", "soleil-couchant"],
  [P("terrasse-pergola"), "lieu", "terrasse-pergola"],
  [P("pergola-crepuscule-2"), "lieu", "pergola-crepuscule"],
  [P("terrasse-tables-vue"), "lieu", "terrasse-tables-vue"],
  [P("table-pique-nique-plats"), "lieu", "table-pique-nique", { top: 0.34, bottom: 1 }],
  [P("foodtruck-fleurs"), "lieu", "foodtruck-fleurs"],
  [P("foodtruck-logo-lavande"), "lieu", "foodtruck-logo-lavande"],
  [P("foodtruck-terrasse-pov"), "lieu", "foodtruck-terrasse", { top: 0.37, bottom: 1 }],
  [P("route-collines"), "lieu", "route-collines", { top: 0.18, bottom: 1 }],
  [P("vue-collines-jour"), "lieu", "vue-collines"],
  [P("terrasse-nuit-guirlandes"), "lieu", "terrasse-nuit-guirlandes"],
  [P("terrasse-nuit-vue"), "lieu", "terrasse-nuit-vue"],
  [P("guitare-live"), "lieu", "musique-live"],

  [P("longue-table"), "evenements", "longue-table"],
  [P("tables-vue-collines"), "evenements", "tables-vue-collines"],
  [P("table-terrasse-vue"), "evenements", "table-terrasse-vue"],
  [P("tables-soir"), "evenements", "tables-soir"],
  [P("tables-sous-tente"), "evenements", "tables-sous-tente"],
  [P("evenement-nuit"), "evenements", "evenement-nuit"],
  [P("table-dressee-vin"), "evenements", "table-dressee"],
  [P("four-pizza"), "evenements", "four-pizza"],
];

const sizes = {};
for (const [src, cat, name, crop] of PICKS) {
  const file = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  let pipe = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).metadata();
    const top = Math.round(height * crop.top);
    pipe = pipe.extract({ left: 0, top, width, height: Math.round(height * crop.bottom) - top });
  }
  const buf = await pipe.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  await writeFile(path.join(ROOT, "assets", cat, `${name}.jpg`), buf);
  const info = await sharp(buf)
    .modulate({ saturation: 1.04 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

// Image de partage (Open Graph) 1200 × 630 : terrasse au coucher du soleil, flou doux sur les côtés
const ogSrc = path.join(ROOT, "assets/picks/terrasse-coucher-fleurs.jpg");
const bg = await sharp(ogSrc).resize(1200, 630, { fit: "cover" }).blur(28).modulate({ brightness: 0.8 }).toBuffer();
const fg = await sharp(ogSrc).resize(354, 630, { fit: "cover" }).toBuffer();
await sharp(bg)
  .composite([{ input: fg, left: 423, top: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await copyFile(path.join(ROOT, "assets/raw/ramta_logo.jpg"), path.join(ROOT, "assets/logo-instagram.jpg"));
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${PICKS.length} images prêtes`);

// Boucles vidéo silencieuses (public/media/video/), coupées dans les reels avec ffmpeg, sans le son :
//   hero.mp4     reel De4h9PnNRsN, 2,0 → 3,9 s + 13,2 → 15,9 s (terrasse fleurie au coucher du soleil)
//   soir.mp4     reel DdwfRSrtsFS, 4,2 → 7,2 s + 12,0 → 14,0 s (terrasse sous les guirlandes, guitare live)
//   cuisine.mp4  reel DemheWHNrNT, 2,3 → 6,6 s (sauce sur le sandwich de bœuf effiloché)
//   voir scripts/videos.sh
