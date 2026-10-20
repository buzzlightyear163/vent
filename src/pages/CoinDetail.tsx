import { Link, useParams } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { useApp } from '../hooks/useApp';
import { api, enrichFromDexscreener } from '../lib/api';
import { pct, shortAddr, usdCompact } from '../lib/format';
import { CoinAvatar, TeamBadge } from '../components/CoinsTable';
import { copyText } from '../components/CaBox';
import { brand } from '../data/site';
import { entities } from '../data/entities';

function Chart({ series }: { series: number[] }) {
  const w = 800;
  const h = 260;
  const pad = 14;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => {
    const x = pad + (i / (series.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${d} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  const gateY = (cap: number) => h - pad - ((cap - min) / span) * (h - pad * 2);
  const gates = [brand.activationCap, brand.dexCap].filter((c) => c > min && c < max);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="Market cap, last 24h">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={w} y1={h * f} y2={h * f} stroke="var(--line)" strokeDasharray="2 6" />
        ))}
        {gates.map((g) => (
          <line key={g} x1={0} x2={w} y1={gateY(g)} y2={gateY(g)} stroke="var(--warn)" strokeDasharray="4 4" opacity={0.7} />
        ))}
        <path d={area} fill="var(--accent-dim)" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function CoinDetail() {
  const { id } = useParams();
  const { toast, saved, toggleSaved } = useApp();
  const { data, loading } = useAsync(() => api.coins().then(enrichFromDexscreener), [id]);
  const coin = data?.find((c) => c.id === id);

  if (loading) {
    return (
      <div className="container page-body">
        <p className="status">
          Reading the network<span className="blink">…</span>
        </p>
      </div>
    );
  }

  if (!coin) {
    return (
      <section className="page-hero container">
        <div className="status">VENT / COIN NOT FOUND</div>
        <h1>No vent at this address.</h1>
        <Link to="/coins" className="textlink" style={{ alignSelf: 'flex-start' }}>
          Back to the coin index ↗
        </Link>
      </section>
    );
  }

  const isDemo = coin.ca.startsWith('Demo');
  const isSaved = saved.includes(coin.id);
  const gatePct = coin.marketCap ? Math.min(100, (coin.marketCap / brand.dexCap) * 100) : 0;

  return (
    <>
      <section className="page-hero container">
        <div className="status">
          <Link to="/coins" className="textlink">
            ← COIN INDEX
          </Link>{' '}
          / ${coin.ticker}
        </div>
        <div className="coin-head">
          <CoinAvatar ticker={coin.ticker} />
          <div>
            <h1 style={{ fontSize: 'clamp(34px,5vw,64px)' }}>{coin.name}</h1>
            <div className="label" style={{ marginTop: 8 }}>
              ${coin.ticker} · <TeamBadge state={coin.team} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={async () => toast((await copyText(coin.ca)) ? 'CA COPIED' : 'COPY FAILED')}
            title={coin.ca}
          >
            CA <span style={{ textTransform: 'none' }}>{shortAddr(coin.ca, 6, 6)}</span> <span className="br">COPY</span>
          </button>
          <button className={`btn${isSaved ? ' btn--solid' : ''}`} onClick={() => toggleSaved(coin.id)}>
            {isSaved ? '[*] SAVED' : '[ ] SAVE COIN'}
          </button>
        </div>
      </section>

      <div className="container page-body">
        <div className="stats">
          <div>
            <span className="label">Market cap</span>
            <strong>{usdCompact(coin.marketCap)}</strong>
          </div>
          <div>
            <span className="label">24h change</span>
            <strong className={coin.change24h == null ? 'muted' : coin.change24h >= 0 ? 'pos' : 'neg'}>
              {pct(coin.change24h)}
            </strong>
          </div>
          <div>
            <span className="label">Volume 24h</span>
            <strong>{usdCompact(coin.volume24h)}</strong>
          </div>
          <div>
            <span className="label">Holders</span>
            <strong>{coin.holders?.toLocaleString('en-US') ?? 'unavailable'}</strong>
          </div>
        </div>

        {coin.series ? (
          <Chart series={coin.series} />
        ) : (
          <div className="chart table-empty">Incomplete history. The team is observing.</div>
        )}

        <section className="section" style={{ marginTop: 48 }}>
          <div className="fees">
            <div className="fees-intro">
              <span className="label">GATE / TEN-MINUTE LOW</span>
              <p>
                $10K wakes the team. $30K sustained unlocks the listing milestone. Below the gate the team pauses and the
                website stays up.
              </p>
              <div className="progress" style={{ height: 6 }}>
                <i style={{ width: `${gatePct}%` }} />
              </div>
              <span className="status">
                {usdCompact(coin.marketCap)} / {usdCompact(brand.dexCap)}
              </span>
            </div>
            <ul className="table-wrap roster" aria-label="Team">
              {entities.map((e) => (
                <li key={e.id}>
                  <Link to={`/teams?agent=${e.id}`} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 10, padding: '9px 16px', fontSize: 'var(--fs-sm)' }}>
                    <span className="muted">{e.idx}</span>
                    <span>
                      {e.name} <span className="muted">/ {e.role}</span>
                    </span>
                    <TeamBadge state={coin.team} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 32 }}>
          {[
            { label: 'Dexscreener ↗', href: `https://dexscreener.com/solana/${coin.ca}` },
            { label: 'pump.fun ↗', href: `https://pump.fun/coin/${coin.ca}` },
            { label: 'Solscan ↗', href: `https://solscan.io/token/${coin.ca}` },
          ].map((l) =>
            isDemo ? (
              <span key={l.label} className="textlink muted" aria-disabled="true" title="Demo coin – no real mint">
                {l.label}
              </span>
            ) : (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="textlink">
                {l.label}
              </a>
            ),
          )}
        </div>
        {isDemo && <p className="table-note">Demo fixture. External links activate for real mint addresses.</p>}
      </div>
    </>
  );
}
