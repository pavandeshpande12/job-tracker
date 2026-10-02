"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AutocompleteTextarea from "@/components/ui/AutocompleteTextarea";
import { useToast } from "@/components/ui/Toast";

interface Props {
  refreshJobs: () => void;
  onClose?: () => void;
}

export default function AddJobForm({ refreshJobs, onClose }: Props) {
  const { showToast } = useToast();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [rejectedDate, setRejectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [interviewExperience, setInterviewExperience] = useState("");
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatDidntGoWell, setWhatDidntGoWell] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [loading, setLoading] = useState(false);

  const showReflectionFields = ["Interview", "Offer", "Rejected"].includes(status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        role,
        status,
        appliedDate: appliedDate || undefined,
        rejectedDate: rejectedDate || undefined,
        notes,
        interviewExperience: showReflectionFields ? interviewExperience : "",
        feedback: showReflectionFields
          ? { whatWentWell, whatDidntGoWell, lessonsLearned }
          : {},
      }),
    });

    if (res.ok) {
      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedDate("");
      setRejectedDate("");
      setNotes("");
      setInterviewExperience("");
      setWhatWentWell("");
      setWhatDidntGoWell("");
      setLessonsLearned("");
      refreshJobs();
      showToast("Application added successfully");
      onClose?.();
    } else {
      showToast("Failed to add application", "error");
    }

    setLoading(false);
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

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: "auto",
    minHeight: 100,
    padding: "12px 16px",
    resize: "vertical" as const,
    fontFamily: "inherit",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#a1a1a1",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 8,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid #1e1e1e",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        <div>
          <label style={labelStyle}>Company</label>
          <input
            style={inputStyle}
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            onFocus={(e) => e.target.style.borderColor = "#404040"}
            onBlur={(e) => e.target.style.borderColor = "#262626"}
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
            onFocus={(e) => e.target.style.borderColor = "#404040"}
            onBlur={(e) => e.target.style.borderColor = "#262626"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mt-7">
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Applied" style={{ background: "#141414" }}>Applied</option>
            <option value="Online Test" style={{ background: "#141414" }}>Online Test</option>
            <option value="Interview" style={{ background: "#141414" }}>Interview</option>
            <option value="Offer" style={{ background: "#141414" }}>Offer</option>
            <option value="Rejected" style={{ background: "#141414" }}>Rejected</option>
          </select>
          {!showReflectionFields && (
            <p style={{
              marginTop: 8,
              fontSize: 11,
              color: "#404040",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Set to Interview, Offer, or Rejected to add reflections
            </p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Applied Date (optional)</label>
          <input
            type="date"
            style={{ ...inputStyle, colorScheme: "dark" }}
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#404040"}
            onBlur={(e) => e.target.style.borderColor = "#262626"}
          />
        </div>

        <div>
          <label style={labelStyle}>Rejected Date (optional)</label>
          <input
            type="date"
            style={{ ...inputStyle, colorScheme: "dark" }}
            value={rejectedDate}
            onChange={(e) => setRejectedDate(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#404040"}
            onBlur={(e) => e.target.style.borderColor = "#262626"}
          />
        </div>
      </div>

      <div className="mt-7">
        <label style={labelStyle}>Notes (optional)</label>
        <input
          style={inputStyle}
          placeholder="Additional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = "#404040"}
          onBlur={(e) => e.target.style.borderColor = "#262626"}
        />
      </div>

      {showReflectionFields && (
        <>
          <div style={{
            marginTop: 32,
            padding: "10px 16px",
            background: "rgba(167, 139, 250, 0.06)",
            border: "1px solid rgba(167, 139, 250, 0.15)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: 13, color: "#a78bfa" }}>
              Reflection fields unlocked
            </span>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={sectionHeaderStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h4 style={{ color: "#fafafa", fontSize: 14, fontWeight: 600 }}>Interview Experience (optional)</h4>
            </div>
            <AutocompleteTextarea
              fieldType="interviewExperience"
              value={interviewExperience}
              onChange={setInterviewExperience}
              placeholder="Describe your interview experience..."
              style={textareaStyle}
              focusBorderColor="#a78bfa"
            />
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={sectionHeaderStyle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h4 style={{ color: "#fafafa", fontSize: 14, fontWeight: 600 }}>Self-Reflection (optional)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div>
                <label style={{ ...labelStyle, color: "#4ade80" }}>What went well?</label>
                <AutocompleteTextarea
                  fieldType="whatWentWell"
                  value={whatWentWell}
                  onChange={setWhatWentWell}
                  placeholder="Things that went well..."
                  style={{ ...textareaStyle, minHeight: 80 }}
                  focusBorderColor="#4ade80"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, color: "#f87171" }}>What didn&apos;t go well?</label>
                <AutocompleteTextarea
                  fieldType="whatDidntGoWell"
                  value={whatDidntGoWell}
                  onChange={setWhatDidntGoWell}
                  placeholder="Areas to improve..."
                  style={{ ...textareaStyle, minHeight: 80 }}
                  focusBorderColor="#f87171"
                />
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <label style={{ ...labelStyle, color: "#fbbf24" }}>Lessons learned</label>
              <AutocompleteTextarea
                fieldType="lessonsLearned"
                value={lessonsLearned}
                onChange={setLessonsLearned}
                placeholder="Key takeaways..."
                style={{ ...textareaStyle, minHeight: 80 }}
                focusBorderColor="#fbbf24"
              />
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          disabled={loading}
          style={{
            height: 44,
            padding: "0 28px",
            background: "#fafafa",
            border: "none",
            borderRadius: 8,
            color: "#0a0a0a",
            fontWeight: 600,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#e5e5e5";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fafafa";
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span style={{ width: 16, height: 16, borderWidth: 2 }} className="border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
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
