import { emptyBox } from '../data/ascii';
import { BracketLink } from '../components/Bracket';

export default function NotFound() {
  return (
    <section className="page-hero container">
      <div className="status">SECTOR_404 / NO DUCT</div>
      <h1>Nothing in these vents.</h1>
      <pre className="ascii ascii--dim">{emptyBox}</pre>
      <BracketLink to="/" double>
        BACK TO THE COMPOUND ↗
      </BracketLink>
    </section>
  );
}
