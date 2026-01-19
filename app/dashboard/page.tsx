"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import AddJobForm from "@/components/jobs/AddJobForm";
import JobList from "@/components/jobs/JobList";
import JobCharts from "@/components/charts/JobCharts";

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [refresh, setRefresh] = useState(false);

  const fetchStats = async (email: string) => {
    try {
      const res = await fetch(`/api/jobs/stats?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.ok) setStats(data.stats);
    } catch (e) {
      console.error("Stats fetch failed:", e);
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
      fetchStats(parsed.email);
    } catch {
      localStorage.removeItem("jat_user");
      router.replace("/login");
    }
  }, [router]);

  const refreshJobs = () => {
    setRefresh((prev) => !prev);
    if (user) fetchStats(user.email);
  };

  if (loading || !user) {
    return (
      <div style={{ 
        position: "fixed",
        inset: 0,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="app-background">
          <div className="gradient-orb gradient-orb-1" />
          <div className="gradient-orb gradient-orb-2" />
          <div className="gradient-orb gradient-orb-3" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#06b6d4",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ color: "#94a3b8", fontSize: 14 }}>Loading your dashboard...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      width: "100%",
      background: "transparent",
      position: "relative"
    }}>
      {/* Animated Background */}
      <div className="app-background">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="grid-overlay" />
        <div className="noise-overlay" />
      </div>

      {/* Header */}
      <header style={{ 
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(12, 18, 34, 0.4)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
              Job Tracker
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div 
              style={{ 
                position: "relative",
                display: "flex", 
                alignItems: "center", 
                gap: 8, 
                padding: "5px 12px 5px 5px", 
                borderRadius: 50,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              className="user-pill"
            >
              <div style={{ 
                width: 26, 
                height: 26, 
                background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{ color: "#ffffff", fontWeight: 600, fontSize: 11 }}>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ color: "#ffffff", fontWeight: 500, fontSize: 13 }}>{user.name}</span>
              
              {/* Tooltip */}
              <div className="user-tooltip glass-card" style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                borderRadius: 12,
                padding: "12px 16px",
                minWidth: 200,
                opacity: 0,
                visibility: "hidden",
                transform: "translateY(-4px)",
                transition: "all 0.2s",
                zIndex: 100
              }}>
                <p style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Signed in as</p>
                <p style={{ color: "#ffffff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{user.name}</p>
                <p style={{ color: "#64748b", fontSize: 13 }}>{user.email}</p>
              </div>
            </div>
            <LogoutButton />
            
            <style>{`
              .user-pill:hover { background: rgba(255, 255, 255, 0.1) !important; border-color: rgba(255, 255, 255, 0.15) !important; }
              .user-pill:hover .user-tooltip { opacity: 1 !important; visibility: visible !important; transform: translateY(0) !important; }
            `}</style>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 10 }}>
        {/* Welcome Section */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16 }}>
            Track your job applications and stay organized in your job search.
          </p>
        </section>

        {/* Stats Cards */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff" }}>Application Overview</h3>
            <span style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "1px" }}>Real-time stats</span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {/* Total Card */}
            <div className="glass-card" style={{ 
              borderRadius: 16,
              padding: 20,
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                background: "rgba(148, 163, 184, 0.15)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Total Applied</p>
              <p style={{ color: "#ffffff", fontSize: 36, fontWeight: 700 }}>{stats?.total ?? 0}</p>
            </div>

            {/* Online Test Card */}
            <div className="glass-card" style={{ 
              borderRadius: 16,
              padding: 20,
              borderColor: "rgba(99, 102, 241, 0.3)"
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                background: "rgba(99, 102, 241, 0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Online Test</p>
              <p style={{ color: "#818cf8", fontSize: 36, fontWeight: 700 }}>{stats?.test ?? 0}</p>
            </div>

            {/* Interview Card */}
            <div className="glass-card" style={{ 
              borderRadius: 16,
              padding: 20,
              borderColor: "rgba(59, 130, 246, 0.3)"
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                background: "rgba(59, 130, 246, 0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Interview</p>
              <p style={{ color: "#60a5fa", fontSize: 36, fontWeight: 700 }}>{stats?.interview ?? 0}</p>
            </div>

            {/* Offer Card */}
            <div className="glass-card" style={{ 
              borderRadius: 16,
              padding: 20,
              borderColor: "rgba(34, 197, 94, 0.3)"
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                background: "rgba(34, 197, 94, 0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Offers</p>
              <p style={{ color: "#4ade80", fontSize: 36, fontWeight: 700 }}>{stats?.offer ?? 0}</p>
            </div>

            {/* Rejected Card */}
            <div className="glass-card" style={{ 
              borderRadius: 16,
              padding: 20,
              borderColor: "rgba(239, 68, 68, 0.3)"
            }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                background: "rgba(239, 68, 68, 0.2)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Rejected</p>
              <p style={{ color: "#f87171", fontSize: 36, fontWeight: 700 }}>{stats?.reject ?? 0}</p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <JobCharts stats={stats} />

        {/* Add Job Form Section */}
        <section style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid #334155" }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", marginBottom: 36 }}>Add New Application</h3>
          <AddJobForm userEmail={user.email} refreshJobs={refreshJobs} />
        </section>

        {/* Job List Section */}
        <section style={{ marginTop: 64, paddingTop: 48, paddingBottom: 48, borderTop: "1px solid #334155" }}>
          <JobList userEmail={user.email} refreshJobs={refreshJobs} key={refresh.toString()} />
        </section>
      </main>
    </div>
  );
}
