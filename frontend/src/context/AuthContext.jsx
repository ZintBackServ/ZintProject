import { useCallback, useEffect, useMemo, useState } from "react";
import { SessionContext } from "./sessionContext";

const API = import.meta.env.VITE_API_URL;

async function fetchCurrentUser() {
  const res = await fetch(`${API}/user/me`, { credentials: "include" });
  if (!res.ok) return null;

  const data = await res.json();
  return data.success ? data.data : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const profile = await fetchCurrentUser();
        if (active) setUser(profile);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (userData) => {
    if (userData) {
      setUser(userData);
      return userData;
    }

    const profile = await fetchCurrentUser();
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, authLoading }),
    [user, login, logout, authLoading]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
