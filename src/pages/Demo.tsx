import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { entities, entityById } from '../data/entities';
import type { EntityId } from '../data/entities';
import { useAsync } from '../hooks/useAsync';
import { api } from '../lib/api';
import type { Assignment, StepState } from '../lib/api';

const stateText: Record<StepState, string> = { queued: 'QUEUED', working: 'WORKING', done: 'DONE' };

export default function Demo() {
  const [params] = useSearchParams();
  const simulate = params.get('simulate') === '1';
  const { data, loading } = useAsync(() => api.assignment());
  const [run, setRun] = useState<Assignment | null>(null);
  const [selected, setSelected] = useState<EntityId>('creative');

  useEffect(() => {
    if (data) setRun(data);
  }, [data]);

  // Local playback of the assignment (?simulate=1). TODO(backend): live job feed.
  useEffect(() => {
    if (!simulate || !data) return;
    const order = entities.map((e) => e.id);
    let i = 0;
    let phase: 'working' | 'done' = 'working';
    const timer = window.setInterval(() => {
      if (i >= order.length) {
        window.clearInterval(timer);
        setRun((r) => (r ? { ...r, status: 'complete' } : r));
        return;
      }
      const id = order[i];
      const cur = phase; // capture – the updater runs after `phase` flips below
      setRun((r) => {
        if (!r) return r;
        const steps = { ...r.steps, [id]: cur };
        const outputs = cur === 'done' ? { ...r.outputs, [id]: r.simulation[id] } : r.outputs;
        return { ...r, status: 'running', steps, outputs };
      });
      if (phase === 'working') {
        setSelected(id);
        phase = 'done';
      } else {
        phase = 'working';
        i += 1;
      }
    }, 1100);
    return () => window.clearInterval(timer);
  }, [simulate, data]);

  const done = useMemo(() => (run ? Object.values(run.steps).filter((s) => s === 'done').length : 0), [run]);
  const entity = entityById(selected) ?? entities[6];
  const output = run?.outputs[selected];
  const stepState = run?.steps[selected] ?? 'queued';
  const statusLabel = !run ? 'Loading' : run.status === 'waiting' ? 'Waiting' : run.status === 'running' ? 'Running' : 'Complete';

  return (
    <>
      <section className="page-hero container">
        <div className="status">
          VENT / FIRST JOB{' '}
          <span className={run?.status === 'running' ? 'accent' : undefined} style={{ marginLeft: 10 }}>
            <span className={`dot${run?.status === 'waiting' || !run ? ' dot--off' : ''}`} />
            {statusLabel}
          </span>
        </div>
        <h1>
          Something took <span className="gap" />
          the job.
        </h1>
        <p className="lead">
          One coin. Seven entities. Watch the work come out of the vents, one role at a time.
        </p>
      </section>

      <div className="container page-body">
        <div className="assign">
          <div className="assign-steps">
            <div className="assign-head">
              <span className="label">
                {String(done).padStart(2, '0')} / 07 COMPLETED · {run?.operator ?? 'CODEX OPERATOR'}
              </span>
            </div>
            <div className="progress" aria-hidden="true">
              <i style={{ width: `${(done / 7) * 100}%` }} />
            </div>
            {entities.map((e) => {
              const st = run?.steps[e.id] ?? 'queued';
              return (
                <button key={e.id} className={selected === e.id ? 'on' : undefined} onClick={() => setSelected(e.id)}>
                  <span className="muted">{e.idx}</span>
                  <span>{e.name}</span>
                  <span className={`st ${st}`}>{loading ? '…' : stateText[st]}</span>
                  <span className="mk">{st === 'done' ? '[x]' : selected === e.id ? '[*]' : '[ ]'}</span>
                </button>
              );
            })}
          </div>

          <div className="assign-out">
            <div className="assign-head">
              <span className="label">
                {entity.name.toLowerCase()} / {entity.role.toLowerCase()}
              </span>
              <span className={`status ${stepState === 'done' ? 'accent' : ''}`}>
                {stepState === 'done' ? 'OUTPUT RECEIVED' : stepState === 'working' ? 'WORKING…' : 'AWAITING OUTPUT'}
              </span>
            </div>
            <div className="out-body">
              <pre className="out">
                {output ??
                  (stepState === 'working' ? (
                    <>
                      [ {entity.name.toLowerCase()} is crawling out<span className="blink">_</span> ]
                    </>
                  ) : (
                    '[ waiting for airflow ]'
                  ))}
              </pre>
              {!output && (
                <>
                  <h3>{entity.name} is still in the ducts.</h3>
                  <p className="muted">Its output drops here when the job completes.</p>
                </>
              )}
              {output && (
                <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                  {entity.role} · {entity.runtime} · {entity.cadence}
                </p>
              )}
            </div>
          </div>
        </div>
        <p className="assign-note">
          The entities are characters. The work is real output from the job feed. This pre-launch job has no token
          mint, trades or market history.
        </p>
      </div>
    </>
  );
}
