import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Loading spinner while auth cookie is being verified
function AuthLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-center text-slate-400">
        <div className="text-4xl mb-2 animate-spin">⏳</div>
        <p className="text-sm">Checking session…</p>
      </div>
    </div>
  );
}

// Blocks logged-out users
export function PrivateRoute({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <AuthLoader />;
  return user ? children : <Navigate to="/login" />;
}

// Blocks non-admins
export function AdminRoute({ children }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
}