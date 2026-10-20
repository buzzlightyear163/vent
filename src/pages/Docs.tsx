import { PageHero } from '../components/PageHero';
import { Manual } from '../components/Manual';

export default function Docs() {
  return (
    <>
      <PageHero label="VENT / MAINTENANCE MANUAL" title="The maintenance manual.">
        <p className="lead">Read this before you open a vent. The things inside have rules.</p>
      </PageHero>
      <Manual />
    </>
  );
}
