import type { ReactNode } from 'react';

export function PageHero({ label, title, children }: { label?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero container">
      {label && <div className="status">{label}</div>}
      <h1>{title}</h1>
      {children}
    </section>
  );
}
