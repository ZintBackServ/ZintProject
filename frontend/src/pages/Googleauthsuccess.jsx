import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const profile = await login();
        if (profile) {
          navigate(profile.role === "admin" ? "/admin/dashboard" : "/");
        } else {
          navigate("/login?error=google_failed");
        }
      } catch {
        navigate("/login?error=google_failed");
      }
    })();
  }, [login, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f0318 0%, #1a0529 50%, #0a0a1a 100%)" }}
    >
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: "linear-gradient(135deg, #8E1387, #B11FA8)" }}
        >
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white font-medium">Signing you in with Google...</p>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
          You&apos;ll be redirected shortly
        </p>
      </div>
    </div>
  );
}