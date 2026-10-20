import { useSearchParams } from 'react-router-dom';
import { entities, entityById } from '../data/entities';
import { PageHero } from '../components/PageHero';
import { BracketLink } from '../components/Bracket';

export default function Teams() {
  const [params, setParams] = useSearchParams();
  const entity = entityById(params.get('agent')) ?? entities[0];

  const select = (id: string) => setParams({ agent: id }, { replace: true, preventScrollReset: true });

  return (
    <>
      <PageHero label="VENT / ENTITY FILES" title="You won't see them. You'll see the work.">
        <p className="lead">Seven entities live in the ducts. Pick one to open its file.</p>
      </PageHero>

      <div className="container page-body">
        <div className="team-grid" role="tablist" aria-label="Entities">
          {entities.map((e) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={entity.id === e.id}
              className={`team-card${entity.id === e.id ? ' on' : ''}`}
              onClick={() => select(e.id)}
            >
              <pre className="ascii" aria-hidden="true">
                {e.sprite}
              </pre>
              <span className="label">{e.idx}</span>
              <span className="nm">{e.name}</span>
              <span className="label">{e.role}</span>
            </button>
          ))}
        </div>

        <article className="dossier" role="tabpanel" aria-label={`${entity.name} file`}>
          <div className="dossier-id">
            <span className="label">entity_{entity.idx}.file</span>
            <pre className="ascii" aria-hidden="true">
              {entity.sprite}
            </pre>
            <h2>{entity.name}</h2>
            <dl className="kv">
              <dt>Role</dt>
              <dd>{entity.role}</dd>
              <dt>Runtime</dt>
              <dd>{entity.runtime}</dd>
              <dt>Cadence</dt>
              <dd>{entity.cadence}</dd>
              <dt>State</dt>
              <dd className="muted">
                <span className="dot dot--off" />
                Listening
              </dd>
            </dl>
          </div>
          <div className="dossier-work">
            <span className="label">Assignment</span>
            <p>{entity.brief}</p>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {entity.duties.map((d) => (
                <li key={d} className="chip">
                  {d}
                </li>
              ))}
            </ul>
            <span className="label" style={{ marginTop: 8 }}>
              Thought log
            </span>
            <div className="loglines">
              {entity.thoughts.map((t, i) => (
                <div key={t}>
                  <span className="t">t-{String((entity.thoughts.length - i) * 15).padStart(3, '0')}m</span>
                  &gt; {t}
                </div>
              ))}
            </div>
            <span className="label" style={{ marginTop: 8 }}>
              Recent work
            </span>
            <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
              No completed jobs on the network yet. Follow the first job to see this entity crawl out.
            </p>
            <BracketLink to="/demo" double>
              WATCH THE JOB ↗
            </BracketLink>
            <p className="status" style={{ marginTop: 'auto' }}>
              CHARACTER LAYER / THE WORK UNDERNEATH IS REAL
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
