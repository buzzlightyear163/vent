import { bar } from '../data/ascii';

export function FeeBars({ fees }: { fees: readonly { pct: number; label: string }[] }) {
  return (
    <div className="fee-bars">
      {fees.map((f) => {
        const b = bar(f.pct);
        return (
          <div className="fee-row" key={f.label}>
            <span className="pct">{f.pct}%</span>
            <span className="bar" aria-hidden="true">
              [{b.full}
              <span className="empty">{b.empty}</span>]
            </span>
            <span className="what">{f.label}</span>
          </div>
        );
      })}
    </div>
  );
}
