"use client";

import { useEffect, useState } from "react";
import AutocompleteTextarea from "@/components/ui/AutocompleteTextarea";

interface Props {
  refreshJobs?: () => void;
}

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
  appliedDate?: string;
  rejectedDate?: string;
  notes?: string;
  interviewExperience?: string;
  feedback?: FeedbackType;
};

const getStatusStyle = (status: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  };
  switch (status) {
    case "Applied":
      return { ...base, background: "rgba(71, 85, 105, 0.4)", color: "#cbd5e1" };
    case "Online Test":
      return { ...base, background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc" };
    case "Interview":
      return { ...base, background: "rgba(59, 130, 246, 0.2)", color: "#93c5fd" };
    case "Offer":
      return { ...base, background: "rgba(34, 197, 94, 0.2)", color: "#86efac" };
    case "Rejected":
      return { ...base, background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" };
    default:
      return { ...base, background: "rgba(71, 85, 105, 0.4)", color: "#cbd5e1" };
  }
};

const hasFeedback = (fb?: FeedbackType) =>
  fb && (fb.whatWentWell || fb.whatDidntGoWell || fb.lessonsLearned);

const hasDetails = (job: JobType) =>
  job.interviewExperience || hasFeedback(job.feedback);

export default function JobList({ refreshJobs }: Props) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobType | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");
  const [editDate, setEditDate] = useState("");
  const [editRejectedDate, setEditRejectedDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editInterviewExp, setEditInterviewExp] = useState("");
  const [editWhatWentWell, setEditWhatWentWell] = useState("");
  const [editWhatDidntGoWell, setEditWhatDidntGoWell] = useState("");
  const [editLessonsLearned, setEditLessonsLearned] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (res.ok) setJobs(data.jobs);
    } catch {
      // fetch failed silently
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    try {
      const res = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchJobs();
        if (refreshJobs) refreshJobs();
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };

  const formatDateInput = (dateStr: string) =>
    new Date(dateStr).toISOString().slice(0, 10);

  const handleEditClick = (job: JobType) => {
    setEditingJob(job);
    setEditCompany(job.company);
    setEditRole(job.role);
    setEditStatus(job.status);
    setEditDate(job.appliedDate ? formatDateInput(job.appliedDate) : "");
    setEditRejectedDate(job.rejectedDate ? formatDateInput(job.rejectedDate) : "");
    setEditNotes(job.notes || "");
    setEditInterviewExp(job.interviewExperience || "");
    setEditWhatWentWell(job.feedback?.whatWentWell || "");
    setEditWhatDidntGoWell(job.feedback?.whatDidntGoWell || "");
    setEditLessonsLearned(job.feedback?.lessonsLearned || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    setSaving(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingJob._id,
          company: editCompany,
          role: editRole,
          status: editStatus,
          appliedDate: editDate || undefined,
          rejectedDate: editRejectedDate || undefined,
          notes: editNotes,
          interviewExperience: editInterviewExp,
          feedback: {
            whatWentWell: editWhatWentWell,
            whatDidntGoWell: editWhatDidntGoWell,
            lessonsLearned: editLessonsLearned,
          },
        }),
      });

      if (res.ok) {
        setEditingJob(null);
        await fetchJobs();
        if (refreshJobs) refreshJobs();
      }
    } catch (err) {
      console.error(err);
      alert("Error updating job");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshJobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ? true : job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showEditReflection = ["Interview", "Offer", "Rejected"].includes(editStatus);

  const inputStyle: React.CSSProperties = {
    height: 44,
    padding: "0 14px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
  };

  const textareaEditStyle: React.CSSProperties = {
    ...inputStyle,
    height: "auto",
    minHeight: 70,
    padding: "10px 14px",
    resize: "vertical" as const,
    fontFamily: "inherit",
    width: "100%",
  };

  const buttonStyle: React.CSSProperties = {
    height: 34,
    padding: "0 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  };

  return (
    <div>
      {/* Header with title and filters */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginBottom: 6 }}>Your Applications</h3>
            <p style={{ fontSize: 14, color: "#64748b" }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? "application" : "applications"} found
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <svg width="18" height="18" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} fill="none" stroke="#64748b" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                style={{ ...inputStyle, width: 300, paddingLeft: 44 }}
                placeholder="Search company or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              style={{ ...inputStyle, width: 180, cursor: "pointer" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All" style={{ background: "#0f172a" }}>All Status</option>
              <option value="Applied" style={{ background: "#0f172a" }}>Applied</option>
              <option value="Online Test" style={{ background: "#0f172a" }}>Online Test</option>
              <option value="Interview" style={{ background: "#0f172a" }}>Interview</option>
              <option value="Offer" style={{ background: "#0f172a" }}>Offer</option>
              <option value="Rejected" style={{ background: "#0f172a" }}>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center", borderRadius: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <p style={{ color: "#ffffff", fontWeight: 600, fontSize: 16 }}>No applications yet</p>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Add your first job application above!</p>
        </div>
      ) : (
        <>
          <div className="glass-card" style={{ borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Company</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Role</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Status</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Applied</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Extras</th>
                  <th style={{ textAlign: "right", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <JobRow
                    key={job._id}
                    job={job}
                    index={index}
                    isExpanded={expandedId === job._id}
                    onToggleExpand={() => setExpandedId(expandedId === job._id ? null : job._id)}
                    onEdit={() => handleEditClick(job)}
                    onDelete={() => handleDelete(job._id)}
                    buttonStyle={buttonStyle}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Panel */}
          {editingJob && (
            <div style={{ marginTop: 24, padding: 28, background: "#1e293b", border: "2px solid #06b6d4", borderRadius: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#22d3ee", marginBottom: 20 }}>Editing: {editingJob.company} — {editingJob.role}</p>

              <form onSubmit={handleUpdate}>
                {/* Basic fields */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input style={inputStyle} value={editCompany} onChange={(e) => setEditCompany(e.target.value)} required placeholder="Company" />
                  <input style={inputStyle} value={editRole} onChange={(e) => setEditRole(e.target.value)} required placeholder="Role" />
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    <option value="Applied" style={{ background: "#0f172a" }}>Applied</option>
                    <option value="Online Test" style={{ background: "#0f172a" }}>Online Test</option>
                    <option value="Interview" style={{ background: "#0f172a" }}>Interview</option>
                    <option value="Offer" style={{ background: "#0f172a" }}>Offer</option>
                    <option value="Rejected" style={{ background: "#0f172a" }}>Rejected</option>
                  </select>
                  <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={editDate} onChange={(e) => setEditDate(e.target.value)} title="Applied Date" />
                  <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={editRejectedDate} onChange={(e) => setEditRejectedDate(e.target.value)} title="Rejected Date" />
                  <input style={inputStyle} placeholder="Notes (optional)" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                </div>

                {!showEditReflection && (
                  <p style={{
                    marginTop: 12,
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
                    Set status to Interview, Offer, or Rejected to add reflections
                  </p>
                )}

                {/* Interview Experience & Reflection — shown only for Interview/Offer/Rejected */}
                {showEditReflection && (
                  <>
                    <div style={{
                      marginTop: 16,
                      padding: "10px 14px",
                      background: "rgba(129, 140, 248, 0.08)",
                      border: "1px solid rgba(129, 140, 248, 0.2)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      <span style={{ fontSize: 12, color: "#a5b4fc" }}>
                        Reflection fields unlocked! Click a field and use the quick-pick chips to speed things up.
                      </span>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <label style={{ display: "block", color: "#818cf8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Interview Experience</label>
                      <AutocompleteTextarea
                        fieldType="interviewExperience"
                        value={editInterviewExp}
                        onChange={setEditInterviewExp}
                        placeholder="Describe your interview experience..."
                        style={textareaEditStyle}
                        focusBorderColor="#818cf8"
                      />
                    </div>

                    <div style={{ marginTop: 20 }}>
                      <label style={{ display: "block", color: "#34d399", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Self-Reflection</label>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 8 }}>
                        <AutocompleteTextarea
                          fieldType="whatWentWell"
                          value={editWhatWentWell}
                          onChange={setEditWhatWentWell}
                          placeholder="What went well?"
                          style={textareaEditStyle}
                          focusBorderColor="#34d399"
                        />
                        <AutocompleteTextarea
                          fieldType="whatDidntGoWell"
                          value={editWhatDidntGoWell}
                          onChange={setEditWhatDidntGoWell}
                          placeholder="What didn't go well?"
                          style={textareaEditStyle}
                          focusBorderColor="#fb7185"
                        />
                        <AutocompleteTextarea
                          fieldType="lessonsLearned"
                          value={editLessonsLearned}
                          onChange={setEditLessonsLearned}
                          placeholder="Lessons learned"
                          style={textareaEditStyle}
                          focusBorderColor="#fbbf24"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 mt-5 pt-5" style={{ borderTop: "1px solid #334155" }}>
                  <button
                    type="button"
                    style={{ ...buttonStyle, height: 40, padding: "0 20px", background: "#334155", border: "1px solid #475569", color: "#ffffff" }}
                    onClick={() => setEditingJob(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      ...buttonStyle,
                      height: 40,
                      padding: "0 24px",
                      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                      border: "none",
                      color: "#ffffff",
                      fontWeight: 600,
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Extracted row component ── */

function JobRow({
  job,
  index,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  buttonStyle,
}: {
  job: JobType;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  buttonStyle: React.CSSProperties;
}) {
  const detailsExist = hasDetails(job);

  const indicators: { color: string; label: string }[] = [];
  if (job.interviewExperience) indicators.push({ color: "#818cf8", label: "Interview" });
  if (hasFeedback(job.feedback)) indicators.push({ color: "#34d399", label: "Reflection" });

  return (
    <>
      <tr
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: isExpanded ? "rgba(6, 182, 212, 0.03)" : index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
        }}
        onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; }}
        onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)"; }}
      >
        <td style={{ padding: "18px 20px" }}>
          <span style={{ fontWeight: 600, color: "#ffffff" }}>{job.company}</span>
        </td>
        <td style={{ padding: "18px 20px", color: "#e2e8f0" }}>{job.role}</td>
        <td style={{ padding: "18px 20px" }}>
          <span style={getStatusStyle(job.status)}>{job.status}</span>
        </td>
        <td style={{ padding: "18px 20px", color: "#cbd5e1" }}>
          {job.appliedDate
            ? new Date(job.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "—"}
        </td>
        <td style={{ padding: "18px 20px" }}>
          {indicators.length > 0 ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {indicators.map((ind) => (
                <span
                  key={ind.label}
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: `${ind.color}15`,
                    color: ind.color,
                    border: `1px solid ${ind.color}30`,
                    fontWeight: 500,
                  }}
                >
                  {ind.label}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ color: "#475569", fontSize: 13 }}>—</span>
          )}
        </td>
        <td style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {detailsExist && (
              <button
                style={{
                  ...buttonStyle,
                  background: isExpanded ? "rgba(6, 182, 212, 0.15)" : "transparent",
                  border: isExpanded ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                  color: isExpanded ? "#22d3ee" : "#94a3b8",
                }}
                onClick={onToggleExpand}
              >
                {isExpanded ? "Collapse" : "Details"}
              </button>
            )}
            <button
              style={{ ...buttonStyle, background: "#334155", border: "1px solid #475569", color: "#ffffff" }}
              onClick={onEdit}
              onMouseOver={(e) => { e.currentTarget.style.background = "#475569"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#334155"; }}
            >
              Edit
            </button>
            <button
              style={{ ...buttonStyle, background: "#7f1d1d", border: "1px solid #991b1b", color: "#fecaca" }}
              onClick={onDelete}
              onMouseOver={(e) => { e.currentTarget.style.background = "#991b1b"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#7f1d1d"; }}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <div style={{
              padding: "24px 28px",
              background: "rgba(6, 182, 212, 0.02)",
              borderTop: "1px solid rgba(6, 182, 212, 0.1)",
              borderBottom: "1px solid rgba(6, 182, 212, 0.1)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>

                {/* Interview Experience */}
                <DetailCard
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  }
                  title="Interview Experience"
                  accentColor="#818cf8"
                >
                  {job.interviewExperience ? (
                    <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {job.interviewExperience}
                    </p>
                  ) : (
                    <p style={{ color: "#475569", fontSize: 13, fontStyle: "italic" }}>No interview experience recorded. Click Edit to add one.</p>
                  )}
                </DetailCard>

                {/* Self-Reflection */}
                <DetailCard
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  }
                  title="Self-Reflection"
                  accentColor="#34d399"
                >
                  {hasFeedback(job.feedback) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {job.feedback?.whatWentWell && (
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#86efac", textTransform: "uppercase", letterSpacing: 0.5 }}>What went well</span>
                          <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.whatWentWell}</p>
                        </div>
                      )}
                      {job.feedback?.whatDidntGoWell && (
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#fca5a5", textTransform: "uppercase", letterSpacing: 0.5 }}>What didn&apos;t go well</span>
                          <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.whatDidntGoWell}</p>
                        </div>
                      )}
                      {job.feedback?.lessonsLearned && (
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#fde68a", textTransform: "uppercase", letterSpacing: 0.5 }}>Lessons learned</span>
                          <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.lessonsLearned}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "#475569", fontSize: 13, fontStyle: "italic" }}>No reflection added yet. Click Edit to reflect on this application.</p>
                  )}
                </DetailCard>

              </div>

              {/* Notes & rejected date row */}
              {(job.notes || job.rejectedDate) && (
                <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {job.notes && (
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>Notes</span>
                      <p style={{ color: "#cbd5e1", fontSize: 14, marginTop: 4 }}>{job.notes}</p>
                    </div>
                  )}
                  {job.rejectedDate && (
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: 0.5 }}>Rejected</span>
                      <p style={{ color: "#fca5a5", fontSize: 14, marginTop: 4 }}>
                        {new Date(job.rejectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Small detail card ── */

function DetailCard({
  icon,
  title,
  accentColor,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.5)",
      border: `1px solid ${accentColor}20`,
      borderRadius: 12,
      padding: 18,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: accentColor }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
