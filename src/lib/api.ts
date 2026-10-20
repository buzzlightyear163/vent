import type { EntityId } from '../data/entities';

export type TeamState = 'working' | 'paused' | 'observing' | 'dex';

export interface Coin {
  id: string;
  ticker: string;
  name: string;
  ca: string;
  marketCap: number | null;
  change24h: number | null;
  volume24h: number | null;
  team: TeamState;
  holders: number | null;
  ageDays: number;
  series: number[] | null;
}

export interface Milestone {
  id: string;
  kind: 'marketcap' | 'holders' | 'graduation';
  coin: string;
  title: string;
  detail: string;
  at: string;
}

export type StepState = 'queued' | 'working' | 'done';

export interface Assignment {
  status: 'waiting' | 'running' | 'complete';
  operator: string;
  steps: Record<EntityId, StepState>;
  outputs: Partial<Record<EntityId, string>>;
  simulation: Record<EntityId, string>;
}

// TODO(backend): replace the static fixtures in /public/api with the real VENT API.
const base = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${base}/${path}`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  coins: () => getJSON<{ coins: Coin[]; updatedAt: string }>('coins.json').then((d) => d.coins),
  milestones: () => getJSON<{ milestones: Milestone[] }>('milestones.json').then((d) => d.milestones),
  assignment: () => getJSON<Assignment>('assignment.json'),
};

/**
 * Optional read-only enrichment from Dexscreener's public API.
 * Enabled with VITE_LIVE_MARKET=1 – only real mint addresses resolve.
 */
export async function enrichFromDexscreener(coins: Coin[]): Promise<Coin[]> {
  if (import.meta.env.VITE_LIVE_MARKET !== '1') return coins;
  const real = coins.filter((c) => !c.ca.startsWith('Demo'));
  if (!real.length) return coins;
  try {
    const res = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${real.map((c) => c.ca).join(',')}`,
    );
    if (!res.ok) return coins;
    const pairs = (await res.json()) as {
      baseToken: { address: string };
      marketCap?: number;
      fdv?: number;
      priceChange?: { h24?: number };
      volume?: { h24?: number };
    }[];
    return coins.map((c) => {
      const p = pairs.find((x) => x.baseToken.address === c.ca);
      if (!p) return c;
      return {
        ...c,
        marketCap: p.marketCap ?? p.fdv ?? c.marketCap,
        change24h: p.priceChange?.h24 ?? c.change24h,
        volume24h: p.volume?.h24 ?? c.volume24h,
      };
    });
  } catch {
    return coins;
  }
}
