"use client";

import { motion } from "motion/react";
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
  Legend,
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

const COLORS = ["#a78bfa", "#60a5fa", "#4ade80", "#f87171"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#141414", border: "1px solid #262626", borderRadius: 8, padding: "8px 12px" }}>
        <p style={{ color: "#737373", fontSize: 11, fontWeight: 500 }}>{label || payload[0].name}</p>
        <p style={{ color: "#fafafa", fontSize: 16, fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
          <span style={{ color: "#737373", fontSize: 12, fontWeight: 500 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

function ChartSkeleton() {
  return (
    <section style={{ marginTop: 40 }}>
      <div className="skeleton" style={{ width: 100, height: 18, borderRadius: 4, marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
          <div className="skeleton" style={{ width: 120, height: 12, borderRadius: 4, marginBottom: 20 }} />
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingTop: 20 }}>
            {[70, 45, 90, 30, 60].map((h, i) => (
              <div key={i} className="skeleton" style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "space-between" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ width: 40, height: 10, borderRadius: 3 }} />
            ))}
          </div>
        </div>
        <div style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
          <div className="skeleton" style={{ width: 100, height: 12, borderRadius: 4, marginBottom: 20 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160 }}>
            <div className="skeleton" style={{ width: 140, height: 140, borderRadius: "50%" }} />
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, justifyContent: "center" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ width: 50, height: 10, borderRadius: 3 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function JobCharts({ stats }: Props) {
  if (!stats) return <ChartSkeleton />;

  const hasData = stats.total > 0 || stats.test > 0 || stats.interview > 0 || stats.offer > 0 || stats.reject > 0;
  if (!hasData) return null;

  const pieData = [
    { name: "Online Test", value: stats.test },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.reject },
  ].filter(item => item.value > 0);

  const barData = [
    { name: "Total", value: stats.total, fill: "#737373" },
    { name: "Test", value: stats.test, fill: "#a78bfa" },
    { name: "Interview", value: stats.interview, fill: "#60a5fa" },
    { name: "Offer", value: stats.offer, fill: "#4ade80" },
    { name: "Rejected", value: stats.reject, fill: "#f87171" },
  ];

  return (
    <section style={{ marginTop: 40 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa", marginBottom: 16 }}>Analytics</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}
        >
          <h4 style={{ color: "#a1a1a1", fontSize: 13, fontWeight: 500, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>Status Overview</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                stroke="#404040"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1e1e1e" }}
              />
              <YAxis
                stroke="#404040"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                animationBegin={300}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          style={{ background: "#111111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}
        >
          <h4 style={{ color: "#a1a1a1", fontSize: 13, fontWeight: 500, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>Distribution</h4>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  innerRadius={40}
                  strokeWidth={0}
                  paddingAngle={2}
                  animationBegin={400}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#404040", fontSize: 13 }}>
              No stage data yet
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
