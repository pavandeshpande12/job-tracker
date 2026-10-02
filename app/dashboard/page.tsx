"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LogoutButton } from "@/components/LogoutButton";
import AddJobForm from "@/components/jobs/AddJobForm";
import Modal from "@/components/ui/Modal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import JobList from "@/components/jobs/JobList";
import JobCharts from "@/components/charts/JobCharts";
import ReflectionSummary from "@/components/charts/ReflectionSummary";
import Timeline from "@/components/charts/Timeline";

type UserInfo = {
  name: string;
  email: string;
};

type JobStats = {
  total: number;
  test: number;
  interview: number;
  offer: number;
  reject: number;
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Applied",
    color: "#a1a1a1",
    numColor: "#fafafa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </svg>
    ),
  },
  {
    key: "test",
    label: "Online Test",
    color: "#a78bfa",
    numColor: "#a78bfa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: "interview",
    label: "Interview",
    color: "#60a5fa",
    numColor: "#60a5fa",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "offer",
    label: "Offers",
    color: "#4ade80",
    numColor: "#4ade80",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key: "reject",
    label: "Rejected",
    color: "#f87171",
    numColor: "#f87171",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/jobs/stats");
      const data = await res.json();
      if (res.ok && data.ok) setStats(data.stats);
    } catch {
      // stats fetch failed silently
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jat_user");
      if (!stored) {
        router.replace("/login");
        return;
      }

      const parsed = JSON.parse(stored) as UserInfo;
      if (!parsed || !parsed.email) {
        localStorage.removeItem("jat_user");
        router.replace("/login");
        return;
      }

      setUser(parsed);
      setLoading(false);
      fetchStats();
    } catch {
      localStorage.removeItem("jat_user");
      router.replace("/login");
    }
  }, [router]);

  const refreshJobs = () => {
    setRefresh((prev) => !prev);
    fetchStats();
  };

  if (loading || !user) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 36,
            height: 36,
            border: "2px solid #262626",
            borderTopColor: "#fafafa",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ color: "#525252", fontSize: 13 }}>Loading your dashboard...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0a0a0a",
    }}>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e1e1e"
        }}
      >
        <div className="header-inner">
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fafafa", letterSpacing: "-0.5px" }}>
              Job Tracker
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px 5px 5px",
                borderRadius: 50,
                background: "#141414",
                border: "1px solid #1e1e1e",
                cursor: "default",
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                background: "#262626",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{ color: "#a1a1a1", fontWeight: 600, fontSize: 11 }}>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ color: "#a1a1a1", fontWeight: 500, fontSize: 13 }}>{user.name}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 40 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fafafa", marginBottom: 6, letterSpacing: "-0.5px" }}>
                Welcome back, {user.name.split(" ")[0]}
              </h2>
              <p style={{ color: "#525252", fontSize: 14 }}>
                Track your job applications and stay organized.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddModal(true)}
              className="add-application-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Application
            </motion.button>
          </div>
        </motion.section>

        {/* Stats Cards */}
        <section style={{ marginBottom: 40 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>Overview</h3>
          </motion.div>

          <AnimatePresence mode="wait">
            {!stats ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}
              >
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 20 }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8, marginBottom: 12 }} />
                    <div className="skeleton" style={{ width: 70, height: 12, borderRadius: 4, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: 40, height: 28, borderRadius: 6 }} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {STAT_CARDS.map((card, i) => (
                  <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.1 + i * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.15 },
                    }}
                    style={{
                      background: "#111111",
                      border: "1px solid #1e1e1e",
                      borderRadius: 10,
                      padding: 20,
                      cursor: "default",
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      background: "#171717",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 12
                    }}>
                      {card.icon}
                    </div>
                    <p style={{ color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
                    <AnimatedCounter
                      value={stats[card.key as keyof JobStats]}
                      style={{ color: card.numColor, fontSize: 32, fontWeight: 700, display: "block" }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <JobCharts stats={stats} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Timeline refreshKey={refresh.toString()} />
        </motion.div>

        {/* Job List Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ marginTop: 48, paddingBottom: 48 }}
        >
          <JobList refreshJobs={refreshJobs} key={refresh.toString()} />
        </motion.section>

        {/* Reflection Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <ReflectionSummary refreshKey={refresh.toString()} />
        </motion.div>

      </main>

      {/* Add Job Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Application">
        <AddJobForm refreshJobs={refreshJobs} onClose={() => setShowAddModal(false)} />
      </Modal>

      {/* Floating Action Button */}
      <motion.button
        className="fab-add"
        onClick={() => setShowAddModal(true)}
        aria-label="Add application"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.9 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </motion.button>
    </div>
  );
}
