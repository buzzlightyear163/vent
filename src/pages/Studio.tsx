import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { BracketLink } from '../components/Bracket';
import { CoinAvatar } from '../components/CoinsTable';
import { copyText } from '../components/CaBox';
import { useApp } from '../hooks/useApp';
import type { Post, Project } from '../hooks/useApp';
import { entityById } from '../data/entities';
import { emptyBox } from '../data/ascii';
import { shortAddr, timeAgo } from '../lib/format';

type Tab = 'review' | 'identity' | 'website';

function download(name: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function asciiToPng(ascii: string): string {
  const lines = ascii.split('\n');
  const fs = 28;
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d');
  if (!ctx) return '';
  const css = getComputedStyle(document.documentElement);
  ctx.fillStyle = css.getPropertyValue('--bg').trim() || '#0a0b09';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = css.getPropertyValue('--accent').trim() || '#c8ff2e';
  ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
  ctx.textBaseline = 'top';
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const h = lines.length * fs * 1.15;
  lines.forEach((l, i) => ctx.fillText(l, (c.width - w) / 2, (c.height - h) / 2 + i * fs * 1.15));
  return c.toDataURL('image/png');
}

function PostCard({ project, post }: { project: Project; post: Post }) {
  const { updatePost, toast } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.caption);
  const by = entityById(post.by);
  const chip = post.status === 'approved' ? 'ok' : post.status === 'cancelled' ? 'bad' : 'wait';
  const slug = `${project.ticker.toLowerCase()}-${post.id}`;

  return (
    <article className="post">
      <div className="post-art">
        <pre className="ascii">{post.art}</pre>
      </div>
      <div className="post-body">
        <div className="row">
          <span className="label">
            {by?.name ?? 'ENTITY'} / {by?.role ?? ''} · {timeAgo(post.createdAt)}
          </span>
          <span className={`chip ${chip}`}>{post.status === 'pending' ? 'In review' : post.status}</span>
        </div>
        {editing ? (
          <label className="field">
            <span>Caption</span>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={280} />
          </label>
        ) : (
          <p className="caption">{post.caption}</p>
        )}
        <div className="post-actions">
          {editing ? (
            <>
              <button
                className="btn btn--solid"
                onClick={() => {
                  updatePost(project.id, post.id, { caption: draft });
                  setEditing(false);
                  toast('CAPTION SAVED');
                }}
              >
                Save
              </button>
              <button
                className="btn"
                onClick={() => {
                  setDraft(post.caption);
                  setEditing(false);
                }}
              >
                Discard
              </button>
            </>
          ) : (
            <>
              <button className="btn" onClick={() => setEditing(true)} disabled={post.status === 'cancelled'}>
                Edit
              </button>
              <button
                className="btn"
                onClick={() => {
                  updatePost(project.id, post.id, { status: 'approved' });
                  toast('APPROVED');
                }}
                disabled={post.status === 'approved'}
              >
                Approve
              </button>
              <button
                className="btn"
                onClick={() => {
                  updatePost(project.id, post.id, { status: post.status === 'cancelled' ? 'pending' : 'cancelled' });
                  toast(post.status === 'cancelled' ? 'RESTORED' : 'CANCELLED');
                }}
              >
                {post.status === 'cancelled' ? 'Restore' : 'Cancel'}
              </button>
              <button className="btn" onClick={async () => toast((await copyText(post.caption)) ? 'CAPTION COPIED' : 'COPY FAILED')}>
                Copy
              </button>
              <button className="btn" onClick={() => download(`${slug}.png`, asciiToPng(post.art))}>
                PNG ↓
              </button>
              <button
                className="btn"
                onClick={() => download(`${slug}.txt`, `data:text/plain;charset=utf-8,${encodeURIComponent(post.art)}`)}
              >
                ASCII ↓
              </button>
              <button className="btn" disabled title="TODO(backend): X OAuth + publish">
                Publish on X
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Studio() {
  const { projects, removeProject, toast } = useApp();
  const [params, setParams] = useSearchParams();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('review');

  useEffect(() => {
    // mirrors the reference's "Reading your studio…" moment
    const t = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  const current = projects.find((p) => p.id === params.get('project')) ?? projects[0];

  return (
    <>
      <PageHero label="VENT / STUDIO" title="Your side of the grille.">
        <p className="lead">Drafts waiting. Crews waking. Every post held until you say so.</p>
      </PageHero>

      <div className="container page-body">
        <div className="studio">
          <div className="studio-list">
            <div className="head">
              <span className="label">YOUR PROJECTS</span>
              <p>Saved coin identities, generated websites, artwork and review queues.</p>
            </div>
            {!ready && (
              <p className="table-empty">
                Reading your studio<span className="blink">…</span>
              </p>
            )}
            {ready &&
              projects.map((p) => (
                <button
                  key={p.id}
                  className={`proj${current?.id === p.id ? ' on' : ''}`}
                  onClick={() => setParams({ project: p.id }, { replace: true })}
                >
                  {p.image ? <img src={p.image} alt="" className="coin-avatar" /> : <CoinAvatar ticker={p.ticker} />}
                  <div>
                    <div className="coin-name">{p.name}</div>
                    <div className="meta">
                      ${p.ticker} · {p.mode === 'linked' ? 'linked' : 'draft'} · {p.posts.filter((x) => x.status === 'pending').length} in review
                    </div>
                  </div>
                </button>
              ))}
            {ready && (
              <div style={{ padding: 16 }}>
                <BracketLink to="/launch" double>
                  NEW PROJECT ↗
                </BracketLink>
              </div>
            )}
          </div>

          <div className="studio-main">
            {ready && !current && (
              <div className="empty-state">
                <pre className="ascii">{emptyBox}</pre>
                <p className="muted">No projects in this browser yet. Name a coin and the crew starts preparing.</p>
                <BracketLink to="/launch" double variant="solid">
                  CREATE A PROJECT ↵
                </BracketLink>
              </div>
            )}
            {ready && current && (
              <>
                <div className="studio-tabs" role="tablist">
                  {(['review', 'identity', 'website'] as Tab[]).map((t) => (
                    <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : undefined} onClick={() => setTab(t)}>
                      {t === 'review' ? `Review queue (${current.posts.length})` : t === 'identity' ? 'Identity' : 'Website'}
                    </button>
                  ))}
                </div>
                <div className="studio-pane">
                  {tab === 'review' && (
                    <>
                      <p className="status">
                        A new post every fifteen minutes while the team works. Approve before anything leaves.
                      </p>
                      {current.posts.map((post) => (
                        <PostCard key={post.id} project={current} post={post} />
                      ))}
                    </>
                  )}
                  {tab === 'identity' && (
                    <>
                      <div className="coin-head">
                        {current.image ? (
                          <img src={current.image} alt="" className="coin-avatar" style={{ width: 64, height: 64 }} />
                        ) : (
                          <CoinAvatar ticker={current.ticker} />
                        )}
                        <div>
                          <div className="coin-name" style={{ fontSize: 'var(--fs-xl)' }}>
                            {current.name}
                          </div>
                          <div className="label">${current.ticker}</div>
                        </div>
                      </div>
                      <dl className="kv">
                        <dt>Mode</dt>
                        <dd>{current.mode === 'linked' ? 'Linked live coin' : 'Draft'}</dd>
                        <dt>Mint</dt>
                        <dd>{current.ca ? shortAddr(current.ca, 6, 6) : 'pending'}</dd>
                        <dt>Lore</dt>
                        <dd>{current.description || <span className="muted">none yet</span>}</dd>
                        <dt>X</dt>
                        <dd>{current.links.x || <span className="muted">—</span>}</dd>
                        <dt>Telegram</dt>
                        <dd>{current.links.telegram || <span className="muted">—</span>}</dd>
                        <dt>Website</dt>
                        <dd>{current.links.website || <span className="muted">—</span>}</dd>
                        <dt>Dev buy</dt>
                        <dd>{current.devBuy ? `${current.devBuy} SOL` : 'none'}</dd>
                        <dt>Created</dt>
                        <dd>{timeAgo(current.createdAt)}</dd>
                      </dl>
                      <button
                        className="btn"
                        style={{ alignSelf: 'flex-start' }}
                        onClick={() => {
                          removeProject(current.id);
                          setParams({}, { replace: true });
                          toast('PROJECT REMOVED');
                        }}
                      >
                        Remove project
                      </button>
                    </>
                  )}
                  {tab === 'website' && (
                    <>
                      <p className="muted">RUST keeps a coin website ready for every project.</p>
                      <div className="term">
                        <div className="term-bar">
                          <span>{current.ticker.toLowerCase()}.site / preview</span>
                          <span className="ctrl">[_][x]</span>
                        </div>
                        <div className="term-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28 }}>
                          <span className="status">${current.ticker} / SOMETHING IN THE VENTS</span>
                          <div style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                            {current.name}
                          </div>
                          <p className="muted">{current.description || 'Lore pending. DUST is researching.'}</p>
                          <pre className="ascii ascii--accent">{current.posts[0]?.art}</pre>
                        </div>
                      </div>
                      <button className="btn" disabled style={{ alignSelf: 'flex-start' }} title="TODO(backend): publish coin website">
                        Publish website
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
