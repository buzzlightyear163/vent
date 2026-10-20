import type { ElementType } from 'react';

/** Section heading framed like a grille: "=[ title ]=". */
export function AsciiHeading({ children, as: Tag = 'h2', id }: { children: string; as?: ElementType; id?: string }) {
  return (
    <Tag className="ascii-h2" id={id}>
      <span className="rule">=[ </span>
      {children}
      <span className="rule"> ]=</span>
    </Tag>
  );
}
