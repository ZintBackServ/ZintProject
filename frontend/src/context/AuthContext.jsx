import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import { SessionContext } from "./sessionContext";
import { apiUrl } from "../utils/api";

async function fetchCurrentUser() {
  const res = await fetch(apiUrl("/user/me"), { credentials: "include" });

  // ── Single-session enforcement ─────────────────────────────────────────────
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    if (data?.code === "SESSION_SUPERSEDED") {
      // Signal to the Login page that we were kicked out
      sessionStorage.setItem(
        "auth_notice",
        "Your account was signed in on another device. You have been logged out."
      );
      return "SESSION_SUPERSEDED";  // special sentinel
    }
    return null;
  }

  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data : null;
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const sessionPollRef = useRef(null);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const profile = await fetchCurrentUser();
        if (!active) return;
        if (profile === "SESSION_SUPERSEDED") {
          setUser(null);
        } else {
          setUser(profile);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    })();

    return () => { active = false; };
  }, []);

  // ── Session heartbeat: poll every 60 s to detect same-account login elsewhere
  useEffect(() => {
    if (sessionPollRef.current) clearInterval(sessionPollRef.current);

    if (!user) return; // no need to poll when logged out

    sessionPollRef.current = setInterval(async () => {
      const profile = await fetchCurrentUser().catch(() => null);
      if (profile === "SESSION_SUPERSEDED") {
        setUser(null);
        // Redirect to login — the sessionStorage notice will be shown there
        window.location.href = "/login";
      }
    }, 60_000); // every 60 seconds

    return () => clearInterval(sessionPollRef.current);
  }, [user]);

  const login = useCallback(async (userData) => {
    if (userData) {
      setUser(userData);
      return userData;
    }

    const profile = await fetchCurrentUser();
    if (profile === "SESSION_SUPERSEDED") {
      setUser(null);
      return null;
    }
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(apiUrl("/user/logout"), {
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
