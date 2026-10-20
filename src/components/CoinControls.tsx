import { useMemo } from 'react';
import type { Coin } from '../lib/api';

export type SortKey = 'mcap' | 'change' | 'volume' | 'newest';
export type FilterKey = 'all' | 'active' | 'saved';

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'mcap', label: 'Market cap' },
  { key: 'change', label: '24h change' },
  { key: 'volume', label: 'Volume' },
  { key: 'newest', label: 'Newest' },
];

export const filterOptions: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All coins' },
  { key: 'active', label: 'Team active' },
  { key: 'saved', label: 'Saved' },
];

const nullLast = (a: number | null, b: number | null) => (b ?? -Infinity) - (a ?? -Infinity);

export function useCoinQuery(coins: Coin[] | null, q: string, sort: SortKey, filter: FilterKey, saved: string[]) {
  return useMemo(() => {
    if (!coins) return null;
    const needle = q.trim().toLowerCase().replace(/^\$/, '');
    let list = coins.filter(
      (c) =>
        !needle ||
        c.name.toLowerCase().includes(needle) ||
        c.ticker.toLowerCase().includes(needle) ||
        c.ca.toLowerCase().includes(needle),
    );
    if (filter === 'active') list = list.filter((c) => c.team === 'working' || c.team === 'dex');
    if (filter === 'saved') list = list.filter((c) => saved.includes(c.id));
    const sorted = [...list];
    if (sort === 'mcap') sorted.sort((a, b) => nullLast(a.marketCap, b.marketCap));
    if (sort === 'change') sorted.sort((a, b) => nullLast(a.change24h, b.change24h));
    if (sort === 'volume') sorted.sort((a, b) => nullLast(a.volume24h, b.volume24h));
    if (sort === 'newest') sorted.sort((a, b) => a.ageDays - b.ageDays);
    return sorted;
  }, [coins, q, sort, filter, saved]);
}

export function Pills<K extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { key: K; label: string }[];
  value: K;
  onChange: (k: K) => void;
  label: string;
}) {
  return (
    <div className="group" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          className={`pill${value === o.key ? ' on' : ''}`}
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
