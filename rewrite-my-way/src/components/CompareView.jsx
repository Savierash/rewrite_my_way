// src/components/CompareView.jsx
export default function CompareView({ original, rewritten, toneColor, toneLabel, toneEmoji }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1,
      background: "#252529",
      border: "1px solid #252529",
      borderRadius: 6,
      overflow: "hidden",
    }}>
      {/* Original */}
      <div>
        <div style={{
          padding: "11px 18px",
          background: "#141417",
          borderBottom: "1px solid #252529",
          fontFamily: "'Syne Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6e6c75",
        }}>
          ◎ Original
        </div>
        <div style={{
          padding: "20px",
          fontSize: 15,
          lineHeight: 1.75,
          color: "#9a9890",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#0d0d0f",
          minHeight: 120,
        }}>
          {original}
        </div>
      </div>

      {/* Rewritten */}
      <div>
        <div style={{
          padding: "11px 18px",
          background: "#141417",
          borderBottom: "1px solid #252529",
          fontFamily: "'Syne Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: toneColor,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: toneColor, display: "inline-block" }} />
          {toneEmoji} {toneLabel}
        </div>
        <div style={{
          padding: "20px",
          fontSize: 15,
          lineHeight: 1.75,
          color: "#eae8e3",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#0d0d0f",
          minHeight: 120,
        }}>
          {rewritten}
        </div>
      </div>
    </div>
  );
}