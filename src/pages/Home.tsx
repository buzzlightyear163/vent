import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { home } from '../data/site';
import { entities, entityById } from '../data/entities';
import type { EntityId } from '../data/entities';
import { art, logo, mascot } from '../data/ascii';
import { AsciiGrille } from '../components/VentMark';
import { CaBox } from '../components/CaBox';
import { RoleAccordion } from '../components/RoleAccordion';
import { TermWindow } from '../components/TermWindow';
import { EntityWorld } from '../components/EntityWorld';
import { AsciiHeading } from '../components/AsciiHeading';
import { BracketButton, BracketLink } from '../components/Bracket';
import { CoinsTable } from '../components/CoinsTable';
import { FeeBars } from '../components/FeeBars';
import { useAsync } from '../hooks/useAsync';
import { api, enrichFromDexscreener } from '../lib/api';

function useTypewriter(lines: string[], key: string) {
  const [text, setText] = useState('');
  useEffect(() => {
    let line = 0;
    let i = 0;
    let t: number;
    const tick = () => {
      const full = lines[line % lines.length];
      i += 1;
      setText(full.slice(0, i));
      if (i >= full.length) {
        t = window.setTimeout(() => {
          line += 1;
          i = 0;
          tick();
        }, 2600);
      } else {
        t = window.setTimeout(tick, 38);
      }
    };
    setText('');
    t = window.setTimeout(tick, 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return text;
}

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<EntityId>('lead');
  const [paused, setPaused] = useState(false);
  const [coinName, setCoinName] = useState('');
  const entity = entityById(selected) ?? entities[0];
  const thought = useTypewriter(entity.thoughts, entity.id);
  const coins = useAsync(() => api.coins().then(enrichFromDexscreener));

  const top = coins.data
    ? [...coins.data].sort((a, b) => (b.marketCap ?? -1) - (a.marketCap ?? -1)).slice(0, 5)
    : null;

  const onCreate = (e: FormEvent) => {
    e.preventDefault();
    const name = coinName.trim();
    navigate(name ? `/launch?name=${encodeURIComponent(name)}` : '/launch');
  };

  return (
    <>
      <div className="home-stage">
        <aside className="rail" aria-label="Token and roles">
          <CaBox />
          <RoleAccordion />
          <div className="rail-divider" aria-hidden="true">
            ≡≡≡≡
          </div>
        </aside>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-status">
            <span className="status">{home.status[0]}</span>
            <span className="status status--accent">
              <span className="dot" />
              {home.status[1]}
            </span>
          </div>
          <TermWindow label={home.windowLabel}>
            <div className="hero-mark">
              <AsciiGrille />
              <pre className="ascii" aria-label="VENT">
                {logo}
              </pre>
            </div>
          </TermWindow>
          <h1 id="hero-title">{home.h1}</h1>
          <p className="hero-lead">{home.lead}</p>
          <form className="create-form" onSubmit={onCreate}>
            <label>
              <span className="prompt">&gt;</span>
              <span className="sr-only">Coin name</span>
              <input
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder={home.inputPlaceholder}
                maxLength={32}
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <BracketButton type="submit" variant="solid">
              {home.cta}
            </BracketButton>
          </form>
          <div className="hero-ctas">
            <BracketLink to="/demo" double>
              {home.ctaSecondary}
            </BracketLink>
          </div>
          <div className="hero-foot">
            <span className="status">{home.foot[0]}</span>
            <span className="status">{home.foot[1]}</span>
          </div>
        </section>

        <section className="stage-right" aria-label="Entities">
          <EntityWorld selected={selected} onSelect={setSelected} paused={paused} label="SECTOR_00 / DUCT MAP" />
          <div className="entity-panel">
            <div className="entity-log">
              <div className="bar">
                <span className="label">entity_{entity.idx}.log</span>
                <span className="label">[≡]</span>
              </div>
              <h2>{entity.name}</h2>
              <span className="label">
                {entity.role} / {entity.runtime}
              </span>
              <p className="thought">
                &gt; {thought}
                <span className="blink">_</span>
              </p>
              <div className="world-ctl">
                <span className="status">{home.worldLabel}</span>
                <BracketLink to={`/teams?agent=${entity.id}`} double>
                  OPEN FILE ↗
                </BracketLink>
                <p className="status">{home.worldHint}</p>
                <BracketButton variant="ghost" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                  {paused ? 'RESUME WORLD' : 'PAUSE WORLD'}
                </BracketButton>
              </div>
            </div>
            <ul className="roster" aria-label="Roster">
              {entities.map((e) => (
                <li key={e.id}>
                  <button className={selected === e.id ? 'on' : undefined} onClick={() => setSelected(e.id)}>
                    <span className="muted">{e.idx}</span>
                    <span>{e.name}</span>
                    <span className="muted">{e.runtime}</span>
                    <span className="mk">{selected === e.id ? '[*]' : '[ ]'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="container">
        <section className="section reveal" aria-labelledby="coins-h">
          <div className="section-head">
            <AsciiHeading id="coins-h">{home.coinsHeading}</AsciiHeading>
            <BracketLink to="/coins" double>
              FULL INDEX ↗
            </BracketLink>
          </div>
          <CoinsTable coins={top} loading={coins.loading} error={coins.error} />
          <p className="table-note">{home.coinsNote}</p>
        </section>

        <section className="section reveal" aria-labelledby="instr-h">
          <div className="section-head">
            <AsciiHeading id="instr-h">{home.instructionsHeading}</AsciiHeading>
          </div>
          <div className="instr">
            <div className="instr-side">
              <span className="label">{home.instructionsLabel}</span>
              <pre className="ascii ascii--accent">{mascot}</pre>
            </div>
            <div className="instr-cards">
              {home.instructions.map((s) => (
                <article className="instr-card" key={s.n}>
                  <pre className="ascii" aria-hidden="true">
                    {art[s.art]}
                  </pre>
                  <h3>
                    <span className="n">{s.n}</span> / {s.title}
                  </h3>
                  <p>{s.body}</p>
                  <BracketLink to={s.link.to} double>
                    {s.link.label}
                  </BracketLink>
                </article>
              ))}
            </div>
            <p className="instr-foot">{home.instructionsFoot}</p>
          </div>
        </section>

        <section className="section reveal" aria-labelledby="fees-h">
          <div className="section-head">
            <AsciiHeading id="fees-h">{home.feesHeading}</AsciiHeading>
          </div>
          <div className="fees">
            <div className="fees-intro">
              <span className="label">{home.feesLabel}</span>
              <p>{home.feesBody}</p>
              <Link to="/protocol" className="textlink" style={{ alignSelf: 'flex-start' }}>
                {home.feesLink}
              </Link>
            </div>
            <FeeBars fees={home.fees} />
          </div>
        </section>
      </div>
    </>
  );
}
