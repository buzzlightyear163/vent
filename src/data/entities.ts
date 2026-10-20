export type EntityId = 'lead' | 'research' | 'web' | 'content' | 'social' | 'marketing' | 'creative';

export interface Entity {
  id: EntityId;
  idx: string;
  name: string;
  role: string;
  runtime: string;
  cadence: string;
  sprite: string;
  thoughts: string[];
  brief: string;
  duties: string[];
}

// TODO(branding): `runtime` is the model/engine label shown in the UI. Set it to what actually runs the crew.
const RUNTIME = 'Codex';

export const entities: Entity[] = [
  {
    id: 'lead',
    idx: '01',
    name: 'HUM',
    role: 'Team lead',
    runtime: RUNTIME,
    cadence: 'Every 15 minutes',
    sprite: ' .==. \n[o  o]\n |==| \n /  \\ ',
    thoughts: ['keeping the air moving', 'reading the ten-minute low', 'waking the other six', 'listening to the whole building'],
    brief: 'The constant sound behind everything. Runs the cycle, briefs the crew and decides what leaves the ducts.',
    duties: ['Cycle supervision', 'Briefs and hand-offs', 'Final review before the queue'],
  },
  {
    id: 'research',
    idx: '02',
    name: 'DUST',
    role: 'Research',
    runtime: RUNTIME,
    cadence: 'Each creative cycle',
    sprite: ' .::. \n(°  °)\n :||: \n ´  ` ',
    thoughts: ['settling on every timeline', 'collecting what the chart forgot', 'getting into places it should not'],
    brief: 'Gets in everywhere. Collects context on the coin, its holders and the current meta, then settles it into a brief.',
    duties: ['Narrative research', 'Community signals', 'Context brief'],
  },
  {
    id: 'web',
    idx: '03',
    name: 'RUST',
    role: 'Web',
    runtime: RUNTIME,
    cadence: 'Each creative cycle',
    sprite: '[====]\n[o__o]\n |##| \n_|  |_',
    thoughts: ['bolting a new section on', 'holding the structure together', 'shipping a page at 4am'],
    brief: 'Holds the structure together. Builds and maintains the coin website so the project always has a home.',
    duties: ['Coin website', 'Page updates', 'Links and metadata'],
  },
  {
    id: 'content',
    idx: '04',
    name: 'CREAK',
    role: 'Content',
    runtime: RUNTIME,
    cadence: 'Each creative cycle',
    sprite: '  /\\  \n (oo) \n /==\\ \n  ||  ',
    thoughts: ['rewriting one joke nine ways', 'cutting a caption to the bone', 'making the quiet parts loud'],
    brief: 'The voice in the walls. Writes captions, lore and every line the cycle produces.',
    duties: ['Captions', 'Lore and copy', 'Tone of voice'],
  },
  {
    id: 'social',
    idx: '05',
    name: 'DRAFT',
    role: 'Social',
    runtime: RUNTIME,
    cadence: 'Creator review',
    sprite: ' ~~~  \n(o o) \n ~||~ \n  /\\  ',
    thoughts: ['holding three drafts for you', 'waiting for your approval', 'timing the next post'],
    brief: 'Moves posts through the ducts and into your review queue. Nothing leaves without your approval.',
    duties: ['Post queue', 'Scheduling', 'Publishing after approval'],
  },
  {
    id: 'marketing',
    idx: '06',
    name: 'SOOT',
    role: 'Marketing',
    runtime: RUNTIME,
    cadence: 'On schedule / at milestones',
    sprite: ' ####  \n(x  x) \n /##\\  \n /  \\  ',
    thoughts: ['measuring the distance to $30K', 'drafting listing copy', 'leaving marks on the walls'],
    brief: 'Leaves marks wherever it goes. Plans pushes around milestones and prepares the listing package once the coin earns it.',
    duties: ['Campaign timing', 'Listing copy', 'Milestone packages'],
  },
  {
    id: 'creative',
    idx: '07',
    name: 'FLICKER',
    role: 'Creative',
    runtime: RUNTIME,
    cadence: 'Each creative cycle',
    sprite: ' \\|/  \n(*  *)\n /||\\ \n /  \\ ',
    thoughts: ['rendering the mascot through the grille', 'breaking a perfectly good PNG', 'choosing the wrong light on purpose'],
    brief: 'The light behind the slats. Produces the artwork: memes, banners and ASCII renders for every cycle.',
    duties: ['Meme artwork', 'Banners', 'ASCII renders'],
  },
];

export const entityById = (id: string | null | undefined): Entity | undefined =>
  entities.find((e) => e.id === id);
