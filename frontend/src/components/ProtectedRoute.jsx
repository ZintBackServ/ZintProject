
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks logged-out users
export function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// Blocks non-admins
export function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return children;
}