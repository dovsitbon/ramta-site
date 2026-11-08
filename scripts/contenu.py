"""Génère CONTENU.md : tous les textes du site dans les 4 langues + la carte, pour validation par le client.
    python scripts/contenu.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["he", "en", "fr", "es"]
NAMES = {"he": "עברית", "en": "English", "fr": "Français", "es": "Español"}
loc = {l: json.loads((ROOT / "locales" / f"{l}.json").read_text(encoding="utf-8")) for l in LANGS}
carte = json.loads((ROOT / "data" / "carte.json").read_text(encoding="utf-8"))


def flat(d, prefix=""):
    if isinstance(d, dict):
        for k, v in d.items():
            yield from flat(v, f"{prefix}.{k}" if prefix else k)
    elif isinstance(d, list):
        for i, v in enumerate(d):
            yield from flat(v, f"{prefix}[{i}]")
    else:
        yield prefix, d


out = ["# Ramta – contenu du site (à valider)", "", "Généré par `scripts/contenu.py` depuis `locales/*.json` et `data/carte.json`. Les modifications se font dans ces fichiers.", ""]

out += ["## La carte", "", f"Mise à jour : {carte['updated']}. Prix : « à remplir » tant qu'ils ne sont pas confirmés.", ""]
for cat in carte["categories"]:
    out += [f"### {loc['fr']['menu']['tabs'][cat['id']]} / {loc['he']['menu']['tabs'][cat['id']]}", ""]
    for it in cat["items"]:
        price = f"{it['price']} ₪" if it["price"] is not None else "à remplir"
        flags = " — **emplacement à remplir**" if it.get("placeholder") else (" — à confirmer" if it.get("sample") else "")
        out.append(f"- **{it['name']['he']}** ({price}){flags}")
        for l in LANGS:
            out.append(f"  - {NAMES[l]} : {it['name'][l]} — {it['desc'][l]}")
    out.append("")

out += ["## Textes du site", ""]
sections = [k for k in loc["he"].keys() if k != "alt"] + ["alt"]
for sec in sections:
    out += [f"### {sec}", "", "| clé | " + " | ".join(NAMES[l] for l in LANGS) + " |", "|---|" + "---|" * len(LANGS)]
    rows = {l: dict(flat(loc[l][sec])) for l in LANGS}
    for key in rows["he"]:
        cells = [str(rows[l].get(key, "")).replace("|", "\\|").replace("\n", " ") for l in LANGS]
        out.append(f"| {key or sec} | " + " | ".join(cells) + " |")
    out.append("")

(ROOT / "CONTENU.md").write_text("\n".join(out), encoding="utf-8")
print("CONTENU.md écrit")
