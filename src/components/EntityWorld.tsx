import { useEffect, useRef } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import { entities } from '../data/entities';
import type { EntityId } from '../data/entities';

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  heading: number;
}

const NOTICE_RADIUS = 110;

/**
 * "The ducts": seven ASCII entities crawl a duct map, flee/turn toward
 * the cursor and can be selected. Plain DOM + rAF, no canvas dependency.
 */
export function EntityWorld({
  selected,
  onSelect,
  paused,
  label,
}: {
  selected: EntityId;
  onSelect: (id: EntityId) => void;
  paused: boolean;
  label: string;
}) {
  const worldRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spriteRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const mouse = useRef({ x: -9999, y: -9999, inside: false });
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reduce ? 0.15 : 0.55;

    const seed = () => {
      const W = world.clientWidth;
      const H = world.clientHeight;
      bodies.current = entities.map((_, i) => {
        const el = spriteRefs.current[i];
        const w = el?.offsetWidth ?? 60;
        const h = el?.offsetHeight ?? 60;
        const cols = 4;
        const cx = ((i % cols) + 0.5) / cols;
        const cy = (Math.floor(i / cols) + 0.5) / 2;
        const a = Math.random() * Math.PI * 2;
        return {
          x: Math.max(0, Math.min(W - w, cx * W - w / 2 + (Math.random() - 0.5) * 40)),
          y: Math.max(36, Math.min(H - h, cy * H - h / 2 + (Math.random() - 0.5) * 30)),
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          w,
          h,
          heading: a,
        };
      });
    };
    seed();

    let raf = 0;
    const step = () => {
      const W = world.clientWidth;
      const H = world.clientHeight;
      const m = mouse.current;
      bodies.current.forEach((b, i) => {
        const el = spriteRefs.current[i];
        if (!el) return;
        let alert = false;
        if (!pausedRef.current) {
          b.heading += (Math.random() - 0.5) * 0.18;
          b.vx += Math.cos(b.heading) * 0.02;
          b.vy += Math.sin(b.heading) * 0.02;
          if (m.inside) {
            const dx = b.x + b.w / 2 - m.x;
            const dy = b.y + b.h / 2 - m.y;
            const d = Math.hypot(dx, dy);
            if (d < NOTICE_RADIUS && d > 0.01) {
              alert = true;
              const f = (1 - d / NOTICE_RADIUS) * 0.5;
              b.vx += (dx / d) * f;
              b.vy += (dy / d) * f;
            }
          }
          // keep entities from piling on top of each other
          bodies.current.forEach((o, j) => {
            if (j === i) return;
            const dx = b.x + b.w / 2 - (o.x + o.w / 2);
            const dy = b.y + b.h / 2 - (o.y + o.h / 2);
            const d = Math.hypot(dx, dy) || 0.01;
            const min = (Math.max(b.w, b.h) + Math.max(o.w, o.h)) * 0.5;
            if (d < min) {
              const f = (1 - d / min) * 0.25;
              b.vx += (dx / d) * f;
              b.vy += (dy / d) * f;
            }
          });
          const v = Math.hypot(b.vx, b.vy);
          const max = alert ? speed * 4.5 : speed;
          if (v > max) {
            b.vx = (b.vx / v) * max;
            b.vy = (b.vy / v) * max;
          }
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < 0) {
            b.x = 0;
            b.vx = Math.abs(b.vx);
            b.heading = Math.PI - b.heading;
          }
          if (b.x > W - b.w) {
            b.x = W - b.w;
            b.vx = -Math.abs(b.vx);
            b.heading = Math.PI - b.heading;
          }
          if (b.y < 30) {
            b.y = 30;
            b.vy = Math.abs(b.vy);
            b.heading = -b.heading;
          }
          if (b.y > H - b.h) {
            b.y = H - b.h;
            b.vy = -Math.abs(b.vy);
            b.heading = -b.heading;
          }
        }
        el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0)`;
        el.classList.toggle('alert', alert);
      });
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const ro = new ResizeObserver(() => {
      const W = world.clientWidth;
      const H = world.clientHeight;
      bodies.current.forEach((b) => {
        b.x = Math.min(b.x, Math.max(0, W - b.w));
        b.y = Math.min(b.y, Math.max(30, H - b.h));
      });
    });
    ro.observe(world);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
  };
  const onLeave = () => {
    mouse.current = { x: -9999, y: -9999, inside: false };
  };

  return (
    <div
      ref={worldRef}
      className={`world${paused ? ' paused' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label="The ducts"
    >
      <div className="world-hud">
        <span className="status">{label}</span>
        <span className="status">{paused ? 'AIRFLOW PAUSED' : <span className="accent">● AIRFLOW LIVE</span>}</span>
      </div>
      <Ducts />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      {entities.map((e, i) => (
        <button
          key={e.id}
          ref={(el) => {
            spriteRefs.current[i] = el;
          }}
          className={`sprite${selected === e.id ? ' selected' : ''}`}
          onClick={() => onSelect(e.id)}
          aria-label={`Select ${e.name}`}
          aria-pressed={selected === e.id}
        >
          {e.sprite}
          <span className="tag">
            {e.idx} {e.name}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Static duct map drawn behind the entities: double-walled ducts + grilles. */
function Ducts() {
  const ducts = [
    'M0 92 H330 V250 H600',
    'M120 0 V92',
    'M470 0 V250',
    'M0 330 H210 V250 H330',
    'M210 330 V420',
    'M470 250 V420',
  ];
  const grilles: [number, number][] = [
    [96, 68],
    [306, 226],
    [446, 140],
    [186, 306],
    [446, 340],
  ];
  return (
    <svg className="ducts" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {ducts.map((d) => (
        <g key={d}>
          <path d={d} className="duct-outer" />
          <path d={d} className="duct-inner" />
        </g>
      ))}
      {grilles.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`} className="duct-grille">
          <rect width="48" height="48" rx="3" />
          {[12, 20, 28, 36].map((ly) => (
            <line key={ly} x1="8" x2="40" y1={ly} y2={ly} />
          ))}
        </g>
      ))}
    </svg>
  );
}
