import { PageHero } from '../components/PageHero';

// Copy is a neutral rewrite of the reference's structure. Replace with your own terms (BRANDING_TODO.md).

export function Terms() {
  return (
    <>
      <PageHero label="VENT / TERMS" title="Before you open anything." />
      <div className="container page-body">
        <article className="legal">
          <h2>VENT terms.</h2>
          <h3>What VENT does</h3>
          <ul>
            <li>Private project storage for coin drafts and linked coins.</li>
            <li>Generated assets: artwork, captions and coin websites.</li>
            <li>Market monitoring for registered coins.</li>
          </ul>
          <h3>What VENT does not do</h3>
          <ul>
            <li>It does not issue tokens or execute trades.</li>
            <li>It does not collect creator fees until the mint and treasury exist.</li>
            <li>It does not post to social media on its own. Connected creators publish approved artwork themselves.</li>
          </ul>
          <h3>Your responsibilities</h3>
          <p>
            Review every generated asset. Approve artwork before it joins any public gallery. Verify contract addresses
            before interacting with a token. Market data can be delayed or unavailable, and the seven entities are a
            character layer.
          </p>
          <h3>Risk</h3>
          <p>
            External links are governed by their own services. Memecoins can lose all of their value. Nothing here is a
            promise of returns.
          </p>
        </article>
      </div>
    </>
  );
}

export function Privacy() {
  return (
    <>
      <PageHero label="VENT / PRIVACY" title="Your keys stay on your side." />
      <div className="container page-body">
        <article className="legal">
          <h2>Data in VENT</h2>
          <h3>Launch drafts</h3>
          <p>
            Coin details, optional public links, images and review posts are stored for your project. In this build they
            live in your browser&apos;s local storage only.
          </p>
          <h3>Coin images</h3>
          <p>Images are served back to you through the site. Do not upload anything confidential.</p>
          <h3>Wallet verification</h3>
          <p>
            Verification asks for a public key and, when connected to a backend, a message signature. It never asks for a
            seed phrase or a private key.
          </p>
          <h3>Market data</h3>
          <p>Market observations are read from public sources. External trading links leave the site.</p>
          <h3>X integration</h3>
          <p>Publishing to X requires your authorization and sends only captions and artwork you approved.</p>
          <h3>Tracking</h3>
          <p>No advertising trackers and no third-party font service. Fonts are bundled with the project.</p>
        </article>
      </div>
    </>
  );
}
