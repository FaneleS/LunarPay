import { useState } from "react";
import { supabase } from "../lib/supabase.js";

const C = {
  pageBg: "#F5F2EA", surface: "#EDE8DC", card: "#FDFAF4", cardBorder: "#D8D4C8",
  olive: "#656D4A", forest: "#3A4232", sage: "#C2C5AA", sageMid: "#A4AC86",
  ink: "#333D29", wheat: "#C4B470", terra: "#936639", muted: "#7F7455",
  danger: "#8B3A1E", dangerBg: "#F5EDE8", active: "#2D6B45", activeBg: "#EDF5F0",
};
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const OrbitalLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="9" stroke="#656D4A" strokeWidth="1.4" />
    <circle cx="14" cy="14" r="4" fill="#C4B470" />
    <circle cx="23" cy="7" r="2.2" fill="#656D4A" />
  </svg>
);

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => { setError(""); setMessage(""); };

  const handleSignIn = async () => {
    if (!email || !password) return setError("Please enter your email and password.");
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    onAuth(data.session);
  };

  const handleSignUp = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    setMessage("Account created! Check your email to confirm, then sign in.");
    setMode("signin");
  };

  const handleForgot = async () => {
    if (!email) return setError("Please enter your email address.");
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) return setError(error.message);
    setMessage("Password reset email sent. Check your inbox.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (mode === "signin") handleSignIn();
      else if (mode === "signup") handleSignUp();
      else handleForgot();
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F5F2EA", display: "flex",
      backgroundImage: "radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)",
      backgroundSize: "16px 16px", fontFamily: FONT_BODY,
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: 480, background: C.forest, display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "48px 52px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <OrbitalLogo size={32} />
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: "#E8E4D8", letterSpacing: "-0.02em" }}>LunarPay</span>
        </div>

        <div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 36, fontWeight: 700, color: "#E8E4D8", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Payroll that works<br />as hard as you do.
          </h1>
          <p style={{ fontSize: 15, color: C.sageMid, lineHeight: 1.7, marginBottom: 40 }}>
            Manage employees, process payroll, handle leave and stay SARS-compliant — all in one place.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["ti-users", "Multi-company support"],
              ["ti-calendar-event", "Leave management & BCEA compliance"],
              ["ti-chart-bar", "Reports across all your companies"],
              ["ti-shield-check", "Secure, isolated company data"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(194,197,170,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15, color: C.sage }} />
                </div>
                <span style={{ fontSize: 13, color: C.sageMid }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 11, color: C.sageMid, opacity: 0.6 }}>
          © {new Date().getFullYear()} LunarPay. Built for South African payroll.
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
            </h2>
            <p style={{ fontSize: 14, color: C.muted }}>
              {mode === "signin" ? "Sign in to your LunarPay account" :
               mode === "signup" ? "Get started with LunarPay today" :
               "We'll send you a reset link"}
            </p>
          </div>

          {/* Success message */}
          {message && (
            <div style={{ background: C.activeBg, border: `1px solid rgba(45,107,69,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.active, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-check" aria-hidden="true" />
              {message}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{ background: C.dangerBg, border: `1px solid rgba(139,58,30,0.2)`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.danger, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="ti ti-alert-circle" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); reset(); }}
                onKeyDown={handleKeyDown}
                placeholder="you@company.co.za"
                style={{ background: C.card, border: `1px solid ${error ? "rgba(139,58,30,0.4)" : C.cardBorder}`, color: C.ink, borderRadius: 10, padding: "12px 16px", fontSize: 14, width: "100%", fontFamily: FONT_BODY, outline: "none", transition: "border-color 0.15s", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = C.olive}
                onBlur={e => e.target.style.borderColor = C.cardBorder}
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); reset(); }}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 10, padding: "12px 46px 12px 16px", fontSize: 14, width: "100%", fontFamily: FONT_BODY, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = C.olive}
                    onBlur={e => e.target.style.borderColor = C.cardBorder}
                  />
                  <button
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16, padding: 0 }}>
                    <i className={`ti ti-eye${showPassword ? "-off" : ""}`} aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); reset(); }}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  style={{ background: C.card, border: `1px solid ${C.cardBorder}`, color: C.ink, borderRadius: 10, padding: "12px 16px", fontSize: 14, width: "100%", fontFamily: FONT_BODY, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = C.olive}
                  onBlur={e => e.target.style.borderColor = C.cardBorder}
                />
              </div>
            )}

            {mode === "signin" && (
              <div style={{ textAlign: "right", marginTop: -6 }}>
                <button onClick={() => { setMode("forgot"); reset(); }} style={{ background: "none", border: "none", color: C.olive, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}>
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={mode === "signin" ? handleSignIn : mode === "signup" ? handleSignUp : handleForgot}
              disabled={loading}
              style={{
                background: loading ? C.sage : C.olive, color: "#F5F2EA", border: "none",
                borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600,
                fontFamily: FONT_BODY, cursor: loading ? "not-allowed" : "pointer",
                marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.15s",
              }}>
              {loading
                ? <><i className="ti ti-loader-2" aria-hidden="true" style={{ animation: "spin 1s linear infinite" }} /> Processing…</>
                : mode === "signin" ? "Sign in"
                : mode === "signup" ? "Create account"
                : "Send reset link"}
            </button>
          </div>

          {/* Mode switcher */}
          <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: C.muted }}>
            {mode === "signin" && <>
              Don't have an account?{" "}
              <button onClick={() => { setMode("signup"); reset(); }} style={{ background: "none", border: "none", color: C.olive, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>
                Sign up
              </button>
            </>}
            {mode === "signup" && <>
              Already have an account?{" "}
              <button onClick={() => { setMode("signin"); reset(); }} style={{ background: "none", border: "none", color: C.olive, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>
                Sign in
              </button>
            </>}
            {mode === "forgot" && <>
              Remember your password?{" "}
              <button onClick={() => { setMode("signin"); reset(); }} style={{ background: "none", border: "none", color: C.olive, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>
                Sign in
              </button>
            </>}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}