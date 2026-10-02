"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AutocompleteTextarea from "@/components/ui/AutocompleteTextarea";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { AnimatedTabs } from "@/components/ui/AnimatedTabs";
import { useToast } from "@/components/ui/Toast";

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

const STATUSES = ["Applied", "Online Test", "Interview", "Offer", "Rejected"] as const;

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Applied: { bg: "#171717", color: "#a1a1a1", border: "#2a2a2a" },
  "Online Test": { bg: "rgba(167, 139, 250, 0.1)", color: "#a78bfa", border: "rgba(167, 139, 250, 0.25)" },
  Interview: { bg: "rgba(96, 165, 250, 0.1)", color: "#60a5fa", border: "rgba(96, 165, 250, 0.25)" },
  Offer: { bg: "rgba(74, 222, 128, 0.1)", color: "#4ade80", border: "rgba(74, 222, 128, 0.25)" },
  Rejected: { bg: "rgba(248, 113, 113, 0.1)", color: "#f87171", border: "rgba(248, 113, 113, 0.25)" },
};

const getStatusStyle = (status: string): React.CSSProperties => {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Applied"];
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    background: c.bg,
    color: c.color,
  };
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

const hasFeedback = (fb?: FeedbackType) =>
  fb && (fb.whatWentWell || fb.whatDidntGoWell || fb.lessonsLearned);

const hasDetails = (job: JobType) =>
  job.interviewExperience || hasFeedback(job.feedback);

type SortKey = "date-desc" | "date-asc" | "company" | "status";

export default function JobList({ refreshJobs }: Props) {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [sortBy, setSortBy] = useState<SortKey>("date-desc");

  const [deleteTarget, setDeleteTarget] = useState<JobType | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      if (res.ok) {
        await fetchJobs();
        if (refreshJobs) refreshJobs();
        showToast("Application deleted");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting application", "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleQuickStatus = async (job: JobType, newStatus: string) => {
    try {
      const res = await fetch("/api/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job._id, status: newStatus }),
      });
      if (res.ok) {
        await fetchJobs();
        if (refreshJobs) refreshJobs();
        showToast(`Status updated to ${newStatus}`);
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Error updating status", "error");
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
        showToast("Application updated");
      } else {
        showToast("Failed to update application", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating application", "error");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshJobs]);

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "All" ? true : job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.appliedDate || 0).getTime() - new Date(a.appliedDate || 0).getTime();
        case "date-asc":
          return new Date(a.appliedDate || 0).getTime() - new Date(b.appliedDate || 0).getTime();
        case "company":
          return a.company.localeCompare(b.company);
        case "status": {
          const order = STATUSES as readonly string[];
          return order.indexOf(a.status) - order.indexOf(b.status);
        }
        default:
          return 0;
      }
    });

  const showEditReflection = ["Interview", "Offer", "Rejected"].includes(editStatus);

  const inputStyle: React.CSSProperties = {
    height: 42,
    padding: "0 14px",
    background: "#141414",
    border: "1px solid #262626",
    borderRadius: 8,
    color: "#fafafa",
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
    height: 32,
    padding: "0 12px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
  };

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 200, height: 24, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 140, height: 16, borderRadius: 4 }} />
        </div>
        <div style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: "16px 20px", borderTop: i > 0 ? "1px solid #1e1e1e" : undefined }}>
              <div className="skeleton" style={{ width: 120, height: 16, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: 160, height: 16, borderRadius: 4 }} />
              <div className="skeleton" style={{ width: 80, height: 24, borderRadius: 6 }} />
              <div className="skeleton" style={{ width: 70, height: 16, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statusCounts = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filterTabs = [
    { id: "All", label: "All", count: jobs.length },
    ...STATUSES.map((s) => ({ id: s, label: s, count: statusCounts[s] || 0 })),
  ];

  if (jobs.length === 0) {
    return (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa", marginBottom: 6 }}>Your Applications</h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            textAlign: "center",
            background: "#111111",
            border: "1px solid #1e1e1e",
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            style={{
              width: 64,
              height: 64,
              background: "#171717",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </motion.div>
          <p style={{ color: "#fafafa", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No applications yet</p>
          <p style={{ color: "#525252", fontSize: 13, maxWidth: 300, lineHeight: 1.6 }}>
            Start tracking your job search by adding your first application.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa", marginBottom: 4 }}>Your Applications</h3>
              <p style={{ fontSize: 13, color: "#525252" }}>
                {filteredJobs.length} {filteredJobs.length === 1 ? "application" : "applications"} found
              </p>
            </div>

            <select
              style={{ ...inputStyle, cursor: "pointer", height: 36, fontSize: 13 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
            >
              <option value="date-desc" style={{ background: "#141414" }}>Newest first</option>
              <option value="date-asc" style={{ background: "#141414" }}>Oldest first</option>
              <option value="company" style={{ background: "#141414" }}>Company A-Z</option>
              <option value="status" style={{ background: "#141414" }}>By status</option>
            </select>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <div style={{ overflowX: "auto", flex: 1, minWidth: 0 }}>
              <AnimatedTabs
                tabs={filterTabs}
                activeId={filterStatus}
                onChange={(id) => setFilterStatus(id)}
              />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <svg width="16" height="16" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} fill="none" stroke="#404040" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              style={{ ...inputStyle, width: "100%", paddingLeft: 40 }}
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center", background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p style={{ color: "#fafafa", fontWeight: 600, fontSize: 15 }}>No matching applications</p>
          <p style={{ color: "#525252", fontSize: 13, marginTop: 4 }}>Try adjusting your search or filter.</p>
        </motion.div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="job-table-desktop">
            <div className="table-scroll" style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                    <th style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Company</th>
                    <th style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Role</th>
                    <th style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Status</th>
                    <th style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Applied</th>
                    <th style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Notes</th>
                    <th style={{ textAlign: "right", padding: "12px 20px", fontWeight: 500, color: "#525252", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, index) => (
                    <JobRow
                      key={job._id}
                      job={job}
                      index={index}
                      total={filteredJobs.length}
                      isExpanded={expandedId === job._id}
                      onToggleExpand={() => setExpandedId(expandedId === job._id ? null : job._id)}
                      onEdit={() => handleEditClick(job)}
                      onDelete={() => setDeleteTarget(job)}
                      onQuickStatus={(status) => handleQuickStatus(job, status)}
                      buttonStyle={buttonStyle}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="job-cards-mobile">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job._id}
                job={job}
                index={index}
                onEdit={() => handleEditClick(job)}
                onDelete={() => setDeleteTarget(job)}
                onQuickStatus={(status) => handleQuickStatus(job, status)}
              />
            ))}
          </div>

          {/* Edit Modal */}
          <Modal
            isOpen={!!editingJob}
            onClose={() => setEditingJob(null)}
            title={editingJob ? `Edit: ${editingJob.company} — ${editingJob.role}` : "Edit Application"}
          >
            {editingJob && (
              <form onSubmit={handleUpdate}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <input style={inputStyle} value={editCompany} onChange={(e) => setEditCompany(e.target.value)} required placeholder="Company" />
                  <input style={inputStyle} value={editRole} onChange={(e) => setEditRole(e.target.value)} required placeholder="Role" />
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                    {STATUSES.map(s => (
                      <option key={s} value={s} style={{ background: "#141414" }}>{s}</option>
                    ))}
                  </select>
                  <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={editDate} onChange={(e) => setEditDate(e.target.value)} title="Applied Date" />
                  <input type="date" style={{ ...inputStyle, colorScheme: "dark" }} value={editRejectedDate} onChange={(e) => setEditRejectedDate(e.target.value)} title="Rejected Date" />
                  <input style={inputStyle} placeholder="Notes (optional)" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                </div>

                {!showEditReflection && (
                  <p style={{ marginTop: 12, fontSize: 11, color: "#404040", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Set status to Interview, Offer, or Rejected to add reflections
                  </p>
                )}

                {showEditReflection && (
                  <>
                    <div style={{
                      marginTop: 16, padding: "10px 14px",
                      background: "rgba(167, 139, 250, 0.06)", border: "1px solid rgba(167, 139, 250, 0.15)",
                      borderRadius: 8, display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      <span style={{ fontSize: 12, color: "#a78bfa" }}>
                        Reflection fields unlocked
                      </span>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <label style={{ display: "block", color: "#a78bfa", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Interview Experience</label>
                      <AutocompleteTextarea
                        fieldType="interviewExperience" value={editInterviewExp} onChange={setEditInterviewExp}
                        placeholder="Describe your interview experience..." style={textareaEditStyle} focusBorderColor="#a78bfa"
                      />
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <label style={{ display: "block", color: "#4ade80", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Self-Reflection</label>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ marginTop: 8 }}>
                        <AutocompleteTextarea fieldType="whatWentWell" value={editWhatWentWell} onChange={setEditWhatWentWell}
                          placeholder="What went well?" style={textareaEditStyle} focusBorderColor="#4ade80" />
                        <AutocompleteTextarea fieldType="whatDidntGoWell" value={editWhatDidntGoWell} onChange={setEditWhatDidntGoWell}
                          placeholder="What didn't go well?" style={textareaEditStyle} focusBorderColor="#f87171" />
                        <AutocompleteTextarea fieldType="lessonsLearned" value={editLessonsLearned} onChange={setEditLessonsLearned}
                          placeholder="Lessons learned" style={textareaEditStyle} focusBorderColor="#fbbf24" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 mt-5 pt-5" style={{ borderTop: "1px solid #1e1e1e" }}>
                  <button type="button" onClick={() => setEditingJob(null)}
                    style={{ ...buttonStyle, height: 38, padding: "0 18px", background: "#1a1a1a", border: "1px solid #262626", color: "#a1a1a1" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    style={{ ...buttonStyle, height: 38, padding: "0 22px", background: "#fafafa", border: "none", color: "#0a0a0a", fontWeight: 600, opacity: saving ? 0.6 : 1 }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </Modal>

          {/* Delete Confirm Modal */}
          <ConfirmModal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title="Delete Application"
            message={deleteTarget ? `Are you sure you want to delete your application for ${deleteTarget.role} at ${deleteTarget.company}? This action cannot be undone.` : ""}
            loading={deleting}
          />
        </>
      )}
    </div>
  );
}

/* ── Extracted row component ── */

function JobRow({
  job,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onQuickStatus,
  buttonStyle,
}: {
  job: JobType;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onQuickStatus: (status: string) => void;
  buttonStyle: React.CSSProperties;
}) {
  const detailsExist = hasDetails(job);

  const indicators: { color: string; label: string }[] = [];
  if (job.interviewExperience) indicators.push({ color: "#a78bfa", label: "Interview" });
  if (hasFeedback(job.feedback)) indicators.push({ color: "#4ade80", label: "Reflection" });

  const delay = Math.min(index * 0.04, 0.4);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay, ease: "easeOut" }}
        style={{
          borderTop: "1px solid #1e1e1e",
          background: isExpanded ? "rgba(255, 255, 255, 0.02)" : "transparent",
        }}
        onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"; }}
        onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
      >
        <td style={{ padding: "14px 20px" }}>
          <span style={{ fontWeight: 600, color: "#fafafa" }}>{job.company}</span>
        </td>
        <td style={{ padding: "14px 20px", color: "#a1a1a1" }}>{job.role}</td>
        <td style={{ padding: "14px 20px" }}>
          <select
            value={job.status}
            onChange={(e) => onQuickStatus(e.target.value)}
            style={{
              ...getStatusStyle(job.status),
              border: `1px solid ${STATUS_COLORS[job.status]?.border || "#2a2a2a"}`,
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              paddingRight: 26,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23525252' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 8px center",
            }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s} style={{ background: "#141414", color: "#d4d4d4" }}>{s}</option>
            ))}
          </select>
        </td>
        <td style={{ padding: "14px 20px", color: "#737373" }}>
          {job.appliedDate ? (
            <span title={new Date(job.appliedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}>
              {timeAgo(job.appliedDate)}
            </span>
          ) : "—"}
        </td>
        <td style={{ padding: "14px 20px", color: "#a1a1a1", fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {job.notes ? (
            <span title={job.notes}>{job.notes}</span>
          ) : (
            <span style={{ color: "#333333" }}>—</span>
          )}
        </td>
        <td style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            {detailsExist && (
              <button
                style={{
                  ...buttonStyle,
                  background: isExpanded ? "#1a1a1a" : "transparent",
                  border: `1px solid ${isExpanded ? "#333333" : "#262626"}`,
                  color: isExpanded ? "#fafafa" : "#737373",
                }}
                onClick={onToggleExpand}
              >
                {isExpanded ? "Collapse" : "Details"}
              </button>
            )}
            <button
              style={{ ...buttonStyle, background: "#1a1a1a", border: "1px solid #262626", color: "#a1a1a1" }}
              onClick={onEdit}
              onMouseOver={(e) => { e.currentTarget.style.color = "#fafafa"; }}
              onMouseOut={(e) => { e.currentTarget.style.color = "#a1a1a1"; }}
            >
              Edit
            </button>
            <button
              style={{ ...buttonStyle, background: "rgba(248, 113, 113, 0.08)", border: "1px solid rgba(248, 113, 113, 0.2)", color: "#f87171" }}
              onClick={onDelete}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(248, 113, 113, 0.15)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(248, 113, 113, 0.08)"; }}
            >
              Delete
            </button>
          </div>
        </td>
      </motion.tr>

      {isExpanded && (
        <tr>
          <td colSpan={6} style={{ padding: 0 }}>
            <div style={{
              padding: "20px 24px",
              background: "#0e0e0e",
              borderTop: "1px solid #1e1e1e",
              borderBottom: "1px solid #1e1e1e",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                <DetailCard
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                  title="Interview Experience" accentColor="#a78bfa"
                >
                  {job.interviewExperience ? (
                    <p style={{ color: "#a1a1a1", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{job.interviewExperience}</p>
                  ) : (
                    <p style={{ color: "#333333", fontSize: 12, fontStyle: "italic" }}>No interview experience recorded.</p>
                  )}
                </DetailCard>

                <DetailCard
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
                  title="Self-Reflection" accentColor="#4ade80"
                >
                  {hasFeedback(job.feedback) ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {job.feedback?.whatWentWell && (
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#4ade80", textTransform: "uppercase", letterSpacing: 0.5 }}>What went well</span>
                          <p style={{ color: "#a1a1a1", fontSize: 13, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.whatWentWell}</p>
                        </div>
                      )}
                      {job.feedback?.whatDidntGoWell && (
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: 0.5 }}>What didn&apos;t go well</span>
                          <p style={{ color: "#a1a1a1", fontSize: 13, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.whatDidntGoWell}</p>
                        </div>
                      )}
                      {job.feedback?.lessonsLearned && (
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#fbbf24", textTransform: "uppercase", letterSpacing: 0.5 }}>Lessons learned</span>
                          <p style={{ color: "#a1a1a1", fontSize: 13, marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{job.feedback.lessonsLearned}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "#333333", fontSize: 12, fontStyle: "italic" }}>No reflection added yet.</p>
                  )}
                </DetailCard>
              </div>

              {(job.notes || job.rejectedDate) && (
                <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {job.notes && (
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#737373", textTransform: "uppercase", letterSpacing: 0.5 }}>Notes</span>
                      <p style={{ color: "#a1a1a1", fontSize: 13, marginTop: 4 }}>{job.notes}</p>
                    </div>
                  )}
                  {job.rejectedDate && (
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#f87171", textTransform: "uppercase", letterSpacing: 0.5 }}>Rejected</span>
                      <p style={{ color: "#f87171", fontSize: 13, marginTop: 4 }}>
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

function DetailCard({ icon, title, accentColor, children }: {
  icon: React.ReactNode; title: string; accentColor: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 600, color: accentColor }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ── Mobile card component ── */

function JobCard({
  job,
  index,
  onEdit,
  onDelete,
  onQuickStatus,
}: {
  job: JobType;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onQuickStatus: (status: string) => void;
}) {
  const delay = Math.min(index * 0.05, 0.4);
  const statusStyle = getStatusStyle(job.status);
  const statusColors = STATUS_COLORS[job.status] || STATUS_COLORS["Applied"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 16, borderLeft: `3px solid ${statusColors.border}` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontWeight: 600, color: "#fafafa", fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {job.company}
          </p>
          <p style={{ color: "#737373", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {job.role}
          </p>
        </div>
        <select
          value={job.status}
          onChange={(e) => onQuickStatus(e.target.value)}
          style={{
            ...statusStyle,
            border: `1px solid ${statusColors.border}`,
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
            paddingRight: 22,
            fontSize: 11,
            padding: "4px 22px 4px 8px",
            flexShrink: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23525252' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 6px center",
          }}
        >
          {STATUSES.map(s => (
            <option key={s} value={s} style={{ background: "#141414", color: "#d4d4d4" }}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {job.appliedDate && (
          <span style={{ color: "#525252", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {timeAgo(job.appliedDate)}
          </span>
        )}
        {job.interviewExperience && (
          <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(167, 139, 250, 0.08)", color: "#a78bfa", border: "1px solid rgba(167, 139, 250, 0.15)", fontWeight: 500 }}>
            Interview
          </span>
        )}
        {hasFeedback(job.feedback) && (
          <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(74, 222, 128, 0.08)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.15)", fontWeight: 500 }}>
            Reflection
          </span>
        )}
      </div>

      {job.notes && (
        <p style={{ color: "#525252", fontSize: 12, marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {job.notes}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            height: 32,
            background: "#1a1a1a",
            border: "1px solid #262626",
            borderRadius: 6,
            color: "#a1a1a1",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            height: 32,
            padding: "0 14px",
            background: "rgba(248, 113, 113, 0.08)",
            border: "1px solid rgba(248, 113, 113, 0.2)",
            borderRadius: 6,
            color: "#f87171",
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
