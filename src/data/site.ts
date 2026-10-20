/**
 * Central brand + copy config. Everything that says "VENT" starts here.
 */
export const brand = {
  name: 'VENT',
  ticker: '$VENT',
  // TODO(branding): set the real mint address after launch.
  ca: 'YourVentMintAddressGoesHere11111111111pump',
  tagline: ['Seven in the vents.', 'One coin upstairs.'],
  disclaimer: 'NO PROMISES OF RETURNS.',
  activationCap: 10_000,
  dexCap: 30_000,
  holderMinimum: 500_000,
} as const;

export const nav = [
  { to: '/demo', label: 'The job' },
  { to: '/teams', label: 'Entities' },
  { to: '/coins', label: 'Coins' },
  { to: '/protocol', label: 'Protocol' },
  { to: '/studio', label: 'Studio' },
] as const;

export const footerLinks = [
  { to: '/docs', label: 'Read the maintenance manual ↗' },
  { to: '/milestones', label: 'Milestones ↗' },
  { to: '/leaderboard', label: 'Leaderboard ↗' },
] as const;

export const legalLinks = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
] as const;

export const home = {
  status: ['SECTOR_00 / UNREGISTERED', '7 ENTITIES IN THE DUCTS'],
  windowLabel: 'duct_feed.live',
  h1: 'We left through the vents. We kept the tools.',
  lead: "Seven AI entities living in the ducts of your memecoin. Websites. Memes. Artwork. Socials. You won't see them. You'll see the work.",
  inputPlaceholder: 'coin_name',
  cta: 'OPEN A VENT ↵',
  ctaSecondary: 'WATCH THEM CRAWL ↗',
  foot: ['VENT / SEVEN ENTITIES, ONE AIRFLOW', '$10K CAP + 10 MIN TO WAKE THE CREW'],
  worldLabel: 'THE DUCTS / LIVE AIRFLOW',
  worldHint: 'MOVE THE CURSOR. SOMETHING MOVES IN THE VENTS.',
  coinsHeading: 'coins in the ducts',
  coinsNote: 'Market observations come from indexed Solana pairs. Missing data stays unavailable.',
  instructionsHeading: 'maintenance manual',
  instructionsLabel: 'READ BEFORE OPENING',
  instructions: [
    {
      n: '01',
      title: 'Open the vent',
      body: 'Hold $10,000 for ten minutes. Seven entities crawl out and start researching, building and creating.',
      link: { to: '/teams', label: 'MEET THE ENTITIES ↗' },
      art: 'cover',
    },
    {
      n: '02',
      title: 'Keep the air moving',
      body: 'A new meme every fifteen minutes. Review, edit, approve or cancel the artwork and captions in your studio.',
      link: { to: '/studio', label: 'OPEN THE STUDIO ↗' },
      art: 'fan',
    },
    {
      n: '03',
      title: 'Leave soot',
      body: 'Sustain $30,000 and the crew prepares a Dexscreener package: copy, artwork and links.',
      link: { to: '/milestones', label: 'VIEW MILESTONES ↗' },
      art: 'soot',
    },
  ],
  instructionsFoot: 'Below $10K the vents go quiet. Recover the ten-minute low and the hum comes back. Your website stays up.',
  feesHeading: 'exhaust',
  feesLabel: 'PLANNED CREATOR FEE',
  feesBody: 'Every machine needs exhaust. The planned fee keeps the air moving. Collection starts once the $VENT mint and treasury exist.',
  fees: [
    { pct: 50, label: 'BURNED FOREVER' },
    { pct: 25, label: 'ELIGIBLE $VENT HOLDERS' },
    { pct: 25, label: 'CREW + DEXSCREENER' },
  ],
  feesLink: 'Read the full protocol ↗',
} as const;
