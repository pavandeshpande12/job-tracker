"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    if (data.user) {
      localStorage.setItem("jat_user", JSON.stringify(data.user));
    }

    router.push("/dashboard");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    padding: "0 18px",
    background: "#1e293b",
    border: "1px solid #475569",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* Animated Background */}
      <div className="app-background">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="grid-overlay" />
        <div className="noise-overlay" />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Brand Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(6, 182, 212, 0.3)"
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span style={{
                fontSize: 32,
                fontWeight: 800,
                background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px"
              }}>
                Job Tracker
              </span>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 600, color: "#ffffff", marginBottom: 8 }}>
              Welcome back
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15 }}>
              Sign in to your account
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card" style={{
            borderRadius: 20,
            padding: 36
          }}>
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#e2e8f0", fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
                  onBlur={(e) => e.target.style.borderColor = "#475569"}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: "block", color: "#e2e8f0", fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
                  onBlur={(e) => e.target.style.borderColor = "#475569"}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 14,
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 10,
                  marginBottom: 24
                }}>
                  <svg width="18" height="18" fill="none" stroke="#f87171" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 52,
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  border: "none",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #334155", marginTop: 32, paddingTop: 24 }}>
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                Don&apos;t have an account?{" "}
                <a href="/signup" style={{ color: "#22d3ee", fontWeight: 500, textDecoration: "none" }}>
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "20px", textAlign: "center", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#475569", fontSize: 12 }}>
          © {new Date().getFullYear()} Job Tracker · Built by <span style={{ color: "#64748b", fontWeight: 500 }}>Pavan Deshpande</span>
        </p>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
