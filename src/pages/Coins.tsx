import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { CoinsTable } from '../components/CoinsTable';
import { Pills, filterOptions, sortOptions, useCoinQuery } from '../components/CoinControls';
import type { FilterKey, SortKey } from '../components/CoinControls';
import { useAsync } from '../hooks/useAsync';
import { useApp } from '../hooks/useApp';
import { api, enrichFromDexscreener } from '../lib/api';

export default function Coins() {
  const { saved } = useApp();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('mcap');
  const [filter, setFilter] = useState<FilterKey>('all');
  const coins = useAsync(() => api.coins().then(enrichFromDexscreener));
  const list = useCoinQuery(coins.data, q, sort, filter, saved);

  return (
    <>
      <PageHero label="VENT / COIN INDEX" title="Coins with company.">
        <p className="lead">Every coin here has something living in its vents. Search the network.</p>
      </PageHero>
      <div className="container page-body">
        <div className="toolbar">
          <label className="search">
            <span>&gt;</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search name, ticker or CA"
              aria-label="Search coins"
            />
          </label>
          <Pills label="Sort" options={sortOptions} value={sort} onChange={setSort} />
        </div>
        <div className="toolbar">
          <Pills label="Filter" options={filterOptions} value={filter} onChange={setFilter} />
        </div>
        <CoinsTable
          coins={list}
          loading={coins.loading}
          error={coins.error}
          showSave
          emptyText={filter === 'saved' ? 'No saved coins yet. Use [ ] to save one.' : 'No coins match that search.'}
        />
        <p className="table-note">
          Public market observations. Observations come from indexed Solana pairs. Missing data stays unavailable.
        </p>
      </div>
    </>
  );
}
