import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Brand colors ─────────────────────────────────
const DarkPurple    = "#8E1387";
const PrimaryPurple = "#B11FA8";
const BLUE          = "#53BFEA";
const GREEN         = "#45B51D";

// ─────────────────────────────────────────────────
// Field components are defined OUTSIDE any render
// function so they never get a new reference on
// re-render → no remount → no focus loss.
// ─────────────────────────────────────────────────

const inputBase = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  color: "#111827",
  background: "#f9f5fa",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  fontFamily: "inherit",
};

function Field({ label, name, type = "text", placeholder, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 5, color: "#5a2e57" }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          ...inputBase,
          border: `1.5px solid ${error ? "#ef4444" : focused ? PrimaryPurple : "#e0cfe0"}`,
          boxShadow: focused && !error ? `0 0 0 3px ${PrimaryPurple}18` : "none",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function PasswordField({ label, name, placeholder, value, onChange, error }) {
  const [show, setShow]       = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 5, color: "#5a2e57" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          style={{
            ...inputBase,
            paddingRight: 40,
            border: `1.5px solid ${error ? "#ef4444" : focused ? PrimaryPurple : "#e0cfe0"}`,
            boxShadow: focused && !error ? `0 0 0 3px ${PrimaryPurple}18` : "none",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none",
            cursor: "pointer", color: "#9b7d99", padding: 0, lineHeight: 0,
          }}
          tabIndex={-1}
        >
          {show ? (
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Step 1: Registration Form ─────────────────────
function RegistrationStep({ onSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", contactNo: "",
    address: "", city: "", state: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors]         = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]       = useState(false);

  const validate = () => {
    const e = {};
    const { firstName, lastName, email, contactNo, address, city, state, password, confirmPassword } = formData;
    if (firstName.trim().length < 2)          e.firstName        = "At least 2 characters required";
    else if (!/^[a-zA-Z ]+$/.test(firstName)) e.firstName        = "Only letters allowed";
    if (!lastName.trim())                      e.lastName         = "Last name is required";
    else if (!/^[a-zA-Z ]+$/.test(lastName))  e.lastName         = "Only letters allowed";
    if (!/^\S+@\S+\.\S+$/.test(email))        e.email            = "Invalid email address";
    if (!/^(?:\+91)?[6-9]\d{9}$/.test(contactNo)) e.contactNo   = "Invalid Indian phone number";
    if (!address.trim())                       e.address          = "Address is required";
    if (!city.trim())                          e.city             = "City is required";
    if (!state.trim())                         e.state            = "State is required";
    if (!/^(?=.{8,20}$)(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(password))
      e.password = "8–20 chars with uppercase, lowercase, number & special character";
    if (password !== confirmPassword)          e.confirmPassword  = "Passwords do not match";
    return e;
  };

  // Single stable handler — never recreated
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setServerError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      const { confirmPassword, ...userData } = formData;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/newUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(Array.isArray(data.msg) ? data.msg.join(", ") : (data.msg || "Registration failed."));
        return;
      }
      onSuccess(formData.email);
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: 16, marginBottom: 12,
          background: `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`,
        }}>
          <svg width={28} height={28} fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a0019", margin: 0 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#7a4e77", marginTop: 4 }}>Join us — it only takes a minute</p>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff", border: `1px solid ${PrimaryPurple}22`,
        borderRadius: 20, padding: "28px 28px 24px",
        boxShadow: "0 4px 32px rgba(142,19,135,0.07)",
      }}>

        {/* Google */}
        <button
          type="button"
          onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/google`; }}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, padding: "10px 16px", borderRadius: 10, fontSize: 14, fontWeight: 500,
            background: "#fff", border: "1.5px solid #e0cfe0", color: "#1a0019",
            cursor: "pointer", transition: "all 0.18s", marginBottom: 20, fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f9f5fa"; e.currentTarget.style.borderColor = PrimaryPurple; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e0cfe0"; }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#e0cfe0" }} />
          <span style={{ fontSize: 12, color: "#b097af" }}>or fill in your details</span>
          <div style={{ flex: 1, height: 1, background: "#e0cfe0" }} />
        </div>

        {serverError && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            padding: "10px 14px", borderRadius: 10, marginBottom: 16,
            background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13,
          }}>
            <svg width={16} height={16} fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: 1 }}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="First Name"  name="firstName"  placeholder="Rahul"  value={formData.firstName}  onChange={handleChange} error={errors.firstName} />
              <Field label="Last Name"   name="lastName"   placeholder="Sharma" value={formData.lastName}   onChange={handleChange} error={errors.lastName} />
            </div>

            <Field label="Email Address" name="email"     type="email" placeholder="rahul@example.com"  value={formData.email}     onChange={handleChange} error={errors.email} />
            <Field label="Phone Number"  name="contactNo" type="tel"   placeholder="+91 98765 43210"    value={formData.contactNo} onChange={handleChange} error={errors.contactNo} />
            <Field label="Address"       name="address"               placeholder="123, MG Road"        value={formData.address}   onChange={handleChange} error={errors.address} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="City"  name="city"  placeholder="Gwalior"           value={formData.city}  onChange={handleChange} error={errors.city} />
              <Field label="State" name="state" placeholder="Madhya Pradesh"    value={formData.state} onChange={handleChange} error={errors.state} />
            </div>

            <PasswordField label="Password"         name="password"        placeholder="••••••••" value={formData.password}        onChange={handleChange} error={errors.password} />
            <PasswordField label="Confirm Password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 10,
                fontWeight: 600, fontSize: 14, color: "#fff", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? `${PrimaryPurple}88` : `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})`,
                boxShadow: loading ? "none" : `0 4px 20px ${PrimaryPurple}44`,
                transition: "all 0.2s", fontFamily: "inherit", marginTop: 4,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{
                    width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Creating account…
                </span>
              ) : "Create Account"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#9b7d99", marginTop: 16 }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, fontWeight: 600, fontSize: 13, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
            onMouseLeave={e => e.currentTarget.style.color = BLUE}
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );
}

// ── Step 2: OTP Verification ──────────────────────
function OTPStep({ email, onVerified }) {
  const [otp, setOtp]                     = useState(["", "", "", "", "", ""]);
  const [error, setError]                 = useState("");
  const [success, setSuccess]             = useState("");
  const [loading, setLoading]             = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) { setError("Enter all 6 digits."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Verification failed."); return; }
      setSuccess("Email verified! Redirecting…");
      setTimeout(() => onVerified(data.token), 1200);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Failed to resend OTP."); return; }
      setSuccess("New OTP sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
      }, 1000);
    } catch { setError("Network error. Please try again."); }
    finally { setResendLoading(false); }
  };

  const otpFilled = otp.join("").length === 6;

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: 16, marginBottom: 12,
          background: `linear-gradient(135deg, #2d8a0f, ${GREEN})`,
        }}>
          <svg width={28} height={28} fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a0019", margin: 0 }}>Check your inbox</h1>
        <p style={{ fontSize: 14, color: "#7a4e77", marginTop: 4 }}>We sent a 6-digit code to</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: BLUE, marginTop: 2 }}>{email}</p>
      </div>

      <div style={{
        background: "#fff", border: `1px solid ${PrimaryPurple}22`,
        borderRadius: 20, padding: "28px",
        boxShadow: "0 4px 32px rgba(142,19,135,0.07)",
      }}>
        {/* OTP boxes */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 48, height: 56, textAlign: "center",
                fontSize: 22, fontWeight: 700, color: "#1a0019",
                borderRadius: 10, outline: "none",
                background: digit ? `${PrimaryPurple}0f` : "#f9f5fa",
                border: `2px solid ${digit ? PrimaryPurple : "#e0cfe0"}`,
                boxShadow: digit ? `0 0 0 3px ${PrimaryPurple}18` : "none",
                transition: "all 0.15s", fontFamily: "ui-monospace, monospace",
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 10, marginBottom: 14,
            background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13,
          }}>
            <svg width={16} height={16} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", borderRadius: 10, marginBottom: 14,
            background: "#f0fdf4", border: `1px solid ${GREEN}44`, color: "#15803d", fontSize: 13,
          }}>
            <svg width={16} height={16} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            {success}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || !otpFilled}
          style={{
            width: "100%", padding: "12px", borderRadius: 10,
            fontWeight: 600, fontSize: 14, color: "#fff", border: "none",
            cursor: !otpFilled || loading ? "not-allowed" : "pointer",
            background: !otpFilled || loading
              ? `${GREEN}55`
              : `linear-gradient(135deg, #2d8a0f, ${GREEN})`,
            boxShadow: otpFilled && !loading ? `0 4px 20px ${GREEN}44` : "none",
            transition: "all 0.2s", fontFamily: "inherit",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{
                width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)",
                borderTopColor: "#fff", borderRadius: "50%",
                display: "inline-block", animation: "spin 0.7s linear infinite",
              }} />
              Verifying…
            </span>
          ) : "Verify Email"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#9b7d99", marginTop: 16 }}>
          Didn't receive it?{" "}
          {resendCooldown > 0 ? (
            <span style={{ color: "#b097af" }}>Resend in {resendCooldown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, fontWeight: 600, fontSize: 13, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = "#7dd3fc"}
              onMouseLeave={e => e.currentTarget.style.color = BLUE}
            >
              {resendLoading ? "Sending…" : "Resend OTP"}
            </button>
          )}
        </p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#c4adc2", marginTop: 8 }}>
          Code expires in 10 minutes
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ── Main SignUp component ─────────────────────────
export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep]   = useState("register");
  const [email, setEmail] = useState("");

  const handleRegistrationSuccess = (userEmail) => {
    setEmail(userEmail);
    setStep("otp");
  };

  const handleVerified = (token) => {
    localStorage.setItem("token", token);
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 16px",
      background: "linear-gradient(160deg, #fdf4ff 0%, #f0f9ff 50%, #f9fafb 100%)",
      fontFamily: "'Inter', 'DM Sans', sans-serif",
    }}>
      {/* Soft ambient blobs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "-10%", width: 360, height: 360, borderRadius: "50%", background: DarkPurple, opacity: 0.07, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "-8%", width: 300, height: 300, borderRadius: "50%", background: GREEN, opacity: 0.06, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "60%", left: "40%", width: 240, height: 240, borderRadius: "50%", background: BLUE, opacity: 0.06, filter: "blur(70px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460 }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {["register", "otp"].map((s, i) => {
            const done    = (i === 0 && step === "otp");
            const active  = step === s;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                  background: active || done ? `linear-gradient(135deg, ${DarkPurple}, ${PrimaryPurple})` : "#e5d5e4",
                  color: active || done ? "#fff" : "#9b7d99",
                  boxShadow: active ? `0 0 12px ${PrimaryPurple}55` : "none",
                }}>
                  {done ? (
                    <svg width={13} height={13} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : i + 1}
                </div>
                {i < 1 && (
                  <div style={{
                    width: 48, height: 2, borderRadius: 1, transition: "background 0.3s",
                    background: step === "otp" ? PrimaryPurple : "#e5d5e4",
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {step === "register"
          ? <RegistrationStep onSuccess={handleRegistrationSuccess} />
          : <OTPStep email={email} onVerified={handleVerified} />
        }
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}