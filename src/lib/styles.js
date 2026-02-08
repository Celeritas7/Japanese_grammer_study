// ─── Color Tokens ────────────────────────────────────────────────
export const C = {
  bg: "#F7F3EE",
  surface: "#FFFFFF",
  dark: "#2C2420",
  darkAlt: "#4A3728",
  gold: "#C4A882",
  goldLight: "#F0E8DD",
  text: "#2C2420",
  textMid: "#7A6B5D",
  textLight: "#8B7355",
  textMuted: "#A89580",
  green: "#5A8F5A",
  greenBg: "#EAF4EA",
  red: "#C25B4E",
  redBg: "#FAEAE8",
  border: "rgba(196,168,130,0.15)",
  borderMid: "rgba(196,168,130,0.25)",
  borderLight: "rgba(196,168,130,0.3)",
};

// ─── Shared Styles ───────────────────────────────────────────────
export const S = {
  card: {
    background: C.surface, borderRadius: "14px", padding: "20px",
    marginBottom: "14px", boxShadow: "0 1px 8px rgba(44,36,32,0.06)",
    border: `1px solid ${C.border}`,
  },
  tag: (bg = C.goldLight, color = C.textLight) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: "20px",
    fontSize: "11px", fontWeight: 500, background: bg, color, marginRight: "6px", marginBottom: "6px",
  }),
  sectionTitle: {
    fontSize: "13px", fontWeight: 600, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "1.5px", margin: "16px 0 8px",
  },
  btn: (bg, color) => ({
    padding: "10px 24px", borderRadius: "10px", border: "none",
    fontSize: "14px", fontWeight: 600, cursor: "pointer",
    fontFamily: "'Noto Sans JP', sans-serif", background: bg, color,
  }),
};
