// Placeholder auth module — demo only.
// This must be replaced with real authentication (e.g. Supabase Auth)
// and row-level security before any real resident data is added.
// The interface below is intentionally generic so that the portal pages
// can be backed by a real auth provider without changes.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export type PortalRole = 'owner' | 'board';

export interface PortalUser {
  id: string;
  displayName: string;
  unit: string;
  role: PortalRole;
}

interface AuthContextValue {
  user: PortalUser | null;
  loading: boolean;
  signIn: (role: PortalRole) => void;
  signOut: () => void;
}

const STORAGE_KEY = 'lakeside_portal_demo_user';

const DEMO_OWNER: PortalUser = {
  id: 'demo-owner-a',
  displayName: 'Sample Resident A',
  unit: 'Unit 402',
  role: 'owner',
};

const DEMO_BOARD: PortalUser = {
  id: 'demo-board-b',
  displayName: 'Demo Board Member',
  unit: 'Unit 901',
  role: 'board',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): PortalUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PortalUser;
  } catch {
    return null;
  }
}

function writeStoredUser(user: PortalUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage may be unavailable (private mode, SSR); ignore.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const signIn = useCallback((role: PortalRole) => {
    const next = role === 'board' ? DEMO_BOARD : DEMO_OWNER;
    writeStoredUser(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    writeStoredUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
