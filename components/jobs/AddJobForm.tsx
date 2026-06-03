"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AutocompleteTextarea from "@/components/ui/AutocompleteTextarea";

interface Props {
  refreshJobs: () => void;
}

export default function AddJobForm({ refreshJobs }: Props) {
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
    }

    setLoading(false);
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

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: "auto",
    minHeight: 100,
    padding: "14px 18px",
    resize: "vertical" as const,
    fontFamily: "inherit",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
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
            onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
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
            onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
          />
        </div>
      </div>

      {/* Row 2: Status and Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginTop: 28 }}>
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
          {!showReflectionFields && (
            <p style={{
              marginTop: 8,
              fontSize: 11,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
          />
        </div>

        <div>
          <label style={labelStyle}>Rejected Date (optional)</label>
          <input
            type="date"
            style={{ ...inputStyle, colorScheme: "dark" }}
            value={rejectedDate}
            onChange={(e) => setRejectedDate(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#06b6d4"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
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
          onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"}
        />
      </div>

      {/* Interview Experience & Reflection — shown only for Interview/Offer/Rejected */}
      {showReflectionFields && (
        <>
          {/* Reveal banner */}
          <div style={{
            marginTop: 36,
            padding: "12px 18px",
            background: "rgba(129, 140, 248, 0.08)",
            border: "1px solid rgba(129, 140, 248, 0.2)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: 13, color: "#a5b4fc" }}>
              Reflection fields unlocked! Record your interview experience and learnings below.
            </span>
          </div>

          {/* Interview Experience */}
          <div style={{ marginTop: 24 }}>
            <div style={sectionHeaderStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h4 style={{ color: "#ffffff", fontSize: 16, fontWeight: 600 }}>Interview Experience (optional)</h4>
            </div>
            <AutocompleteTextarea
              fieldType="interviewExperience"
              value={interviewExperience}
              onChange={setInterviewExperience}
              placeholder="Describe your interview experience — rounds, questions asked, format, difficulty level..."
              style={textareaStyle}
              focusBorderColor="#818cf8"
            />
          </div>

          {/* Self-Reflection / Feedback */}
          <div style={{ marginTop: 40 }}>
            <div style={sectionHeaderStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h4 style={{ color: "#ffffff", fontSize: 16, fontWeight: 600 }}>Self-Reflection (optional)</h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <label style={{ ...labelStyle, color: "#86efac" }}>What went well?</label>
                <AutocompleteTextarea
                  fieldType="whatWentWell"
                  value={whatWentWell}
                  onChange={setWhatWentWell}
                  placeholder="Things that went well during the process..."
                  style={{ ...textareaStyle, minHeight: 80 }}
                  focusBorderColor="#34d399"
                />
              </div>
              <div>
                <label style={{ ...labelStyle, color: "#fca5a5" }}>What didn&apos;t go well?</label>
                <AutocompleteTextarea
                  fieldType="whatDidntGoWell"
                  value={whatDidntGoWell}
                  onChange={setWhatDidntGoWell}
                  placeholder="Areas where you struggled or felt unprepared..."
                  style={{ ...textareaStyle, minHeight: 80 }}
                  focusBorderColor="#fb7185"
                />
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <label style={{ ...labelStyle, color: "#fde68a" }}>Lessons learned</label>
              <AutocompleteTextarea
                fieldType="lessonsLearned"
                value={lessonsLearned}
                onChange={setLessonsLearned}
                placeholder="Key takeaways, things to improve for next time..."
                style={{ ...textareaStyle, minHeight: 80 }}
                focusBorderColor="#fbbf24"
              />
            </div>
          </div>
        </>
      )}

      {/* Submit Button */}
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
