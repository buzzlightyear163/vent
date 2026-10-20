import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { readJSON, writeJSON } from '../lib/storage';
import type { EntityId } from '../data/entities';

/* ---------------- types ---------------- */

export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface Post {
  id: string;
  by: EntityId;
  caption: string;
  art: string;
  status: 'pending' | 'approved' | 'cancelled';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  ticker: string;
  description: string;
  image: string | null;
  links: { x: string; telegram: string; website: string };
  devBuy: number;
  mode: 'draft' | 'linked';
  ca: string | null;
  createdAt: string;
  posts: Post[];
}

interface AppState {
  wallet: { status: WalletStatus; address: string | null; demo: boolean };
  walletOpen: boolean;
  setWalletOpen: (v: boolean) => void;
  connect: (kind: 'phantom' | 'demo') => Promise<void>;
  disconnect: () => void;
  toast: (msg: string) => void;
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'posts'>) => Project;
  updatePost: (projectId: string, postId: string, patch: Partial<Post>) => void;
  removeProject: (id: string) => void;
  saved: string[];
  toggleSaved: (coinId: string) => void;
}

const Ctx = createContext<AppState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

/* -------- generated review posts (local stand-in for the creative cycle) -------- */
// TODO(backend): posts come from the real creative cycle worker.
function seedPosts(name: string, ticker: string): Post[] {
  const t = ticker.replace(/^\$/, '').toUpperCase() || 'COIN';
  const now = Date.now();
  return [
    {
      id: uid(),
      by: 'content',
      caption: `nobody asked for $${t}.\nseven things in the ducts built it anyway.`,
      art: ['+--------+', '|========|', '|==o==o==|', `| $${t.slice(0, 5).padEnd(5, ' ')}  |`, '+--------+'].join('\n'),
      status: 'pending',
      createdAt: new Date(now - 4 * 60_000).toISOString(),
    },
    {
      id: uid(),
      by: 'creative',
      caption: `${name.toLowerCase()} woke up at 3am and chose violence (politely).`,
      art: ['  \\  |  /  ', ' -- (  ) -- ', '  /  |  \\  ', `  [${t.slice(0, 6)}]  `].join('\n'),
      status: 'pending',
      createdAt: new Date(now - 19 * 60_000).toISOString(),
    },
    {
      id: uid(),
      by: 'social',
      caption: `something in the vents noticed $${t}. you should too.`,
      art: ['  ####  ', ' (x  x) ', `  ${t.slice(0, 6).padEnd(6, ' ')}`, '  ####  '].join('\n'),
      status: 'approved',
      createdAt: new Date(now - 34 * 60_000).toISOString(),
    },
  ];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<AppState['wallet']>(() =>
    readJSON('vent.wallet', { status: 'disconnected', address: null, demo: false }),
  );
  const [walletOpen, setWalletOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => readJSON('vent.projects', []));
  const [saved, setSaved] = useState<string[]>(() => readJSON('vent.saved', []));
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => writeJSON('vent.projects', projects), [projects]);
  useEffect(() => writeJSON('vent.saved', saved), [saved]);
  useEffect(
    () => writeJSON('vent.wallet', wallet.status === 'connected' ? wallet : { status: 'disconnected', address: null, demo: false }),
    [wallet],
  );

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const connect = useCallback(
    async (kind: 'phantom' | 'demo') => {
      setWallet((w) => ({ ...w, status: 'connecting' }));
      try {
        if (kind === 'phantom') {
          const provider = window.phantom?.solana ?? window.solana;
          if (!provider) throw new Error('No Solana wallet detected');
          // Read-only: we only ask for the public key. No signing happens here.
          // TODO(backend): signed-message verification against the VENT API.
          const { publicKey } = await provider.connect();
          setWallet({ status: 'connected', address: publicKey.toString(), demo: false });
        } else {
          await new Promise((r) => setTimeout(r, 700));
          setWallet({ status: 'connected', address: 'DemoWa11et' + uid().toUpperCase() + 'xyz', demo: true });
        }
        setWalletOpen(false);
        toast('WALLET CONNECTED');
      } catch (e) {
        setWallet({ status: 'error', address: null, demo: false });
        toast(e instanceof Error ? e.message.toUpperCase() : 'CONNECTION FAILED');
      }
    },
    [toast],
  );

  const disconnect = useCallback(() => {
    const provider = window.phantom?.solana ?? window.solana;
    if (!wallet.demo && provider) provider.disconnect().catch(() => undefined);
    setWallet({ status: 'disconnected', address: null, demo: false });
    toast('WALLET DISCONNECTED');
  }, [toast, wallet.demo]);

  const addProject: AppState['addProject'] = useCallback((p) => {
    const project: Project = { ...p, id: uid(), createdAt: new Date().toISOString(), posts: seedPosts(p.name, p.ticker) };
    setProjects((list) => [project, ...list]);
    return project;
  }, []);

  const updatePost: AppState['updatePost'] = useCallback((projectId, postId, patch) => {
    setProjects((list) =>
      list.map((pr) =>
        pr.id !== projectId ? pr : { ...pr, posts: pr.posts.map((po) => (po.id === postId ? { ...po, ...patch } : po)) },
      ),
    );
  }, []);

  const removeProject = useCallback((id: string) => setProjects((list) => list.filter((p) => p.id !== id)), []);

  const toggleSaved = useCallback(
    (coinId: string) => setSaved((s) => (s.includes(coinId) ? s.filter((x) => x !== coinId) : [...s, coinId])),
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      wallet,
      walletOpen,
      setWalletOpen,
      connect,
      disconnect,
      toast,
      projects,
      addProject,
      updatePost,
      removeProject,
      saved,
      toggleSaved,
    }),
    [wallet, walletOpen, connect, disconnect, toast, projects, addProject, updatePost, removeProject, saved, toggleSaved],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg && (
        <div className="toast" role="status">
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
