# Ramta – infos à demander au client

Ce qui est déjà sur le site vient de leur Instagram public (bio, affiches, reels) et du lieu Waze de leur bio. Tout le reste est marqué « à remplir » ou « à confirmer ».

## À confirmer en priorité

1. **Horaires d'hiver** : le site affiche mar. et mer. 12 h – 22 h, jeu. 12 h – 23 h (affiche épinglée d'août). Ils ont annoncé une « ouverture d'hiver » le 31/10 : ces horaires sont-ils toujours bons ? Fermetures prévues (fêtes) ? → `data/horaires.json`
2. **Numéro WhatsApp des demandes** : aujourd'hui, les demandes d'événement partent au 058-511-6176 (Youval, d'après l'affiche « עכשיו גם אירועים »), et les commandes et questions au 055-465-5007 (bio). Est-ce bien ça ? → `data/site.json`
3. **Cacheroute** : « כשר למהדרין » est écrit sur leur affiche. Quel organisme certifie ? Une photo du certificat ? → `data/site.json` (`kosher.certifier`)
4. **Emplacement exact** : coordonnées prises sur leur lieu Waze « פודטראק רמתא ברוכין » (32.08317, 35.09968). Ont-ils une fiche Google Maps (Google Business Profile) ? Si non, en créer une : c'est le levier n° 1 pour « פודטראק בשומרון ». Confirmer l'ancien emplacement de la ferme Tel Hemed (חוות תל חמד).
5. **Parking** : le site dit « parking gratuit à côté du lieu », d'après les voitures visibles dans un reel. À confirmer.

## Contenu à fournir

6. **La carte complète et les prix** (la story à la une « תפריט ») : burgers, sandwichs, planches, plats d'hiver, accompagnements, boissons. Aujourd'hui : 6 plats vus sur Instagram, descriptions déduites des vidéos (à valider), et 4 emplacements « à remplir ». → `data/carte.json`
7. **Événements** : capacité (assis / debout), formules et prix par personne, ce qui est inclus (tables, nappes, musique, DJ, four à pizza vu dans un reel ?), délai de réservation. → `data/evenements.json`
8. **Commande à l'avance pour retrait** : ils la veulent ? (elle est en ligne, désactivable). Délai minimum (aujourd'hui : 30 min).
9. **Leurs prénoms et leur histoire** : qui est derrière Ramta, le lien avec la ferme, pourquoi « Ramta » (le nom évoque la hauteur, le plateau : à valider).
10. **Photos et vidéos en bonne qualité** : le site n'a que des images d'Instagram (640–720 px). Il faut surtout : les plats en gros plan (lumière du jour), le food truck de face, la terrasse au coucher du soleil en paysage (pour le grand écran), un événement dressé, une soirée musique live. Sans visages de clients reconnaissables (ou avec leur accord).
11. **Le logo en fichier original** (SVG, PDF ou PNG haute définition) : le site utilise un logo redessiné d'après leur photo de profil.
12. **Soirées musique live** : fréquence, jours ? Le bandeau du haut peut les annoncer. → `data/annonces.json`
13. **Liens** : URL Facebook exacte (le site utilise facebook.com/1147454011775516), une adresse e-mail éventuelle.

## Notes

- Le site ramta-foodtruck.vercel.app existe déjà chez un tiers (« רמתא — קולינריית בשרים מעושנים ») : savoir si c'est à eux.
- 12 publications Instagram sur 19 étaient visibles sans connexion ; 8 reels ont été récupérés pour en extraire des images nettes.
