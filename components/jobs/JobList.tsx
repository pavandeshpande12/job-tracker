"use client";

import { useEffect, useState } from "react";

interface Props {
  userEmail: string;
  refreshJobs?: () => void;
}

type JobType = {
  _id: string;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes?: string;
};

/* 💠 STATUS BADGE STYLES */
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

export default function JobList({ userEmail, refreshJobs }: Props) {
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [editingJob, setEditingJob] = useState<JobType | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  /* 🔎 FILTER STATES */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  /* 🌐 FETCH JOBS */
  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?email=${userEmail}`);
      const data = await res.json();
      if (res.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ❌ DELETE */
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
        refreshJobs && refreshJobs();
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting job");
    }
  };

  /* 📝 FORMAT & EDIT */
  const formatDateInput = (dateStr: string) =>
    new Date(dateStr).toISOString().slice(0, 10);

  const handleEditClick = (job: JobType) => {
    setEditingJob(job);
    setEditCompany(job.company);
    setEditRole(job.role);
    setEditStatus(job.status);
    setEditDate(formatDateInput(job.appliedDate));
    setEditNotes(job.notes || "");
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
          appliedDate: editDate,
          notes: editNotes,
        }),
      });

      if (res.ok) {
        setEditingJob(null);
        await fetchJobs();
        refreshJobs && refreshJobs();
      }
    } catch (err) {
      console.error(err);
      alert("Error updating job");
    } finally {
      setSaving(false);
    }
  };

  /* 🔃 FETCH ON LOAD */
  useEffect(() => {
    fetchJobs();
  }, [refreshJobs, userEmail]);

  /* 🔍 FILTERING LOGIC */
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ? true : job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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

          {/* 🔎 FILTER PANEL */}
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
          {/* 📋 TABLE */}
          <div className="glass-card" style={{ borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.03)" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Company</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Role</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Status</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Date</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Notes</th>
                  <th style={{ textAlign: "right", padding: "14px 20px", fontWeight: 600, color: "#e2e8f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <tr
                    key={job._id}
                    style={{ 
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                      background: index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
                    onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)"}
                  >
                    <td style={{ padding: "18px 20px" }}>
                      <span style={{ fontWeight: 600, color: "#ffffff" }}>{job.company}</span>
                    </td>
                    <td style={{ padding: "18px 20px", color: "#e2e8f0" }}>{job.role}</td>
                    <td style={{ padding: "18px 20px" }}>
                      <span style={getStatusStyle(job.status)}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: "18px 20px", color: "#cbd5e1" }}>
                      {new Date(job.appliedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </td>
                    <td style={{ padding: "18px 20px", color: "#94a3b8", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {job.notes || "—"}
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <button
                          style={{ ...buttonStyle, background: "#334155", border: "1px solid #475569", color: "#ffffff" }}
                          onClick={() => handleEditClick(job)}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#475569"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "#334155"; }}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...buttonStyle, background: "#7f1d1d", border: "1px solid #991b1b", color: "#fecaca" }}
                          onClick={() => handleDelete(job._id)}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#991b1b"; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = "#7f1d1d"; }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✏ EDIT PANEL */}
          {editingJob && (
            <div style={{ marginTop: 24, padding: 24, background: "#1e293b", border: "2px solid #06b6d4", borderRadius: 12 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#22d3ee", marginBottom: 16 }}>✏️ Editing: {editingJob.company}</p>
              <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <input
                  style={inputStyle}
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  required
                  placeholder="Company"
                />
                <input
                  style={inputStyle}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  required
                  placeholder="Role"
                />
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Applied" style={{ background: "#0f172a" }}>Applied</option>
                  <option value="Online Test" style={{ background: "#0f172a" }}>Online Test</option>
                  <option value="Interview" style={{ background: "#0f172a" }}>Interview</option>
                  <option value="Offer" style={{ background: "#0f172a" }}>Offer</option>
                  <option value="Rejected" style={{ background: "#0f172a" }}>Rejected</option>
                </select>
                <input
                  type="date"
                  style={{ ...inputStyle, colorScheme: "dark" }}
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
                <input
                  style={inputStyle}
                  placeholder="Notes (optional)"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </form>
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
                  onClick={handleUpdate}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
