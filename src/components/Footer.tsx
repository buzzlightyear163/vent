import { Link } from 'react-router-dom';
import { brand, footerLinks, legalLinks } from '../data/site';
import { VentMark } from './VentMark';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand">
              <VentMark blink={false} />
              {brand.name}
            </Link>
            <p className="footer-tag">
              {brand.tagline[0]}
              <br />
              {brand.tagline[1]}
            </p>
          </div>
          <div className="footer-links">
            {footerLinks.map((l) => (
              <Link key={l.to} to={l.to} className="textlink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <nav aria-label="Legal">
            {legalLinks.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </nav>
          <span className="status">{brand.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
