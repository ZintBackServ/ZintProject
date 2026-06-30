import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login?error=google_failed");
      return;
    }

    try {
      login(token); // saves to localStorage + sets auth state
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch {
      navigate("/login?error=google_failed");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f0318 0%, #1a0529 50%, #0a0a1a 100%)" }}>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: "linear-gradient(135deg, #8E1387, #B11FA8)" }}>
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-white font-medium">Signing you in with Google...</p>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>You'll be redirected shortly</p>
      </div>
    </div>
  );
}