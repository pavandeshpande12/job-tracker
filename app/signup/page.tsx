"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccess("Account created! Redirecting to login...");
    setTimeout(() => router.push("/login"), 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    background: "#141414",
    border: "1px solid #262626",
    borderRadius: 8,
    color: "#fafafa",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                style={{
                  width: 40,
                  height: 40,
                  background: "#fafafa",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </motion.div>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#fafafa", letterSpacing: "-0.5px" }}>
                Job Tracker
              </span>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{ textAlign: "center", marginBottom: 32 }}
          >
            <h1 style={{ fontSize: 24, fontWeight: 600, color: "#fafafa", marginBottom: 8 }}>
              Create an account
            </h1>
            <p style={{ color: "#737373", fontSize: 14 }}>
              Start tracking your job applications
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: "#111111",
              border: "1px solid #1e1e1e",
              borderRadius: 12,
              padding: 32,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#a1a1a1", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#404040"}
                  onBlur={(e) => e.target.style.borderColor = "#262626"}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: "#a1a1a1", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#404040"}
                  onBlur={(e) => e.target.style.borderColor = "#262626"}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#a1a1a1", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#404040"}
                  onBlur={(e) => e.target.style.borderColor = "#262626"}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: 8,
                    marginBottom: 20
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="#f87171" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 12,
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: 8,
                    marginBottom: 20
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p style={{ color: "#4ade80", fontSize: 13 }}>{success}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 48,
                  background: "#fafafa",
                  border: "none",
                  borderRadius: 8,
                  color: "#0a0a0a",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: "2px solid #d4d4d4", borderTopColor: "#0a0a0a", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div style={{ borderTop: "1px solid #1e1e1e", marginTop: 28, paddingTop: 20 }}>
              <p style={{ textAlign: "center", color: "#737373", fontSize: 13 }}>
                Already have an account?{" "}
                <a href="/login" style={{ color: "#fafafa", fontWeight: 500, textDecoration: "none" }}>
                  Sign in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <footer style={{ padding: "20px", textAlign: "center" }}>
        <p style={{ color: "#404040", fontSize: 12 }}>
          © {new Date().getFullYear()} Job Tracker · Built by <span style={{ color: "#525252", fontWeight: 500 }}>Pavan Deshpande</span>
        </p>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
