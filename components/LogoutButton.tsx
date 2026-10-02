"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jat_user");
    localStorage.removeItem("jat_token");
    document.cookie = "jat_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        height: 36,
        padding: "0 14px",
        background: "#141414",
        border: "1px solid #262626",
        borderRadius: 8,
        color: "#a1a1a1",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.15s",
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#fafafa"; }}
      onMouseOut={(e) => { e.currentTarget.style.background = "#141414"; e.currentTarget.style.color = "#a1a1a1"; }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
}
