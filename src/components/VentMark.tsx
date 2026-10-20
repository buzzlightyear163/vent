/**
 * The VENT mark: a grille with two eyes behind the slats.
 * Used in the header, footer, favicon and graphics.
 */
export function VentMark({ size = 22, blink = true, className }: { size?: number; blink?: boolean; className?: string }) {
  return (
    <svg
      className={['vent-mark', blink && 'vent-mark--blink', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="4" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <line x1="7" y1="8.5" x2="25" y2="8.5" />
        <line x1="7" y1="23.5" x2="25" y2="23.5" />
      </g>
      <g className="vent-eyes" fill="var(--accent)">
        <rect x="9" y="13.4" width="4.6" height="5.2" rx="1" />
        <rect x="18.4" y="13.4" width="4.6" height="5.2" rx="1" />
      </g>
    </svg>
  );
}

/** ASCII grille used in the hero window; the eyes blink via CSS. */
export function AsciiGrille() {
  return (
    <pre className="ascii grille" aria-hidden="true">
      {'+---------+\n|=========|\n|==='}
      <span className="eye">o</span>
      {'='}
      <span className="eye">o</span>
      {'===|\n|=========|\n+---------+'}
    </pre>
  );
}
