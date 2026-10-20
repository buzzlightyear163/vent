import type { ReactNode } from 'react';

export function TermWindow({
  label,
  children,
  onClose,
  right,
  className,
}: {
  label: string;
  children: ReactNode;
  onClose?: () => void;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={['term', className].filter(Boolean).join(' ')}>
      <div className="term-bar">
        <span>{label}</span>
        {right ?? (
          <span className="ctrl">
            [_]
            {onClose ? (
              <button onClick={onClose} aria-label="Close" style={{ color: 'inherit' }}>
                [x]
              </button>
            ) : (
              '[x]'
            )}
          </span>
        )}
      </div>
      <div className="term-body">{children}</div>
    </div>
  );
}
