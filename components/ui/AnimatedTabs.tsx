"use client";

import { useState, useEffect, type FC } from "react";
import { motion, LayoutGroup } from "motion/react";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export const AnimatedTabs: FC<AnimatedTabsProps> = ({
  tabs,
  activeId,
  onChange,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <LayoutGroup>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 3,
          borderRadius: 10,
          background: "#111111",
          border: "1px solid #1e1e1e",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              style={{
                position: "relative",
                padding: "7px 14px",
                borderRadius: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                outline: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-pill"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                    mass: 0.8,
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                  }}
                />
              )}

              <motion.span
                layout="position"
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#fafafa" : "#525252",
                  transition: "color 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </motion.span>

              {tab.count !== undefined && tab.count > 0 && (
                <motion.span
                  layout="position"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 5,
                    background: isActive ? "#262626" : "#171717",
                    color: isActive ? "#a1a1a1" : "#404040",
                    transition: "all 0.15s",
                  }}
                >
                  {tab.count}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
};
