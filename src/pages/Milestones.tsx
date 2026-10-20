import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { Pills } from '../components/CoinControls';
import { useAsync } from '../hooks/useAsync';
import { api } from '../lib/api';
import type { Milestone } from '../lib/api';
import { timeAgo } from '../lib/format';

type Kind = 'all' | Milestone['kind'];

const kinds: { key: Kind; label: string }[] = [
  { key: 'all', label: 'All signals' },
  { key: 'marketcap', label: 'Market cap' },
  { key: 'holders', label: 'Holders' },
  { key: 'graduation', label: 'Graduation' },
];

const kindLabel: Record<Milestone['kind'], string> = {
  marketcap: 'Market cap',
  holders: 'Holders',
  graduation: 'Graduation',
};

export default function Milestones() {
  const [kind, setKind] = useState<Kind>('all');
  const { data, loading, error, reload } = useAsync(() => api.milestones());
  const list = useMemo(() => (data ? data.filter((m) => kind === 'all' || m.kind === kind) : null), [data, kind]);

  return (
    <>
      <PageHero label="VENT / MILESTONES" title="Soot on the walls.">
        <p className="lead">Gates crossed, holders gained, curves completed. Every mark a coin left behind.</p>
      </PageHero>
      <div className="container page-body">
        <div className="toolbar">
          <Pills label="Signal" options={kinds} value={kind} onChange={setKind} />
          <button className="btn" onClick={reload} disabled={loading}>
            Refresh ↻
          </button>
        </div>
        <div className="table-wrap">
          <div className="table-cap">
            <span className="label">VENT NETWORK / SUSTAINED LEVELS</span>
            <span className="status">{loading ? 'Loading…' : `${list?.length ?? 0} recorded`}</span>
          </div>
          <div className="ms-list" style={{ border: 0 }}>
            {loading && (
              <div className="table-empty">
                Reading milestones<span className="blink">…</span>
              </div>
            )}
            {error && <div className="table-empty">Milestones are unavailable right now.</div>}
            {!loading && list?.length === 0 && <div className="table-empty">No signals of this kind yet.</div>}
            {!loading &&
              list?.map((m) => (
                <div className="ms-item" key={m.id}>
                  <span className="ms-kind">{kindLabel[m.kind]}</span>
                  <div>
                    <h3>
                      <Link to={`/coins/${m.coin}`} className="textlink" style={{ border: 0 }}>
                        {m.title}
                      </Link>
                    </h3>
                    <p>{m.detail}</p>
                  </div>
                  <span className="ms-when">{timeAgo(m.at)}</span>
                </div>
              ))}
          </div>
        </div>
        <p className="table-note">
          Recorded observations for registered coins. A recorded crossing does not imply a paid listing.
        </p>
      </div>
    </>
  );
}
