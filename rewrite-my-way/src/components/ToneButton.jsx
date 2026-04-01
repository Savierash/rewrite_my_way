// src/components/ToneButton.jsx
export default function ToneButton({ id, tone, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: isActive ? tone.bg : "#141417",
        border: `1px solid ${isActive ? tone.border : "#252529"}`,
        borderRadius: 4,
        padding: "13px 8px 11px",
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        outline: "none",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 20 }}>{tone.emoji}</span>
      <span style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 10, fontWeight: 700,
        letterSpacing: "0.04em", textTransform: "uppercase",
        color: isActive ? tone.color : "#6e6c75",
        lineHeight: 1.3,
      }}>
        {tone.label}
      </span>
    </button>
  );
}