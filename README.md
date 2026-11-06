# Stephanie Roth – Portfolio

Statische Version meines Portfolios für **GitHub Pages**. Es braucht kein Squarespace mehr.
Die Seite ist ein 1:1-Nachbau der Squarespace-Version (`stephanie-roth.squarespace.com`): gleiche Seiten, Texte, Raster, Abstände, Farben und Bilder.

Live: https://stezzph.github.io/stephanie-portfolio/

## Seiten

| Datei | Squarespace-Seite |
|---|---|
| `index.html` | Home |
| `social-media.html` | Social Media (`/neue-seite`) |
| `social-media-projekte.html` | Social Media Projekte |
| `creative-work.html` | Creative Work (`/photo-videographie`) |
| `projekte.html` | Projekte (Videographie, Fotografie, Design) |
| `video-soerenberg.html`, `video-bettmeralp.html` | Video-Detailseiten |
| `swisscom-projekte.html` | Swisscom Projekte (nicht öffentlich, siehe unten) |
| `contact.html` | Kontakt |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `404.html` | Fehlerseite |

## Ordner

```
assets/
  css/site.css     Gestaltung (Farben, Schriften, Raster, Header, Menü …)
  js/site.js       Mobile-Menü, Galerie-Pfeile, Kontaktformular, Text-Skalierung
  fonts/           Schrift "Urbanist" (lokal, kein Google-Server)
  img/             alle Originalbilder aus Squarespace (WebP, je 2000 px + 1000 px)
  video/           hier kommen die Videodateien hin (siehe unten)
```

Die Layouts verwenden das gleiche Raster wie Squarespace (24 Spalten auf Desktop, 8 auf Mobile).
Die Positionen jedes Blocks stehen im `<style>`-Bereich der jeweiligen Seite (`.fe-block-…`).

## Bild austauschen

Neues Bild mit **gleichem Dateinamen** in `assets/img/` ablegen (z. B. `steph.webp`).
Wenn es eine `-1000.webp`-Version gibt, auch diese ersetzen (oder beide löschen und im HTML das `srcset` entfernen).

## Videos

Squarespace verschlüsselt seine Videos, deshalb wurden sie aus den Originaldateien neu erstellt (MP4, H.264, max. 1080p).

| Datei | Wo | Status |
|---|---|---|
| `assets/video/bluenews-1.mp4` | Social Media Projekte – Mayonnaise-Reel | ✅ |
| `assets/video/bluenews-2.mp4` | Social Media Projekte – Strassenumfrage Fashion-Trends 2026 | ✅ |
| `assets/video/tauschchallenge.mp4` | Social Media Projekte – Tauschchallenge (unter Blue News) | ✅ |
| `assets/video/swisscom-1.mp4` | Swisscom – Erklärvideo Data Literacy (Maya) | ✅ |
| `assets/video/swisscom-2.mp4` | Swisscom – «Mit welchen Tools arbeitest du?» (1:51) | ⏳ Datei fehlt |
| `assets/video/swisscom-3.mp4` | Swisscom – zweites Video (1:52) | ⏳ Datei fehlt |
| `assets/video/swisscom-4.mp4` | Swisscom – Startvideo Ryanne | ✅ |
| `assets/video/weihnachtsgeschichte.mp4` | Swisscom – Weihnachtsgeschichte Motion 2025 | ✅ |
| `assets/video/soerenberg.mp4` | Projekte → Sörenberg (ca. 0:11) | ⏳ Datei fehlt |
| `assets/video/bettmeralp.mp4` | Projekte → Bettmeralp | ✅ |
| `assets/video/goodbye-yesterday.mp4` | Projekte → Videographie, Goodbye Yesterday | ✅ |
| `assets/video/trikot-verlosung.mp4` | Projekte → Videographie, Trikot-Verlosung | ✅ |

Fehlt eine Datei, zeigt die Seite das Vorschaubild. Beim Abspielen erscheint der Hinweis, dass das Video bald verfügbar ist.
**Tipp:** Videos vor dem Hochladen verkleinern (z. B. mit HandBrake, Preset „Fast 1080p30“). GitHub erlaubt max. 100 MB pro Datei, besser unter 25 MB.

Neu ergänzt (gab es auf Squarespace noch nicht): ÜK-Portraits, Stillleben, «Lynn in Bewegung», Midoré-Café-Sitemap, Goodbye Yesterday, Trikot-Verlosung (Projekte), Tauschchallenge (Social Media) und das Weihnachtsvideo (Swisscom).

## Schrift

Squarespace nutzte **Gopher** von Adobe Fonts. Die Lizenz dafür läuft über das Squarespace-Abo.
Lokal eingebaut ist deshalb **Urbanist**: Sie ist kostenlos (SIL OFL) und Gopher sehr ähnlich.

Falls du Adobe Creative Cloud hast, kannst du Gopher selbst einbinden:
1. fonts.adobe.com → Gopher → „Zum Webprojekt hinzufügen“, Domain `stezzph.github.io` eintragen
2. Den `<link rel="stylesheet" href="https://use.typekit.net/xxxxxx.css">` in alle HTML-Dateien (im `<head>`) einfügen
3. In `assets/css/site.css` bei `--font-heading` und `--font-body` vorne `gopher,` ergänzen
(Dann im Datenschutz Adobe Fonts erwähnen.)

## Kontaktformular

GitHub Pages hat keinen Mailserver. Beim Absenden öffnet sich deshalb das **Mailprogramm** der Besucherin oder des Besuchers. Die Mail an steph.soraya@gmx.ch ist schon vorbereitet. Es braucht keinen externen Dienst und keine Cookies.

Optional, falls Nachrichten direkt ankommen sollen: ein kostenloser Formular-Dienst wie Formspree oder Web3Forms. Dafür brauchst du ein Konto, und im Datenschutz muss der Dienst ergänzt werden.

## Swisscom Projekte (Passwortschutz)

GitHub Pages kann **keine Seite sicher mit Passwort schützen**. Zudem ist das Repository öffentlich: Alles, was hier hochgeladen wird, kann jede Person sehen, auch Bilder.
Auf Wunsch ist die Seite **öffentlich, aber versteckt**:
- Sie ist **nicht in der Navigation** verlinkt (nur über die Karte „Swisscom Arbeiten“ auf Creative Work).
- Sie hat `noindex`, erscheint also nicht in Google.
- Wer den Link oder dieses Repository kennt, kann die Inhalte trotzdem sehen.

Videos der Swisscom-Seite: siehe Tabelle oben.

Sinnvolle Optionen für einen echten Passwortschutz (alle kostenlos):
1. **Cloudflare Pages + Cloudflare Access** (empfohlen): Die ganze Seite oder nur `/swisscom-projekte` ist geschützt. Der Login läuft über einen Einmal-Code per E-Mail, bis 50 Personen gratis. Das ist echter serverseitiger Schutz.
2. **Separates privates Repository + Netlify** mit Basic-Auth (Passwort) – bei Netlify kostenpflichtig, daher eher Option 1.
3. **Verschlüsselte Seite (z. B. StatiCrypt)**: Der Inhalt wird mit dem Passwort verschlüsselt, die Bilder müssen dafür direkt in die Seite eingebettet werden. Das ist sicher, solange das Passwort stark ist.

## Lokal ansehen

Im Projektordner `python3 -m http.server` ausführen und `http://localhost:8000` öffnen.

## Veröffentlichen

Repository → **Settings → Pages** → Source: „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
Nach jedem Push ist die Seite nach ca. 1 Minute aktualisiert.

**Eigene Domain** (optional, z. B. `stephanieroth.ch`): Die Domain kostet ca. 10–20 CHF pro Jahr. In Settings → Pages unter „Custom domain“ eintragen und beim Domain-Anbieter einen CNAME auf `stezzph.github.io` setzen.

---
Schrift Urbanist: © The Urbanist Project Authors, SIL Open Font License 1.1 (`assets/fonts/Urbanist-OFL.txt`).
