/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_LIVE_MARKET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
}

interface Window {
  solana?: PhantomProvider;
  phantom?: { solana?: PhantomProvider };
}
