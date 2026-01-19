"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  stats:
    | {
        total: number;
        test: number;
        interview: number;
        offer: number;
        reject: number;
      }
    | null;
};

const COLORS = ["#818cf8", "#60a5fa", "#34d399", "#fb7185"];

// Custom tooltip for better dark theme styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 10, padding: "10px 14px" }}>
        <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{label || payload[0].name}</p>
        <p style={{ color: "#06b6d4", fontSize: 18, fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function JobCharts({ stats }: Props) {
  if (!stats) return null;

  // Don't render charts if no data
  const hasData = stats.total > 0 || stats.test > 0 || stats.interview > 0 || stats.offer > 0 || stats.reject > 0;
  if (!hasData) return null;

  const pieData = [
    { name: "Online Test", value: stats.test },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.reject },
  ].filter(item => item.value > 0);

  const barData = [
    { name: "Total", value: stats.total, fill: "#94a3b8" },
    { name: "Test", value: stats.test, fill: "#818cf8" },
    { name: "Interview", value: stats.interview, fill: "#60a5fa" },
    { name: "Offer", value: stats.offer, fill: "#34d399" },
    { name: "Rejected", value: stats.reject, fill: "#fb7185" },
  ];

  const cardStyle: React.CSSProperties = {
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 24,
    transition: "all 0.3s",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
  };

  return (
    <section style={{ marginTop: 40 }}>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: "#ffffff", marginBottom: 20 }}>Analytics & Insights</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {/* 📊 BAR CHART */}
        <div 
          style={cardStyle}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)"; }}
        >
          <h4 style={{ color: "#ffffff", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Status Overview</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barCategoryGap="20%">
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: "#334155" }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.1)" }} />
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]}
                fill="#22d3ee"
              >
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 PIE CHART */}
        <div 
          style={cardStyle}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)"; }}
        >
          <h4 style={{ color: "#ffffff", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Distribution</h4>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={70}
                  innerRadius={40}
                  strokeWidth={0}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#64748b", strokeWidth: 1 }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 14 }}>
              No stage data yet
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
