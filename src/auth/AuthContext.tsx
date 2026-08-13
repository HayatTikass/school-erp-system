import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role, SystemUser } from "../types/roles";
import { ROLE_META } from "../types/roles";
import { useAppStore } from "../store/AppStore";

const SESSION_KEY = "kingsford.session";

type AuthContextValue = {
  user: SystemUser | null;
  login: (
    email: string,
    password: string,
    role: Role,
    remember?: boolean,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** "Remember me" stores the session in localStorage; otherwise it lasts for the tab only. */
function readSession(): SystemUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SystemUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useAppStore();
  const [user, setUser] = useState<SystemUser | null>(() => {
    const saved = readSession();
    if (!saved) return null;
    // Rehydrate from live users list when possible
    return users.find((u) => u.id === saved.id) ?? saved;
  });

  const login = useCallback(
    (email: string, password: string, role: Role, remember = true) => {
      const match = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.role === role,
      );
      if (!match) {
        return { ok: false as const, error: "Invalid email, password, or role. Check your credentials." };
      }
      if (match.status !== "Active") {
        return { ok: false as const, error: `This account is ${match.status.toLowerCase()}. Contact admin.` };
      }
      setUser(match);
      const store = remember ? localStorage : sessionStorage;
      const other = remember ? sessionStorage : localStorage;
      other.removeItem(SESSION_KEY);
      store.setItem(SESSION_KEY, JSON.stringify(match));
      return { ok: true as const };
    },
    [users],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== role) {
    return <Navigate to={ROLE_META[user.role].portalPath} replace />;
  }
  return <>{children}</>;
}
