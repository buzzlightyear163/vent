import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { BracketButton } from '../components/Bracket';
import { useApp } from '../hooks/useApp';
import { brand } from '../data/site';
import { shortAddr } from '../lib/format';

type Mode = 'new' | 'link';

const isMint = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s.trim());

/** Downscale an uploaded image so drafts fit in browser storage. */
function downscale(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      const s = Math.min(1, size / Math.max(img.width, img.height));
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}

export default function Launch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addProject, wallet, setWalletOpen, toast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>('new');
  const [name, setName] = useState(params.get('name') ?? '');
  const [ticker, setTicker] = useState(() => (params.get('name') ?? '').replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase());
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [links, setLinks] = useState({ x: '', telegram: '', website: '' });
  const [devBuy, setDevBuy] = useState('');
  const [ca, setCa] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const nameErr = touched && !name.trim() ? 'Give it a name.' : null;
  const tickerErr = touched && !/^[A-Z0-9]{2,10}$/.test(ticker) ? '2–10 letters or digits.' : null;
  const caErr = touched && mode === 'link' && !isMint(ca) ? 'That does not look like a Solana mint address.' : null;

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setImage(await downscale(f));
    } catch {
      toast('IMAGE COULD NOT BE READ');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !/^[A-Z0-9]{2,10}$/.test(ticker)) return;
    if (mode === 'link') {
      if (!isMint(ca)) return;
      if (wallet.status !== 'connected') {
        setWalletOpen(true);
        return;
      }
    }
    setBusy(true);
    // TODO(backend): POST the draft / verify the creation transaction against the VENT API.
    await new Promise((r) => setTimeout(r, 600));
    const p = addProject({
      name: name.trim(),
      ticker,
      description: description.trim(),
      image,
      links,
      devBuy: Number(devBuy) || 0,
      mode: mode === 'link' ? 'linked' : 'draft',
      ca: mode === 'link' ? ca.trim() : null,
    });
    setBusy(false);
    toast(mode === 'link' ? 'COIN LINKED TO YOUR STUDIO' : 'DRAFT SAVED TO YOUR STUDIO');
    navigate(`/studio?project=${p.id}`);
  };

  const receipt = [
    `COIN ........ ${name.trim() || '—'}`,
    `TICKER ...... ${ticker ? '$' + ticker : '—'}`,
    `NETWORK ..... Solana / pump.fun curve`,
    `CREATOR FEE . 1%  (50 burn / 25 holders / 25 ops)`,
    `GATE ........ $${brand.activationCap / 1000}K ten-minute low`,
    `MILESTONE ... $${brand.dexCap / 1000}K sustained -> Dexscreener`,
    `DEV BUY ..... ${Number(devBuy) > 0 ? `${Number(devBuy)} SOL` : 'none'}`,
    mode === 'link' ? `MINT ........ ${ca ? shortAddr(ca.trim(), 6, 6) : '—'}` : `MINT ........ pending`,
  ].join('\n');

  return (
    <>
      <PageHero label="VENT / LAUNCH" title="Name it. Then open the vent.">
        <p className="lead">Give it a name, a ticker and a face. Seven things in the ducts take it from there.</p>
      </PageHero>

      <div className="container page-body">
        <form className="launch" onSubmit={onSubmit} noValidate>
          <div className="launch-form">
            <div className="tabs" role="tablist">
              <button type="button" role="tab" aria-selected={mode === 'new'} className={mode === 'new' ? 'on' : undefined} onClick={() => setMode('new')}>
                New coin
              </button>
              <button type="button" role="tab" aria-selected={mode === 'link'} className={mode === 'link' ? 'on' : undefined} onClick={() => setMode('link')}>
                Link a live coin
              </button>
            </div>

            <div className="two">
              <label className={`field${nameErr ? ' invalid' : ''}`}>
                <span>Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="coin_name" maxLength={32} />
                {nameErr && <span className="err">{nameErr}</span>}
              </label>
              <label className={`field${tickerErr ? ' invalid' : ''}`}>
                <span>Ticker</span>
                <input
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10))}
                  placeholder="TICKER"
                />
                {tickerErr && <span className="err">{tickerErr}</span>}
              </label>
            </div>

            {mode === 'link' && (
              <label className={`field${caErr ? ' invalid' : ''}`}>
                <span>Contract address</span>
                <input value={ca} onChange={(e) => setCa(e.target.value)} placeholder="mint address" spellCheck={false} />
                <span className="hint">Linking requires the wallet that signed the creation transaction.</span>
                {caErr && <span className="err">{caErr}</span>}
              </label>
            )}

            <label className="field">
              <span>Description</span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="one line of lore. the ducts do the rest." maxLength={280} />
            </label>

            <div className="field">
              <span>Image</span>
              <div className="upload" role="button" tabIndex={0} onClick={() => fileRef.current?.click()} onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}>
                <div className="thumb">{image ? <img src={image} alt="Coin preview" /> : '[ ]'}</div>
                <div>
                  <div>{image ? 'Replace image' : 'Give it a face'}</div>
                  <div className="hint muted" style={{ fontSize: 'var(--fs-xs)' }}>
                    PNG, JPG or GIF. Do not upload anything confidential.
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImage} />
              </div>
            </div>

            <div className="three">
              <label className="field">
                <span>X</span>
                <input value={links.x} onChange={(e) => setLinks({ ...links, x: e.target.value })} placeholder="optional" />
              </label>
              <label className="field">
                <span>Telegram</span>
                <input value={links.telegram} onChange={(e) => setLinks({ ...links, telegram: e.target.value })} placeholder="optional" />
              </label>
              <label className="field">
                <span>Website</span>
                <input value={links.website} onChange={(e) => setLinks({ ...links, website: e.target.value })} placeholder="optional" />
              </label>
            </div>

            {mode === 'new' && (
              <label className="field" style={{ maxWidth: 220 }}>
                <span>Dev buy (SOL)</span>
                <input inputMode="decimal" value={devBuy} onChange={(e) => setDevBuy(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0" />
              </label>
            )}
          </div>

          <aside className="receipt">
            <span className="label">launch_receipt.txt</span>
            <pre>{receipt}</pre>
            <div className="notice">
              <strong>NOT LIVE YET.</strong> Native token creation and the creator fee wait for the pairing mint and
              treasury wallet. Save a draft now, or link a coin that already exists.
            </div>
            <BracketButton type="submit" variant="solid" disabled={busy}>
              {busy ? 'OPENING THE VENT…' : mode === 'link' ? 'VERIFY + LINK COIN' : 'SAVE DRAFT TO STUDIO'}
            </BracketButton>
            {mode === 'new' && (
              <BracketButton type="button" disabled title="TODO(backend): native mint">
                LAUNCH ON PUMP.FUN
              </BracketButton>
            )}
            {mode === 'link' && wallet.status !== 'connected' && (
              <p className="status">connect the creation wallet to verify</p>
            )}
          </aside>
        </form>
      </div>
    </>
  );
}
