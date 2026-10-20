import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { CoinsTable } from '../components/CoinsTable';
import { Pills, filterOptions, sortOptions, useCoinQuery } from '../components/CoinControls';
import type { FilterKey, SortKey } from '../components/CoinControls';
import { useAsync } from '../hooks/useAsync';
import { useApp } from '../hooks/useApp';
import { api, enrichFromDexscreener } from '../lib/api';

export default function Leaderboard() {
  const { saved } = useApp();
  const [sort, setSort] = useState<SortKey>('change');
  const [filter, setFilter] = useState<FilterKey>('all');
  const coins = useAsync(() => api.coins().then(enrichFromDexscreener));
  const list = useCoinQuery(coins.data, '', sort, filter, saved);
  const sortLabel = sortOptions.find((s) => s.key === sort)?.label.toLowerCase() ?? '24h change';

  return (
    <>
      <PageHero label="VENT / LEADERBOARD" title="Follow the airflow.">
        <p className="lead">
          The VENT network ranked by {sortLabel}.
          <br />
          <span className="muted">A record of what moved. Never a prediction.</span>
        </p>
      </PageHero>
      <div className="container page-body">
        <div className="toolbar">
          <Pills label="Sort" options={sortOptions} value={sort} onChange={setSort} />
          <Pills label="Filter" options={filterOptions} value={filter} onChange={setFilter} />
        </div>
        <CoinsTable coins={list} loading={coins.loading} error={coins.error} showSave showRank />
        <p className="table-note">
          Public market observations. Observations come from indexed Solana pairs. Missing data stays unavailable.
        </p>
      </div>
    </>
  );
}
