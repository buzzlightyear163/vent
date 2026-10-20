# Referensanalys – lurks.fun

> Den här filen beskriver originalet som VENT byggdes från. VENT har eget namn, logga, entiteter, texter och färg.

Inspekterad 2026-10-14. **Metod:** sidinnehåll hämtat per route via webbhämtning (text, rubriker, länkar, labels, tabeller, ASCII-beskrivningar). Ingen browser var nåbar, så DOM-mått, CSS, nätverksanrop och screenshots av referensen saknas. Allt under "Design system" som inte står i texten är därför en tolkning.

## Routes (publikt länkade)

`/`, `/demo`, `/teams` (+ `?agent=lead`), `/coins`, `/protocol`, `/studio`, `/launch`, `/milestones`, `/docs`, `/leaderboard`, `/terms`, `/privacy`.
`robots.txt` och `sitemap.xml` svarade inte. Coin-detaljsidor finns enligt protokolltexten men URL-mönstret kunde inte ses → byggt som `/coins/:id`.

## Layout

- Sticky header: `LURK//` · The assignment · Entities · Coins · Protocol · Studio · `[ Connect wallet ]` · `Launch ↗` · `≡` (mobil).
- Startsida i DOM-ordning: `$LURK / CA` + COPY → accordion `01 / Team lead … 07 / Creative [ + ]` → `++++` → hero (`SECTOR_00 / UNREGISTERED`, `7 ENTITIES DETECTED`, fönster `incoming transmission [_][x]` med 5-radig ASCII-logga, H1, input `> coin_name`, `[ CREATE A PROJECT ↵ ]`, `[[ WATCH THE ENTITIES WORK ↗ ]]`, två statusrader) → entity-panel (`entity_01.log [::]`, namn, `Team lead / Codex`, `> sorting thoughts by volatility_`, `LOCAL LARP / ENTITY PERFORMANCE`, `[[ OPEN DOSSIER ↗ ]]`, `MOVE THE CURSOR. THE COMPOUND NOTICES.`, `[ PAUSE WORLD ]`) → roster 01–07 med `[*]`/`[ ]` → sektioner med rubriker i formatet `+-- titel --+`.
- Tolkning: CA + accordion som vänster "rail", hero i mitten, interaktiv värld + entity-panel till höger (desktop). Världen syns inte i texten men antyds av "the compound notices" + "pause world".
- Inre sidor: label-rad, stor H1, ingress, sedan innehåll. Gemensam footer: `LURK//`, "Seven minds. One strange little coin.", tre länkar, Terms/Privacy, `NO PROMISES OF RETURNS.`

## Design system (tolkat)

- Terminal/ASCII-estetik: hakparenteser på knappar (`[ X ]`, `[[ X ↗ ]]`), monospace, versala små labels, `+--`-rubriker, ASCII-staplar `[####......]` (20 tecken, 50 % = full).
- Typsnitt: monospace genomgående (referensen säger att fonter är self-hosted, inga tredjepartstjänster) → JetBrains Mono, bundlad.
- Färger: mörk bakgrund, varm off-white, en syrlig accent – **ej uppmätt**.
- Inga radier, 1px-linjer, rutnät utan skuggor.

## Breakpoints (implementerade)

1280 / 1024 / 768 / 560.

## Komponenter

Header, MobileDrawer, WalletButton + WalletModal, BracketLink/BracketButton, TermWindow, AsciiHeading, CaBox, RoleAccordion, EntityWorld, Roster, CoinsTable (+ sök/sort/filter/spara), FeeBars, Manual (TOC + sektioner + tabeller), PageHero, Toast.

## Animationer

Blinkande cursor, typewriter i entity-loggen, entities som vandrar och flyr cursorn (rAF), pausbar värld, accordion (grid-rows), scroll-reveal, hover på kort/rader, progress i assignment. Respekterar `prefers-reduced-motion`.

## Funktioner på referensen

- Coin-data från indexerade Solana-par (Dexscreener, server-side).
- Wallet: signerat meddelande; länkning kontrollerar creation-tx.
- Studio: review queue, edit/cancel/copy, PNG/ASCII-nedladdning, Publish on X efter 10 min review-fönster.
- Gate: 10-minuters lägsta market cap ≥ $10K = team arbetar; $30K = Dex-milstolpe.
- Planerad 1 % creator fee: 50 burn / 25 holders (≥500 000 tokens, två snapshots) / 25 AI + listings.

## Externa integrationer (referens)

Dexscreener, pump.fun / PumpSwap, X OAuth, Vercel Blob, en Codex-worker. Ingen av dessa är kopplad i klonen förutom valfri read-only Dexscreener.
