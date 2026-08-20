import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role, SystemUser } from "../types/roles";
import { ROLE_META } from "../types/roles";
import { useAppStore } from "../store/AppStore";
import { supabase } from "../lib/supabase";
import { fetchProfileByAuthId } from "../lib/profiles";

const LEGACY_SESSION_KEY = "kingsford.session";

type LoginResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: SystemUser | null;
  loading: boolean;
  login: (email: string, password: string, role: Role, remember?: boolean) => Promise<LoginResult>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function clearLegacySession() {
  localStorage.removeItem(LEGACY_SESSION_KEY);
  sessionStorage.removeItem(LEGACY_SESSION_KEY);
}

export function AuthSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm font-medium text-gray-500">Loading school portal…</p>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useAppStore();
  const [fallback, setFallback] = useState<SystemUser | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    if (!fallback) return null;
    return (
      users.find((u) => u.profileId && u.profileId === fallback.profileId) ??
      users.find((u) => u.email.toLowerCase() === fallback.email.toLowerCase()) ??
      fallback
    );
  }, [users, fallback]);

  useEffect(() => {
    clearLegacySession();
    let alive = true;

    const applySession = async (authUserId: string | null) => {
      if (!authUserId) {
        if (alive) {
          setFallback(null);
          setLoading(false);
        }
        return;
      }
      const profile = await fetchProfileByAuthId(authUserId);
      if (!alive) return;
      if (!profile || profile.status !== "Active") {
        await supabase.auth.signOut();
        setFallback(null);
        setLoading(false);
        return;
      }
      setFallback(profile);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => {
      void applySession(data.session?.user.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user.id ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string, role: Role, _remember = true) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) {
      return {
        ok: false as const,
        error: "Email or password is incorrect.",
      };
    }

    const profile = await fetchProfileByAuthId(data.user.id);
    if (!profile) {
      await supabase.auth.signOut();
      return { ok: false as const, error: "This account has no school profile. Contact admin." };
    }
    if (profile.role !== role) {
      await supabase.auth.signOut();
      return {
        ok: false as const,
        error: `This account is a ${ROLE_META[profile.role].label}. Choose that role, then sign in.`,
      };
    }
    if (profile.status !== "Active") {
      await supabase.auth.signOut();
      return { ok: false as const, error: `This account is ${profile.status.toLowerCase()}. Contact admin.` };
    }

    setFallback(profile);
    return { ok: true as const };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearLegacySession();
    setFallback(null);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const next = newPassword.trim();
    if (next.length < 8) {
      return { ok: false as const, error: "New password must be at least 8 characters." };
    }
    if (currentPassword === next) {
      return { ok: false as const, error: "New password must be different from the current password." };
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const email = sessionData.session?.user.email;
    if (!email) {
      return { ok: false as const, error: "You are not signed in." };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (verifyError) {
      return { ok: false as const, error: "Current password is incorrect." };
    }

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) {
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, changePassword, logout }),
    [user, loading, login, changePassword, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthSplash />;
  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  if (user.role !== role) {
    return <Navigate to={ROLE_META[user.role].portalPath} replace />;
  }
  return <>{children}</>;
}
