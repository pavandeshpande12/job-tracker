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

type ReflectionItem = { company: string; role: string; text: string };

function ReflectionColumn({ title, icon, color, items }: {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: ReflectionItem[];
}) {
  if (items.length === 0) {
    return (
      <div style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 20, borderTop: `2px solid ${color}20` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          {icon}
          <span style={{ fontSize: 13, fontWeight: 600, color }}>{title}</span>
        </div>
        <p style={{ color: "#333333", fontSize: 12, fontStyle: "italic" }}>
          No entries yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 20, borderTop: `2px solid ${color}20` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          <span style={{ fontSize: 13, fontWeight: 600, color }}>{title}</span>
        </div>
        <span style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 4,
          background: `${color}10`,
          color,
          fontWeight: 600,
        }}>
          {items.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            padding: "10px 12px",
            background: "#141414",
            border: "1px solid #1e1e1e",
            borderRadius: 8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color }}>{item.company}</span>
              <span style={{ fontSize: 11, color: "#404040" }}>{item.role}</span>
            </div>
            <p style={{ color: "#a1a1a1", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReflectionSummary({ refreshKey }: Props) {
  const [jobs, setJobs] = useState<JobType[]>([]);

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

  if (jobs.length === 0 || jobsWithReflection.length === 0) return null;

  const strengths = jobsWithReflection
    .filter((j) => j.feedback?.whatWentWell)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.whatWentWell! }));

  const improvements = jobsWithReflection
    .filter((j) => j.feedback?.whatDidntGoWell)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.whatDidntGoWell! }));

  const lessons = jobsWithReflection
    .filter((j) => j.feedback?.lessonsLearned)
    .map((j) => ({ company: j.company, role: j.role, text: j.feedback!.lessonsLearned! }));

  return (
    <section style={{ marginTop: 48, paddingTop: 48, borderTop: "1px solid #1e1e1e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>Reflection Insights</h3>
        <span style={{ color: "#404040", fontSize: 12, marginLeft: "auto" }}>
          {jobsWithReflection.length} of {jobs.length} reflected
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReflectionColumn
          title="What Went Well"
          color="#4ade80"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          items={strengths}
        />
        <ReflectionColumn
          title="To Improve"
          color="#f87171"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
          items={improvements}
        />
        <ReflectionColumn
          title="Lessons Learned"
          color="#fbbf24"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          }
          items={lessons}
        />
      </div>
    </section>
  );
}
