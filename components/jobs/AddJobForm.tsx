"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  userEmail: string;
  refreshJobs: () => void;
}

export default function AddJobForm({ userEmail, refreshJobs }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        company,
        role,
        status,
        appliedDate,
        notes,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedDate("");
      setNotes("");
      refreshJobs();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    padding: "0 18px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 15,
    outline: "none",
    transition: "all 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Row 1: Company and Role */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <label style={labelStyle}>Company</label>
          <input
            style={inputStyle}
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
            onBlur={(e) => e.target.style.borderColor = "#475569"}
          />
        </div>

        <div>
          <label style={labelStyle}>Role / Position</label>
          <input
            style={inputStyle}
            placeholder="Position title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
            onBlur={(e) => e.target.style.borderColor = "#475569"}
          />
        </div>
      </div>

      {/* Row 2: Status and Date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 28 }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Applied" style={{ background: "#0f172a" }}>Applied</option>
            <option value="Online Test" style={{ background: "#0f172a" }}>Online Test</option>
            <option value="Interview" style={{ background: "#0f172a" }}>Interview</option>
            <option value="Offer" style={{ background: "#0f172a" }}>Offer</option>
            <option value="Rejected" style={{ background: "#0f172a" }}>Rejected</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Applied Date</label>
          <input
            type="date"
            style={{ ...inputStyle, colorScheme: "dark" }}
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
            onBlur={(e) => e.target.style.borderColor = "#475569"}
          />
        </div>
      </div>

      {/* Row 3: Notes */}
      <div style={{ marginTop: 28 }}>
        <label style={labelStyle}>Notes (optional)</label>
        <input
          style={inputStyle}
            placeholder="Additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
          onBlur={(e) => e.target.style.borderColor = "#475569"}
        />
      </div>

      {/* Button */}
      <div style={{ marginTop: 36, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          disabled={loading}
          style={{
            height: 48,
            padding: "0 32px",
            background: "rgba(6, 182, 212, 0.15)",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            borderRadius: 12,
            color: "#22d3ee",
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "rgba(6, 182, 212, 0.25)";
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.6)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(6, 182, 212, 0.3)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(6, 182, 212, 0.15)";
            e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.4)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span style={{ width: 16, height: 16, borderWidth: 2 }} className="border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </span>
          ) : (
            "Add Application"
          )}
        </Button>
      </div>
    </form>
  );
}
