// Admission.jsx — /OnlineAdmission route
// The full enrollment dashboard (Dashboard, My Courses, Browse & Enroll)
// now lives at /user/dashboard. This component redirects logged-in users there
// and prompts guests to log in first.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Admission() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      // Redirect to the unified dashboard → Browse & Enroll tab
      navigate("/user/dashboard", { replace: true });
    } else {
      navigate("/login?redirect=/user/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show a brief loading state while auth is resolving
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="text-center text-slate-500">
        <div className="text-4xl mb-3 animate-spin">⏳</div>
        <p className="text-sm">Redirecting…</p>
      </div>
    </div>
  );
}
