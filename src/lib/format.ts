export const usdCompact = (n: number | null | undefined): string => {
  if (n == null || !Number.isFinite(n)) return 'unavailable';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

export const pct = (n: number | null | undefined): string => {
  if (n == null || !Number.isFinite(n)) return '—';
  const s = n > 0 ? '+' : '';
  return `${s}${n.toFixed(1)}%`;
};

export const shortAddr = (a: string, head = 4, tail = 4): string =>
  a.length <= head + tail + 1 ? a : `${a.slice(0, head)}…${a.slice(-tail)}`;

export const timeAgo = (iso: string, now = Date.now()): string => {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
