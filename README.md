# VENT

*Something in the vents is working on your coin.*

Eget varumärke byggt på en rekonstruktion av lurks.fun. Layouten och mekaniken kommer från referensen; namn, logga, entiteter, texter och färg är VENT:s egna.

Ursprunglig referens: https://lurks.fun/ (inspekterad 2026-10-14)

Vite + React 19 + TypeScript (strict) + react-router-dom 7. Inga andra runtime-beroenden utöver en lokalt bundlad font (`@fontsource/jetbrains-mono`).


## Starta

**Windows:** dubbelklicka `start.bat` (installerar dependencies första gången, öppnar http://localhost:5173).

Manuellt:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b + vite build -> dist/
npm run preview    # serva dist/
```

Kräver Node 18+.

## Routes

| Route | Sida | Innehåll |
|---|---|---|
| `/` | Startsida | CA-ruta + roll-accordion, hero med galler + VENT-logga och "open a vent", duct map där entiteterna kryper, roster, coin-tabell, maintenance manual, exhaust-staplar |
| `/demo` | The job | 7-stegs pipeline (queued/working/done) + output-panel. `?simulate=1` spelar upp en körning lokalt |
| `/teams` | Entities | 7 entity-kort + dossier. `?agent=lead\|research\|web\|content\|social\|marketing\|creative` |
| `/coins` | Coin index | Sök, sortering (market cap/24h/volume/newest), filter (all/team active/saved), spara coin |
| `/coins/:id` | Coin-sida (dynamisk mall) | Stats, 24h-graf (SVG) med gate-linjer, gate-progress, team-status, externa länkar |
| `/leaderboard` | Leaderboard | Rankad tabell, sort + filter |
| `/milestones` | Milestones | Filter (all/market cap/holders/graduation), refresh |
| `/protocol` | Protocol | Lång manual med sticky TOC (8 sektioner, tabeller, split-kort) |
| `/docs` | Maintenance manual | Samma manual-komponent, annan hero |
| `/studio` | Studio | Projektlista, review queue (edit/approve/cancel/copy/PNG/ASCII), identity, website-preview |
| `/launch` | Launch | Ny coin eller länka befintlig, bilduppladdning, live-kvitto |
| `/terms`, `/privacy` | Juridik | Neutral omskrivning |
| `*` | 404 | |

`/coins/:id` är härledd (protokollet nämner "coin index and charts") – den exakta URL:en på referensen kunde inte verifieras.

## Projektstruktur

```
src/
  components/   Header, Footer, Wallet, Bracket-knappar, TermWindow, AsciiHeading,
                CaBox, RoleAccordion, EntityWorld, CoinsTable, CoinControls, FeeBars, Manual, PageHero
  layouts/      SiteLayout (header, main, footer, wallet-modal, titlar, scroll-reset)
  pages/        en fil per route
  routes/       router.tsx
  hooks/        useApp (wallet, toast, projekt, sparade coins), useAsync, useReveal
  lib/          api.ts (fixtures + valfri Dexscreener), format.ts, storage.ts
  data/         site.ts (brand + copy), entities.ts, manual.ts, ascii.ts
  styles/       tokens.css (alla färger/typ/mått), global.css
public/
  api/          coins.json, milestones.json, assignment.json (fixtures)
  assets/       favicon.svg, og.png (lokal ersättare)
```

## Responsivt

Breakpoints: 1280 (rail blir topp-band), 1024 (en kolumn, hamburgermeny), 768 (mobil), 560 (kompakt). Verifierat utan horisontell overflow på 390, 768 och 1280 för alla routes.

## API / mock-data

All data läses från `public/api/*.json` via `src/lib/api.ts`. Byt bas-URL med `VITE_API_BASE`.

- **Coins** – 10 påhittade demo-coins (CA börjar med `Demo…`). Saknade värden visas som "unavailable".
- **Milestones** – 7 demo-händelser.
- **Assignment** – status `waiting` som på referensen; `?simulate=1` spelar upp fixture-outputs.
- **Dexscreener** – `VITE_LIVE_MARKET=1` berikar coins med riktiga mint-adresser via Dexscreeners publika API (read-only).

## Auth / wallet

- "Connect wallet" öppnar en modal: **Phantom** (om installerat – hämtar bara public key) eller **Demo wallet** (lokalt).
- States: disconnected → connecting → connected / error. Klick på adressen kopplar från.
- Ingen signering, inga nycklar. `TODO(backend)`: signerad meddelandeverifiering + kontroll av creation-transaktionen vid länkning.

## Web3

Solana / pump.fun. Inga kontrakt anropas. Externa länkar (Dexscreener, pump.fun, Solscan) byggs från CA och är avstängda för demo-coins.

## Lokalt state

Studio-projekt, sparade coins och wallet-läge sparas i `localStorage` (med try/catch). Referensen använder server-cookie + Vercel Blob – `TODO(backend)`.

## TODO(backend)

Sök på `TODO(backend)` i koden:

- Riktigt coin-index, milestones och assignment-feed (`src/lib/api.ts`)
- Wallet-verifiering (signerat meddelande) och creation-tx-kontroll (`hooks/useApp.tsx`, `pages/Launch.tsx`)
- Native mint / "Launch on pump.fun" (`pages/Launch.tsx`)
- Kreativ cykel som genererar posts (`seedPosts` i `hooks/useApp.tsx`)
- X OAuth + "Publish on X", publicera coin-webbplats (`pages/Studio.tsx`)

## Varumärket

- **Namn:** VENT, ticker $VENT. Tagline: "Seven in the vents. One coin upstairs."
- **Logga:** ventilationsgaller med två lime-ögon (`src/components/VentMark.tsx`, `public/assets/favicon.svg`). ASCII-versionen i heron blinkar.
- **Färg:** svart och grå metall + en enda färg, lime `#c8ff2e` (ögonen).
- **Entiteter:** 01 HUM (team lead), 02 DUST (research), 03 RUST (web), 04 CREAK (content), 05 DRAFT (social), 06 SOOT (marketing), 07 FLICKER (creative).
- **Ordlista:** crewet vaknar = *humming*, under gaten = *quiet*, ofullständig data = *listening*, $30K = *soot on the walls*, fees = *exhaust*.

## Rebranda

1. `src/data/site.ts` – namn, mark, ticker, CA, tagline, all startsidecopy.
2. `src/data/entities.ts` – namn, roller, sprites, tankar.
3. `src/data/manual.ts` – protokoll/docs-text.
4. `src/styles/tokens.css` – färger, font, mått.
5. `index.html` + `public/assets/` – titel, meta, og.png, favicon.
6. `src/pages/Legal.tsx` – egna villkor.

Se även `BRANDING_TODO.md`.

## Deploy (Vercel)

Importera repot i Vercel. Framework: **Vite**, build: `npm run build`, output: `dist`. `vercel.json` skickar alla routes till `index.html` så att `/teams`, `/coins/:id` osv. fungerar vid direktlänk.
