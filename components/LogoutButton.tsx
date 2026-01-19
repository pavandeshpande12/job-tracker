"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jat_user");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        height: 40,
        padding: "0 16px",
        background: "#334155",
        border: "1px solid #475569",
        borderRadius: 10,
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.2s",
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = "#475569"; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "#334155"; }}
    >
      <svg width="16" height="16" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
}
