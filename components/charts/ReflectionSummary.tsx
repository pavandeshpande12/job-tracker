"use client";

import { useEffect, useState } from "react";

type FeedbackType = {
  whatWentWell?: string;
  whatDidntGoWell?: string;
  lessonsLearned?: string;
};

type JobType = {
  _id: string;
  company: string;
  role: string;
  status: string;
  interviewExperience?: string;
  feedback?: FeedbackType;
};

interface Props {
  refreshKey?: string;
}

export default function ReflectionSummary({ refreshKey }: Props) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [activeTab, setActiveTab] = useState<"strengths" | "improve" | "lessons">("strengths");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
      } catch {
        // fetch failed silently
      }
    };
    fetchJobs();
  }, [refreshKey]);

  const jobsWithReflection = jobs.filter(
    (j) =>
      j.feedback?.whatWentWell ||
      j.feedback?.whatDidntGoWell ||
      j.feedback?.lessonsLearned
  );

  const jobsWithExperience = jobs.filter((j) => j.interviewExperience);

  const reflectionRate =
    jobs.length > 0
      ? Math.round((jobsWithReflection.length / jobs.length) * 100)
      : 0;

  const strengths = jobsWithReflection
    .filter((j) => j.feedback?.whatWentWell)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.whatWentWell! }));

  const improvements = jobsWithReflection
    .filter((j) => j.feedback?.whatDidntGoWell)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.whatDidntGoWell! }));

  const lessons = jobsWithReflection
    .filter((j) => j.feedback?.lessonsLearned)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.lessonsLearned! }));

  const tabData = {
    strengths: { items: strengths, color: "#34d399", label: "Strengths", emptyLabel: "what went well" },
    improve: { items: improvements, color: "#f87171", label: "To Improve", emptyLabel: "areas to improve" },
    lessons: { items: lessons, color: "#fbbf24", label: "Lessons", emptyLabel: "lessons learned" },
  };

  const current = tabData[activeTab];

  if (jobs.length === 0) return null;

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff" }}>Reflection Insights</h3>
        </div>
        <span style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
          Your growth journal
        </span>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="glass-card" style={{ borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#34d399" }}>{jobsWithReflection.length}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>Reflections Written</p>
        </div>
        <div className="glass-card" style={{ borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#818cf8" }}>{jobsWithExperience.length}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>Experiences Logged</p>
        </div>
        <div className="glass-card" style={{ borderRadius: 14, padding: "18px 20px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#06b6d4" }}>{reflectionRate}%</p>
          </div>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>Reflection Rate</p>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="glass-card" style={{ borderRadius: 16, overflow: "hidden" }}>
        {/* Tab Bar */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {(["strengths", "improve", "lessons"] as const).map((tab) => {
            const t = tabData[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  background: isActive ? `${t.color}10` : "transparent",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${t.color}` : "2px solid transparent",
                  color: isActive ? t.color : "#64748b",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {t.label}
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: isActive ? `${t.color}20` : "rgba(255,255,255,0.05)",
                    color: isActive ? t.color : "#475569",
                    fontWeight: 600,
                  }}
                >
                  {t.items.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "20px 24px", maxHeight: 320, overflowY: "auto" }}>
          {current.items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "#475569", fontSize: 14 }}>
                No {current.emptyLabel} recorded yet.
              </p>
              <p style={{ color: "#334155", fontSize: 13, marginTop: 4 }}>
                Add reflections to your job applications to see insights here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {current.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    borderLeft: `3px solid ${current.color}40`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: current.color }}>
                      {item.company}
                    </span>
                    <span style={{ fontSize: 11, color: "#475569" }}>
                      {item.role}
                    </span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
