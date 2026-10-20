import { useNavigate } from 'react-router-dom';
import type { Coin, TeamState } from '../lib/api';
import { pct, usdCompact } from '../lib/format';
import { useApp } from '../hooks/useApp';

const teamLabel: Record<TeamState, { text: string; cls: string }> = {
  working: { text: '● Humming', cls: 'accent' },
  paused: { text: '○ Quiet', cls: 'muted' },
  observing: { text: '◌ Listening', cls: 'muted' },
  dex: { text: '◆ Dex eligible', cls: 'accent' },
};

export function TeamBadge({ state }: { state: TeamState }) {
  const t = teamLabel[state];
  return <span className={`team-state ${t.cls}`}>{t.text}</span>;
}

export function CoinAvatar({ ticker }: { ticker: string }) {
  return <span className="coin-avatar">{ticker.slice(0, 2)}</span>;
}

export function CoinsTable({
  coins,
  loading,
  error,
  showSave,
  showRank,
  caption = 'COINS WITH SOMETHING IN THE VENTS',
  emptyText = 'No coins match.',
}: {
  coins: Coin[] | null;
  loading: boolean;
  error?: Error | null;
  showSave?: boolean;
  showRank?: boolean;
  caption?: string;
  emptyText?: string;
}) {
  const navigate = useNavigate();
  const { saved, toggleSaved, toast } = useApp();
  const cols = 4 + (showSave ? 1 : 0) + (showRank ? 1 : 0);

  return (
    <div className="table-wrap">
      <div className="table-cap">
        <span className="label">{caption}</span>
        <span className="status">
          {loading ? (
            <>
              Loading<span className="blink">…</span>
            </>
          ) : error ? (
            <span className="neg">unavailable</span>
          ) : (
            `${coins?.length ?? 0} indexed`
          )}
        </span>
      </div>
      <table className="data">
        <thead>
          <tr>
            {showRank && <th style={{ width: 48 }}>#</th>}
            <th>Coin</th>
            <th className="num">Market cap</th>
            <th className="num">24h change</th>
            <th>Team</th>
            {showSave && <th className="num">Save coin</th>}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={cols} className="table-empty">
                Reading the network<span className="blink">…</span>
              </td>
            </tr>
          )}
          {!loading && error && (
            <tr>
              <td colSpan={cols} className="table-empty">
                The network did not answer. Missing data stays unavailable.
              </td>
            </tr>
          )}
          {!loading && !error && coins && coins.length === 0 && (
            <tr>
              <td colSpan={cols} className="table-empty">
                {emptyText}
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            coins?.map((c, i) => {
              const isSaved = saved.includes(c.id);
              return (
                <tr key={c.id} className="clickable" onClick={() => navigate(`/coins/${c.id}`)}>
                  {showRank && <td className="muted">{String(i + 1).padStart(2, '0')}</td>}
                  <td>
                    <div className="coin-cell">
                      <CoinAvatar ticker={c.ticker} />
                      <div>
                        <div className="coin-name">{c.name}</div>
                        <div className="coin-ticker">${c.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`num${c.marketCap == null ? ' muted' : ''}`}>{usdCompact(c.marketCap)}</td>
                  <td className={`num ${c.change24h == null ? 'muted' : c.change24h >= 0 ? 'pos' : 'neg'}`}>
                    {pct(c.change24h)}
                  </td>
                  <td>
                    <TeamBadge state={c.team} />
                  </td>
                  {showSave && (
                    <td className="num">
                      <button
                        className={`save-btn${isSaved ? ' on' : ''}`}
                        aria-pressed={isSaved}
                        aria-label={isSaved ? `Unsave ${c.name}` : `Save ${c.name}`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          toggleSaved(c.id);
                          toast(isSaved ? 'REMOVED FROM SAVED' : 'SAVED');
                        }}
                      >
                        {isSaved ? '[*]' : '[ ]'}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
