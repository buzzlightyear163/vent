import { useState } from 'react';
import { Link } from 'react-router-dom';
import { entities } from '../data/entities';

export function RoleAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="accordion">
      {entities.map((e) => {
        const isOpen = open === e.id;
        return (
          <div key={e.id} className={`acc-item${isOpen ? ' open' : ''}`}>
            <button
              className="acc-btn"
              aria-expanded={isOpen}
              aria-controls={`acc-${e.id}`}
              onClick={() => setOpen(isOpen ? null : e.id)}
            >
              <span>
                {e.idx} / {e.role}
              </span>
              <span className="sign">{isOpen ? '[ - ]' : '[ + ]'}</span>
            </button>
            <div className="acc-panel" id={`acc-${e.id}`} role="region">
              <div>
                <p>
                  <Link to={`/teams?agent=${e.id}`} className="who">
                    {e.name}
                  </Link>{' '}
                  — {e.brief}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
