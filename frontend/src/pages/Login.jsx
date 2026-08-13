import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiUrl, googleAuthUrl } from "../utils/api";
import Antigravity from "./Antigravity";

// ── Forgot Password OTP input boxes ──────────────────────────────────────────
function OTPBoxes({ otp, setOtp, inputRefs }) {
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) { setOtp(paste.split("")); inputRefs.current[5]?.focus(); }
  };
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }} onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1}
          value={digit}
          onChange={e => handleOtpChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          style={{
            width: 44, height: 52, textAlign: "center",
            fontSize: 20, fontWeight: 700, color: "#fff",
            borderRadius: 10, outline: "none",
            background: digit ? "rgba(177,31,168,0.2)" : "rgba(255,255,255,0.05)",
            border: `2px solid ${digit ? "#B11FA8" : "rgba(255,255,255,0.15)"}`,
            boxShadow: digit ? "0 0 0 3px rgba(177,31,168,0.2)" : "none",
            transition: "all 0.15s", fontFamily: "ui-monospace, monospace",
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  // ── Login form state ──────────────────────────────────────────────────────
  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  // ── Single-session notice (set by AuthContext when kicked off another device)
  const [authNotice, setAuthNotice] = useState("");
  useEffect(() => {
    const notice = sessionStorage.getItem("auth_notice");
    if (notice) {
      setAuthNotice(notice);
      sessionStorage.removeItem("auth_notice");
    }
  }, []);

  // ── Forgot Password state ─────────────────────────────────────────────────
  const [fpMode, setFpMode]           = useState(false);   // show forgot panel
  const [fpStep, setFpStep]           = useState(1);       // 1 | 2 | 3
  const [fpEmail, setFpEmail]         = useState("");
  const [fpOtp, setFpOtp]             = useState(["", "", "", "", "", ""]);
  const [fpResetToken, setFpResetToken] = useState("");
  const [fpNewPass, setFpNewPass]     = useState("");
  const [fpConfirmPass, setFpConfirmPass] = useState("");
  const [fpShowNew, setFpShowNew]     = useState(false);
  const [fpShowConfirm, setFpShowConfirm] = useState(false);
  const [fpError, setFpError]         = useState("");
  const [fpSuccess, setFpSuccess]     = useState("");
  const [fpLoading, setFpLoading]     = useState(false);
  const otpRefs = useRef([]);

  const cardRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/user/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Login failed."); return; }
      const profile = await login();
      if (redirect)                   navigate(redirect);
      else if (profile?.role === "admin") navigate("/admin/dashboard");
      else                            navigate("/");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = googleAuthUrl();
  };

  // ── Forgot password handlers ──────────────────────────────────────────────
  const openForgotPassword = () => {
    setFpMode(true); setFpStep(1);
    setFpEmail(""); setFpOtp(["", "", "", "", "", ""]);
    setFpResetToken(""); setFpNewPass(""); setFpConfirmPass("");
    setFpError(""); setFpSuccess("");
  };

  const closeForgotPassword = () => {
    setFpMode(false); setFpStep(1); setFpError(""); setFpSuccess("");
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!fpEmail.trim()) { setFpError("Please enter your email address."); return; }
    if (!/^\S+@\S+\.\S+$/.test(fpEmail)) { setFpError("Enter a valid email address."); return; }
    setFpLoading(true); setFpError(""); setFpSuccess("");
    try {
      const res  = await fetch(apiUrl("/user/forgot-password"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.msg || "Something went wrong."); return; }
      setFpSuccess("OTP sent! Check your email inbox.");
      setTimeout(() => { setFpStep(2); setFpSuccess(""); setFpOtp(["", "", "", "", "", ""]); }, 1200);
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const otpStr = fpOtp.join("");
    if (otpStr.length < 6) { setFpError("Enter all 6 digits."); return; }
    setFpLoading(true); setFpError(""); setFpSuccess("");
    try {
      const res  = await fetch(apiUrl("/user/verify-reset-otp"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, otp: otpStr }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.msg || "Invalid OTP."); return; }
      setFpResetToken(data.resetToken);
      setFpSuccess("OTP verified!");
      setTimeout(() => { setFpStep(3); setFpSuccess(""); }, 800);
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!fpNewPass) { setFpError("Enter your new password."); return; }
    if (fpNewPass !== fpConfirmPass) { setFpError("Passwords do not match."); return; }
    if (!/^(?=.{8,20}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(fpNewPass)) {
      setFpError("8–20 chars with uppercase, lowercase, number & special character.");
      return;
    }
    setFpLoading(true); setFpError(""); setFpSuccess("");
    try {
      const res  = await fetch(apiUrl("/user/reset-password"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: fpResetToken, newPassword: fpNewPass }),
      });
      const data = await res.json();
      if (!res.ok) { setFpError(data.msg || "Failed to reset password."); return; }
      setFpSuccess("Password reset! Redirecting to login…");
      setTimeout(() => { closeForgotPassword(); }, 2000);
    } catch { setFpError("Network error. Please try again."); }
    finally { setFpLoading(false); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, padding: "12px 16px",
    fontSize: 14, color: "#fff", outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#0a0a0f" }}>

      {/* Antigravity background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Antigravity
          count={350} magnetRadius={8} ringRadius={7} waveSpeed={0.4}
          waveAmplitude={1} particleSize={1.4} lerpSpeed={0.06}
          color="#5227FF" autoAnimate={false} particleVariance={1}
          rotationSpeed={0} depthFactor={1} pulseSpeed={3}
          particleShape="capsule" fieldStrength={10} cardBoundsRef={cardRef}
        />
      </div>

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#8E1387" }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "#53BFEA" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #8E1387, #B11FA8)" }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {fpMode ? "Reset Password" : "Welcome back"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
            {fpMode ? "We'll help you get back in" : "Sign in to your account"}
          </p>
        </div>

        {/* Card */}
        <div ref={cardRef} className="relative rounded-2xl p-8 border overflow-hidden transition-all duration-300 shadow-2xl z-10"
          style={{ background: "#0b0b14", borderColor: "rgba(82,39,255,0.25)" }}>

          {/* ── FORGOT PASSWORD PANEL ──────────────────────────────────── */}
          {fpMode ? (
            <div>
              {/* Step indicators */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
                {[1, 2, 3].map((s, i) => {
                  const done   = s < fpStep;
                  const active = s === fpStep;
                  return (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", fontSize: 12, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: active || done ? "linear-gradient(135deg,#8E1387,#B11FA8)" : "rgba(255,255,255,0.1)",
                        color: active || done ? "#fff" : "#6b7280",
                        boxShadow: active ? "0 0 12px rgba(177,31,168,0.5)" : "none",
                        transition: "all 0.3s",
                      }}>
                        {done ? (
                          <svg width={12} height={12} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        ) : s}
                      </div>
                      {i < 2 && (
                        <div style={{
                          width: 36, height: 2, borderRadius: 1,
                          background: s < fpStep ? "#B11FA8" : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step labels */}
              <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
                {fpStep === 1 && "Enter your registered email"}
                {fpStep === 2 && `Enter the 6-digit OTP sent to ${fpEmail}`}
                {fpStep === 3 && "Set your new password"}
              </p>

              {/* Error */}
              {fpError && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 13,
                }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {fpError}
                </div>
              )}

              {/* Success */}
              {fpSuccess && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 14px", borderRadius: 10, marginBottom: 16,
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", fontSize: 13,
                }}>
                  <svg width={16} height={16} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {fpSuccess}
                </div>
              )}

              {/* ── Step 1: Email ── */}
              {fpStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#d1d5db" }}>
                      Email address
                    </label>
                    <input
                      type="email" value={fpEmail}
                      onChange={e => { setFpEmail(e.target.value); setFpError(""); }}
                      placeholder="you@example.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#B11FA8"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                  </div>
                  <button
                    onClick={handleSendOTP} disabled={fpLoading}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                      color: "#fff", border: "none", cursor: fpLoading ? "not-allowed" : "pointer",
                      background: fpLoading ? "rgba(142,19,135,0.5)" : "linear-gradient(135deg,#8E1387,#B11FA8)",
                      boxShadow: fpLoading ? "none" : "0 4px 20px rgba(177,31,168,0.4)",
                      transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {fpLoading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        Sending OTP…
                      </span>
                    ) : "Send OTP"}
                  </button>
                </div>
              )}

              {/* ── Step 2: OTP ── */}
              {fpStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <OTPBoxes otp={fpOtp} setOtp={setFpOtp} inputRefs={otpRefs} />
                  <button
                    onClick={handleVerifyOTP} disabled={fpLoading || fpOtp.join("").length < 6}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                      color: "#fff", border: "none",
                      cursor: fpLoading || fpOtp.join("").length < 6 ? "not-allowed" : "pointer",
                      background: fpLoading || fpOtp.join("").length < 6
                        ? "rgba(142,19,135,0.5)"
                        : "linear-gradient(135deg,#8E1387,#B11FA8)",
                      boxShadow: fpOtp.join("").length === 6 && !fpLoading ? "0 4px 20px rgba(177,31,168,0.4)" : "none",
                      transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {fpLoading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        Verifying…
                      </span>
                    ) : "Verify OTP"}
                  </button>
                  <button onClick={() => setFpStep(1)}
                    style={{ background: "none", border: "none", color: "#53BFEA", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    ← Change email
                  </button>
                </div>
              )}

              {/* ── Step 3: New Password ── */}
              {fpStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* New Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#d1d5db" }}>
                      New password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={fpShowNew ? "text" : "password"}
                        value={fpNewPass}
                        onChange={e => { setFpNewPass(e.target.value); setFpError(""); }}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        onFocus={e => e.target.style.borderColor = "#B11FA8"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                      />
                      <button type="button" onClick={() => setFpShowNew(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, lineHeight: 0 }}
                        tabIndex={-1}>
                        {fpShowNew
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: "#6b7280", marginTop: 5 }}>
                      8–20 chars · uppercase · lowercase · number · special char
                    </p>
                  </div>
                  {/* Confirm Password */}
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#d1d5db" }}>
                      Confirm new password
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={fpShowConfirm ? "text" : "password"}
                        value={fpConfirmPass}
                        onChange={e => { setFpConfirmPass(e.target.value); setFpError(""); }}
                        placeholder="••••••••"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        onFocus={e => e.target.style.borderColor = "#B11FA8"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                      />
                      <button type="button" onClick={() => setFpShowConfirm(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 0, lineHeight: 0 }}
                        tabIndex={-1}>
                        {fpShowConfirm
                          ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleResetPassword} disabled={fpLoading}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, fontWeight: 600, fontSize: 14,
                      color: "#fff", border: "none", cursor: fpLoading ? "not-allowed" : "pointer",
                      background: fpLoading ? "rgba(142,19,135,0.5)" : "linear-gradient(135deg,#8E1387,#B11FA8)",
                      boxShadow: fpLoading ? "none" : "0 4px 20px rgba(177,31,168,0.4)",
                      transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {fpLoading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        Resetting…
                      </span>
                    ) : "Reset Password"}
                  </button>
                </div>
              )}

              {/* Back to login */}
              <p style={{ textAlign: "center", fontSize: 13, marginTop: 20, color: "#6b7280" }}>
                Remember your password?{" "}
                <button onClick={closeForgotPassword}
                  style={{ background: "none", border: "none", color: "#53BFEA", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
                  onMouseLeave={e => e.currentTarget.style.color = "#53BFEA"}>
                  Sign in
                </button>
              </p>
            </div>

          ) : (
            /* ── NORMAL LOGIN FORM ──────────────────────────────────────── */
            <>
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin} disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 mb-6"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {googleLoading ? "Redirecting..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                <span className="text-xs" style={{ color: "#6b7280" }}>or sign in with email</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              </div>

              {/* Session-superseded notice */}
              {authNotice && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", color: "#fbbf24" }}>
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{authNotice}</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}


              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#d1d5db" }}>Email address</label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@example.com" required
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={e => e.target.style.borderColor = "#B11FA8"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: "#d1d5db" }}>Password</label>
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="text-xs transition-colors"
                      style={{ color: "#53BFEA" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
                      onMouseLeave={e => e.currentTarget.style.color = "#53BFEA"}>
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password" value={formData.password}
                      onChange={handleChange} placeholder="••••••••" required
                      className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onFocus={e => e.target.style.borderColor = "#B11FA8"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
                      style={{ color: "#6b7280" }}>
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 mt-2 relative overflow-hidden"
                  style={{
                    background: loading ? "rgba(142,19,135,0.5)" : "linear-gradient(135deg, #8E1387, #B11FA8)",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(177,31,168,0.4)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : "Sign in"}
                </button>
              </form>

              {/* Sign up link */}
              <p className="text-center text-sm mt-6" style={{ color: "#6b7280" }}>
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")}
                  className="font-medium transition-colors"
                  style={{ color: "#53BFEA" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
                  onMouseLeave={e => e.currentTarget.style.color = "#53BFEA"}>
                  Create account
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}