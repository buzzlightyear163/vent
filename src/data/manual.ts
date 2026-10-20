import { entities } from './entities';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'flow'; steps: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'splits'; items: { value: string; label: string }[] }
  | { type: 'link'; to: string; label: string };

export interface ManualSection {
  id: string;
  nav: string;
  title: string;
  blocks: Block[];
}

export const manualSections: ManualSection[] = [
  {
    id: 'launch',
    nav: 'Open a vent',
    title: 'Name it. Open a vent.',
    blocks: [
      {
        type: 'p',
        text: 'VENT pairs a memecoin with seven AI entities that live in its ducts. You bring a name, a ticker, an image and optional links. The launch receipt shows the creator fee, the activation gate and an optional dev buy.',
      },
      { type: 'flow', steps: ['Your coin', 'Seven entities', 'Something living in the walls'] },
      {
        type: 'p',
        text: 'Create a private project, let the crew prepare a creative pack, review it and publish a coin website. Linking a live coin requires the wallet that signed its creation transaction.',
      },
      {
        type: 'p',
        text: 'Native token creation and the creator fee wait for the $VENT pairing mint and treasury wallet. Existing coins can be linked now.',
      },
      { type: 'link', to: '/launch', label: 'Open a vent ↗' },
    ],
  },
  {
    id: 'gate',
    nav: 'The hum',
    title: 'The ten-minute hum.',
    blocks: [
      {
        type: 'p',
        text: 'The crew wakes when the lowest market cap across the last ten minutes is at least $10,000. A spike is not airflow. Ten steady minutes is.',
      },
      {
        type: 'table',
        head: ['Ten-minute low', 'State', 'What happens'],
        rows: [
          ['Incomplete history', 'Listening', 'Waiting for valid observations'],
          ['Below $10K', 'Quiet', 'Crew rests; website stays up'],
          ['$10K or above', 'Humming', 'Crew starts or resumes'],
          ['$30K or above', 'Soot on the walls', 'Dexscreener milestone unlocks'],
        ],
      },
      {
        type: 'p',
        text: 'A worker records live observations around the clock. Missing, stale or partial data keeps the crew listening. Manual creative prep is available before launch.',
      },
    ],
  },
  {
    id: 'team',
    nav: 'The entities',
    title: 'Seven things in the ducts.',
    blocks: [
      {
        type: 'table',
        head: ['Entity / role', 'Runtime', 'Cadence'],
        rows: entities.map((e) => [`${e.name} / ${e.role}`, e.runtime, e.cadence]),
      },
      {
        type: 'p',
        text: 'Together they cover research, the website, copy, social, marketing, artwork and supervision. Linked coins above the gate get a creative cycle every fifteen minutes; drafts can request packs by hand.',
      },
      {
        type: 'p',
        text: 'Every job records its engine and an output ID. The personalities are a character layer on top of a real generation pipeline. Video is not connected.',
      },
    ],
  },
  {
    id: 'review',
    nav: 'Review',
    title: 'Nothing leaves without you.',
    blocks: [
      {
        type: 'p',
        text: 'Every post the crew makes lands in your review queue. Edit it, cancel it, copy it, or download the artwork as PNG or ASCII. Changes save to your studio.',
      },
      {
        type: 'p',
        text: 'Approve artwork and captions first. Then connect X, let the ten-minute review window pass and publish from the studio.',
      },
    ],
  },
  {
    id: 'fees',
    nav: 'Exhaust',
    title: 'Exhaust.',
    blocks: [
      { type: 'p', text: 'The planned protocol takes a 1% creator fee and splits it three ways.' },
      {
        type: 'splits',
        items: [
          { value: '50%', label: 'Burned permanently' },
          { value: '25%', label: 'Eligible holders' },
          { value: '25%', label: 'Crew + listings' },
        ],
      },
      {
        type: 'p',
        text: 'Holders qualify with at least 500,000 $VENT across two snapshots fifteen minutes apart. Rewards use the smaller balance and skip pools, lockers, exchanges and crew wallets. Collection starts once the mint and treasury are configured.',
      },
    ],
  },
  {
    id: 'listing',
    nav: 'Dexscreener',
    title: 'Soot on the walls.',
    blocks: [
      {
        type: 'p',
        text: 'A sustained $30,000 market cap unlocks the Dexscreener milestone. SOOT prepares the package: logo, banner, description and links. Paying for the listing is not connected yet.',
      },
      { type: 'link', to: '/milestones', label: 'View milestones ↗' },
    ],
  },
  {
    id: 'graduation',
    nav: 'Graduation',
    title: 'From curve to pool.',
    blocks: [
      {
        type: 'p',
        text: 'Coins start on a pump.fun bonding curve and graduate to PumpSwap. The pairing asset sets the curve target and the pool. Coin pages link out to trading and data services by contract address.',
      },
    ],
  },
  {
    id: 'mode',
    nav: 'Running now',
    title: "What's running now.",
    blocks: [
      {
        type: 'p',
        text: 'The whole site is live: launch prep, the coin index and charts, entity files, the studio, post review, the leaderboard, milestones and this manual. Drafts and settings stay in private, browser-scoped storage.',
      },
      {
        type: 'p',
        text: 'Only registered coins, real observations and finished jobs appear. Wallet verification checks a signed message. Native minting, fee distribution, paid listings and video are not live yet.',
      },
    ],
  },
];
