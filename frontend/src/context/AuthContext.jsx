// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { userId, role, firstName, ... }
  const [authLoading, setAuthLoading] = useState(true);

  // On app load — call /user/me to restore session from httpOnly cookie
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/user/me`, {
          credentials: "include",   // send cookie
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) setUser(data.data);
        }
      } catch {
        // no session
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  // Called after login/OTP — server already set the cookie
  const login = (userData) => {
    setUser(userData);
  };

  // Calls backend to clear cookie, then clears state
  const logout = async () => {
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}