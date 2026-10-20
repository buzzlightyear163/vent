import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { manualSections } from '../data/manual';
import type { Block } from '../data/manual';

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'p':
      return <p key={i}>{b.text}</p>;
    case 'flow':
      return (
        <div className="flow" key={i}>
          {b.steps.map((s, j) => (
            <span key={s} style={{ display: 'contents' }}>
              {j > 0 && <span className="arr">→</span>}
              <span className="step">{s}</span>
            </span>
          ))}
        </div>
      );
    case 'table':
      return (
        <div className="table-wrap" key={i}>
          <table className="data" style={{ minWidth: 480 }}>
            <thead>
              <tr>
                {b.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r.join('|')}>
                  {r.map((c, k) => (
                    <td key={k} className={k === 1 ? 'accent' : undefined}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'splits':
      return (
        <div className="splits" key={i}>
          {b.items.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      );
    case 'link':
      return (
        <Link key={i} to={b.to} className="textlink" style={{ alignSelf: 'flex-start' }}>
          {b.label}
        </Link>
      );
  }
}

/** Shared long-form layout used by /protocol and /docs. */
export function Manual() {
  const [active, setActive] = useState(manualSections[0].id);

  useEffect(() => {
    const els = manualSections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="manual container page-body">
      <nav className="toc" aria-label="On this page">
        {manualSections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : undefined}>
            <span className="idx">{String(i + 1).padStart(2, '0')}</span>
            {s.nav}
          </a>
        ))}
      </nav>
      <div>
        {manualSections.map((s) => (
          <section key={s.id} id={s.id} className="manual-section">
            <h2>{s.title}</h2>
            {s.blocks.map(renderBlock)}
          </section>
        ))}
      </div>
    </div>
  );
}
