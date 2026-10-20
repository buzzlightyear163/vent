import { useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { shortAddr } from '../lib/format';
import { TermWindow } from './TermWindow';

export function WalletButton({ className }: { className?: string }) {
  const { wallet, setWalletOpen, disconnect } = useApp();
  const cls = ['btn', className].filter(Boolean).join(' ');

  if (wallet.status === 'connected' && wallet.address) {
    return (
      <button className={cls} onClick={disconnect} title="Disconnect wallet">
        <span className="dot" />
        {shortAddr(wallet.address)}
        {wallet.demo && <span className="muted">demo</span>}
      </button>
    );
  }
  return (
    <button className={cls} onClick={() => setWalletOpen(true)} disabled={wallet.status === 'connecting'}>
      <span className="br" aria-hidden="true">
        [
      </span>
      {wallet.status === 'connecting' ? 'Connecting…' : 'Connect wallet'}
      <span className="br" aria-hidden="true">
        ]
      </span>
    </button>
  );
}

export function WalletModal() {
  const { walletOpen, setWalletOpen, connect, wallet } = useApp();

  useEffect(() => {
    if (!walletOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setWalletOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [walletOpen, setWalletOpen]);

  if (!walletOpen) return null;
  const hasPhantom = typeof window !== 'undefined' && Boolean(window.phantom?.solana ?? window.solana);

  return (
    <div className="modal-back" onClick={() => setWalletOpen(false)}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Connect wallet" onClick={(e) => e.stopPropagation()}>
        <TermWindow label="connect_wallet.sh" onClose={() => setWalletOpen(false)}>
          <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
            Verification asks for a message signature only. Never a seed phrase or private key.
          </p>
          <button className="wallet-opt" onClick={() => connect('phantom')} disabled={wallet.status === 'connecting'}>
            <span>Phantom / Solana wallet</span>
            <span className="muted">{hasPhantom ? 'detected' : 'not found'}</span>
          </button>
          <button className="wallet-opt" onClick={() => connect('demo')} disabled={wallet.status === 'connecting'}>
            <span>Demo wallet</span>
            <span className="muted">local only</span>
          </button>
          {wallet.status === 'connecting' && <p className="status status--accent">connecting<span className="blink">_</span></p>}
          {wallet.status === 'error' && <p className="status neg">connection failed. try again.</p>}
        </TermWindow>
      </div>
    </div>
  );
}
