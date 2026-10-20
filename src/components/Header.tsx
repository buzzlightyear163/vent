import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { brand, nav } from '../data/site';
import { WalletButton } from './Wallet';
import { VentMark } from './VentMark';

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link to="/" className="brand" aria-label={`${brand.name} home`}>
            <VentMark />
            {brand.name}
          </Link>
          <nav className="nav" aria-label="Primary">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="hdr-actions">
            <WalletButton className="wallet-btn" />
            <Link to="/launch" className="btn btn--solid">
              Launch ↗
            </Link>
            <button
              className="menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? '×' : '≡'}
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        {nav.map((n, i) => (
          <NavLink key={n.to} to={n.to} tabIndex={open ? 0 : -1}>
            {n.label}
            <span className="idx">0{i + 1}</span>
          </NavLink>
        ))}
        <div className="drawer-actions">
          <WalletButton />
        </div>
      </div>
    </>
  );
}
