"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type JobType = {
  _id: string;
  company: string;
  role: string;
  status: string;
  appliedDate?: string;
  rejectedDate?: string;
  notes?: string;
};

const STATUS_DOT: Record<string, string> = {
  Applied: "#737373",
  "Online Test": "#a78bfa",
  Interview: "#60a5fa",
  Offer: "#4ade80",
  Rejected: "#f87171",
};

const STATUS_BG: Record<string, string> = {
  Applied: "rgba(115, 115, 115, 0.1)",
  "Online Test": "rgba(167, 139, 250, 0.1)",
  Interview: "rgba(96, 165, 250, 0.1)",
  Offer: "rgba(74, 222, 128, 0.1)",
  Rejected: "rgba(248, 113, 113, 0.1)",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

interface Props {
  refreshKey?: string;
}

export default function Timeline({ refreshKey }: Props) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
      } catch {
        // fetch failed silently
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [refreshKey]);

  if (loading) {
    return (
      <section style={{ marginTop: 48, paddingTop: 48, borderTop: "1px solid #1e1e1e" }}>
        <div className="skeleton" style={{ width: 140, height: 18, borderRadius: 4, marginBottom: 24 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingLeft: 24 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="skeleton" style={{ width: 10, height: 10, borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: 180, height: 14, borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: 120, height: 12, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const jobsWithDates = jobs.filter((j) => j.appliedDate);
  if (jobsWithDates.length === 0) return null;

  const sorted = [...jobsWithDates].sort(
    (a, b) => new Date(b.appliedDate!).getTime() - new Date(a.appliedDate!).getTime()
  );

  const grouped: { month: string; jobs: JobType[] }[] = [];
  sorted.forEach((job) => {
    const month = formatMonth(job.appliedDate!);
    const existing = grouped.find((g) => g.month === month);
    if (existing) {
      existing.jobs.push(job);
    } else {
      grouped.push({ month, jobs: [job] });
    }
  });

  return (
    <section style={{ marginTop: 48, paddingTop: 48, borderTop: "1px solid #1e1e1e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>Application Timeline</h3>
        <span style={{ color: "#404040", fontSize: 12, marginLeft: "auto" }}>
          {jobsWithDates.length} tracked
        </span>
      </div>

      <div style={{ position: "relative" }}>
        {grouped.map((group, gi) => (
          <div key={group.month} style={{ marginBottom: gi < grouped.length - 1 ? 32 : 0 }}>
            {/* Month label */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: gi * 0.1 }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#525252",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: 16,
                paddingLeft: 28,
              }}
            >
              {group.month}
            </motion.div>

            {/* Timeline entries */}
            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: 9,
                  top: 6,
                  bottom: group.jobs.length > 1 ? 6 : 6,
                  width: 1,
                  background: "#1e1e1e",
                }}
              />

              {group.jobs.map((job, ji) => {
                const dotColor = STATUS_DOT[job.status] || "#737373";
                const bgColor = STATUS_BG[job.status] || "rgba(115, 115, 115, 0.1)";
                const delay = gi * 0.1 + ji * 0.06;

                return (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      marginBottom: ji < group.jobs.length - 1 ? 12 : 0,
                      position: "relative",
                    }}
                  >
                    {/* Dot */}
                    <div
                      style={{
                        width: 19,
                        height: 19,
                        borderRadius: "50%",
                        background: "#0a0a0a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: dotColor,
                          boxShadow: `0 0 8px ${dotColor}40`,
                        }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      style={{
                        flex: 1,
                        background: "#111111",
                        border: "1px solid #1e1e1e",
                        borderRadius: 8,
                        padding: "12px 16px",
                        transition: "border-color 0.15s",
                        cursor: "default",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: "#fafafa", fontSize: 14, marginBottom: 2 }}>
                            {job.company}
                          </p>
                          <p style={{ color: "#737373", fontSize: 13 }}>
                            {job.role}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: bgColor,
                              color: dotColor,
                            }}
                          >
                            {job.status}
                          </span>
                          <span style={{ fontSize: 12, color: "#404040" }}>
                            {formatDate(job.appliedDate!)}
                          </span>
                        </div>
                      </div>
                      {job.notes && (
                        <p style={{ color: "#525252", fontSize: 12, marginTop: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {job.notes}
                        </p>
                      )}
                      {job.status === "Rejected" && job.rejectedDate && (
                        <p style={{ color: "#525252", fontSize: 11, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ color: "#f87171" }}>Rejected</span> {formatDate(job.rejectedDate)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
