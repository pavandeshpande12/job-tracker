"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const QUICK_PICKS: Record<string, { label: string; text: string }[]> = {
  interviewExperience: [
    { label: "Phone Screen", text: "Had a technical phone screen — " },
    { label: "Take-Home", text: "Completed a take-home coding assignment. " },
    { label: "Panel Interview", text: "Panel interview with the engineering team. " },
    { label: "Behavioral", text: "Behavioral interview focused on " },
    { label: "System Design", text: "System design round covering " },
    { label: "Live Coding", text: "Live coding session on " },
    { label: "HR Screen", text: "HR screening call about role expectations. " },
    { label: "Pair Programming", text: "Pair programming session with a senior engineer. " },
    { label: "Case Study", text: "Case study presentation to the hiring manager. " },
    { label: "Culture Fit", text: "Culture fit interview with cross-functional team. " },
  ],
  whatWentWell: [
    { label: "Clear Communication", text: "Communicated my thought process clearly. " },
    { label: "Problem Solved", text: "Solved the coding problem within time. " },
    { label: "Good Rapport", text: "Connected well with the interviewer. " },
    { label: "Strong Fundamentals", text: "Demonstrated strong knowledge of fundamentals. " },
    { label: "Good Questions", text: "Asked insightful questions about the team. " },
    { label: "Project Impact", text: "Explained past project impact effectively. " },
    { label: "Stayed Calm", text: "Stayed calm under pressure. " },
    { label: "Concrete Examples", text: "Provided concrete examples with metrics. " },
  ],
  whatDidntGoWell: [
    { label: "Algorithm Struggle", text: "Struggled with algorithm complexity analysis. " },
    { label: "Time Ran Out", text: "Couldn't optimize the solution in time. " },
    { label: "Nerves", text: "Got nervous and forgot key points. " },
    { label: "Clarifying Qs", text: "Didn't ask enough clarifying questions. " },
    { label: "Unfamiliar Stack", text: "Unfamiliar with their specific tech stack. " },
    { label: "Design Depth", text: "System design lacked depth in scalability. " },
    { label: "Rambled", text: "Rambled on answers instead of being concise. " },
    { label: "Edge Cases", text: "Missed edge cases in the coding problem. " },
  ],
  lessonsLearned: [
    { label: "System Design", text: "Practice more system design problems. " },
    { label: "STAR Format", text: "Prepare STAR format answers for behavioral questions. " },
    { label: "Research Company", text: "Research the company culture before interviews. " },
    { label: "DSA Practice", text: "Review data structures and algorithms daily. " },
    { label: "Mock Interviews", text: "Mock interviews help reduce nervousness. " },
    { label: "Project Examples", text: "Keep a list of strong project examples ready. " },
    { label: "Clean Code", text: "Write cleaner code during live sessions. " },
    { label: "Follow Up", text: "Follow up with a thank-you email promptly. " },
  ],
};

const TYPEAHEAD: Record<string, string[]> = {
  interviewExperience: [
    "Technical phone screen with the hiring manager",
    "Completed a take-home coding assignment over the weekend",
    "Panel interview with the engineering team — 3 rounds",
    "Behavioral interview focused on leadership and teamwork",
    "System design round covering scalability and trade-offs",
    "Live coding session on data structures and algorithms",
    "HR screening call about role expectations and salary",
    "Pair programming session with a senior engineer",
    "Case study presentation to the hiring manager",
    "Multiple rounds spread over several weeks",
    "Asked about experience with distributed systems",
    "Discussed team workflow and agile practices",
  ],
  whatWentWell: [
    "Communicated my thought process clearly throughout",
    "Solved the coding problem within the time limit",
    "Connected well with the interviewer, felt natural",
    "Demonstrated strong knowledge of fundamentals",
    "Asked insightful questions about the team and roadmap",
    "Explained past project impact with concrete metrics",
    "Handled behavioral questions confidently with STAR format",
    "System design answer was well-structured and thorough",
    "Showed genuine enthusiasm for the role and mission",
    "Managed time well across all interview rounds",
    "Stayed calm under pressure during live coding",
    "Good rapport with the hiring manager",
  ],
  whatDidntGoWell: [
    "Struggled with the algorithm complexity analysis",
    "Couldn't optimize the brute-force solution in time",
    "Got nervous and forgot key points I wanted to mention",
    "Didn't ask enough clarifying questions upfront",
    "Unfamiliar with their specific tech stack",
    "System design lacked depth in scalability discussion",
    "Could have prepared more STAR examples beforehand",
    "Rambled on answers instead of being concise",
    "Missed edge cases in the coding problem",
    "Didn't research the company well enough beforehand",
    "Time management was poor — rushed the last round",
    "Froze on an unexpected behavioral question",
  ],
  lessonsLearned: [
    "Practice more system design problems weekly",
    "Prepare STAR format answers for behavioral questions",
    "Research the company culture and recent news before interviews",
    "Review data structures and algorithms daily",
    "Work on communicating clearly under time pressure",
    "Keep a list of strong project examples ready to go",
    "Practice explaining complex concepts in simple terms",
    "Brush up on SQL and database design patterns",
    "Do at least 2 mock interviews before real ones",
    "Always ask about team structure and growth opportunities",
    "Time-box each section of a system design problem",
    "Study the job description more carefully for keyword prep",
  ],
};

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  fieldType: keyof typeof QUICK_PICKS;
  style?: React.CSSProperties;
  focusBorderColor?: string;
}

export default function AutocompleteTextarea({
  value,
  onChange,
  placeholder,
  fieldType,
  style,
  focusBorderColor = "#06b6d4",
}: Props) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getLastLine = useCallback((text: string) => {
    const lines = text.split("\n");
    return lines[lines.length - 1].trim();
  }, []);

  useEffect(() => {
    const lastLine = getLastLine(value);
    if (lastLine.length < 2) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    const pool = TYPEAHEAD[fieldType] || [];
    const matches = pool.filter(
      (s) =>
        s.toLowerCase().includes(lastLine.toLowerCase()) &&
        s.toLowerCase() !== lastLine.toLowerCase()
    );

    setFiltered(matches.slice(0, 4));
    setShowDropdown(matches.length > 0);
    setSelectedIndex(0);
  }, [value, fieldType, getLastLine]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyDropdownSuggestion = (suggestion: string) => {
    const lines = value.split("\n");
    lines[lines.length - 1] = suggestion;
    onChange(lines.join("\n"));
    setShowDropdown(false);
    textareaRef.current?.focus();
  };

  const applyQuickPick = (text: string) => {
    const newValue = value ? value.trimEnd() + "\n" + text : text;
    onChange(newValue);
    textareaRef.current?.focus();
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newValue.length;
        textareaRef.current.selectionEnd = newValue.length;
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Tab") {
      e.preventDefault();
      applyDropdownSuggestion(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const picks = QUICK_PICKS[fieldType] || [];

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <textarea
        ref={textareaRef}
        style={style}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setFocused(true);
          if (focusBorderColor) e.target.style.borderColor = focusBorderColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }}
      />

      {/* Typeahead dropdown */}
      {showDropdown && filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 4px)",
            background: "rgba(15, 23, 42, 0.98)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 10,
            overflow: "hidden",
            zIndex: 60,
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              padding: "6px 12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
              Press Tab to accept
            </span>
          </div>
          {filtered.map((suggestion, idx) => (
            <div
              key={suggestion}
              onClick={() => applyDropdownSuggestion(suggestion)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                fontSize: 13,
                color: idx === selectedIndex ? "#ffffff" : "#94a3b8",
                background:
                  idx === selectedIndex
                    ? `${focusBorderColor}20`
                    : "transparent",
                borderLeft:
                  idx === selectedIndex
                    ? `2px solid ${focusBorderColor}`
                    : "2px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Quick-pick chips — always visible when focused */}
      {focused && picks.length > 0 && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#475569", fontWeight: 500, marginRight: 2 }}>
            Quick add:
          </span>
          {picks.map((pick) => (
            <button
              key={pick.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyQuickPick(pick.text);
              }}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 14,
                border: `1px solid ${focusBorderColor}30`,
                background: `${focusBorderColor}08`,
                color: focusBorderColor,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `${focusBorderColor}20`;
                e.currentTarget.style.borderColor = `${focusBorderColor}50`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `${focusBorderColor}08`;
                e.currentTarget.style.borderColor = `${focusBorderColor}30`;
              }}
            >
              + {pick.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
