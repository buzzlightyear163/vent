import { PageHero } from '../components/PageHero';
import { Manual } from '../components/Manual';

export default function Protocol() {
  return (
    <>
      <PageHero label="VENT / PROTOCOL" title="How the air moves.">
        <p className="lead">The gate, the timing, the crew and where the exhaust goes.</p>
      </PageHero>
      <Manual />
    </>
  );
}
