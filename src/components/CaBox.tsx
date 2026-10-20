import { useState } from 'react';
import { brand } from '../data/site';
import { useApp } from '../hooks/useApp';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CaBox() {
  const [done, setDone] = useState(false);
  const { toast } = useApp();

  const onCopy = async () => {
    const ok = await copyText(brand.ca);
    toast(ok ? 'CA COPIED' : 'COPY FAILED');
    if (ok) {
      setDone(true);
      window.setTimeout(() => setDone(false), 1400);
    }
  };

  return (
    <div className="ca-box">
      <div className="label">{brand.ticker} / CA</div>
      <div className="ca">{brand.ca}</div>
      <button className={`ca-copy${done ? ' done' : ''}`} onClick={onCopy}>
        {done ? 'COPIED' : 'COPY'}
      </button>
    </div>
  );
}
