import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'line' | 'solid' | 'ghost';

const cls = (variant: Variant, extra?: string) =>
  ['btn', variant === 'solid' && 'btn--solid', variant === 'ghost' && 'btn--ghost', extra].filter(Boolean).join(' ');

/** "[ LABEL ]" or "[[ LABEL ]]" style label. */
function Inner({ children, double }: { children: ReactNode; double?: boolean }) {
  return (
    <>
      <span className="br" aria-hidden="true">
        {double ? '[[' : '['}
      </span>
      <span>{children}</span>
      <span className="br" aria-hidden="true">
        {double ? ']]' : ']'}
      </span>
    </>
  );
}

export function BracketLink({
  to,
  children,
  double,
  variant = 'ghost',
  className,
}: {
  to: string;
  children: ReactNode;
  double?: boolean;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link to={to} className={cls(variant, className)}>
      <Inner double={double}>{children}</Inner>
    </Link>
  );
}

export function BracketButton({
  children,
  double,
  variant = 'line',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { double?: boolean; variant?: Variant }) {
  return (
    <button className={cls(variant, className)} {...rest}>
      <Inner double={double}>{children}</Inner>
    </button>
  );
}
