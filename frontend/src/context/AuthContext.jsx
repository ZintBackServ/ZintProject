// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, role }

  useEffect(() => {
    // On app load, check if token exists and decode it
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT payload (middle part)
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Check token not expired
        if (payload.exp * 1000 > Date.now()) {
          setUser({ userId: payload.userId, role: payload.role });
        } else {
          // Token expired — clear it
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ userId: payload.userId, role: payload.role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}