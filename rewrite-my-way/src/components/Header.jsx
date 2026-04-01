// src/components/Header.jsx
import { tokens } from "../styles";

export default function Header() {
  return (
    <header style={{
      width: "100%", maxWidth: 720,
      padding: "36px 0 28px",
      borderBottom: `1px solid #252529`,
      marginBottom: 32,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: tokens.mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: tokens.accent }}>
          // AI Writing Tool
        </span>
        <span style={{ fontFamily: tokens.mono, fontSize: 9, color: tokens.muted, background: tokens.surface, border: `1px solid #252529`, padding: "4px 8px", borderRadius: 2 }}>
          v0.2
        </span>
      </div>
      <h1 style={{ fontFamily: tokens.head, fontSize: "clamp(34px,7vw,54px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 10 }}>
        Rewrite{" "}
        <em style={{ fontStyle: "italic", color: tokens.accent, fontWeight: 400, fontFamily: tokens.body }}>
          My Way
        </em>
      </h1>
      <p style={{ fontSize: 14, color: tokens.muted, fontStyle: "italic" }}>
        Paste any text. Pick a voice. Get an instant rewrite — powered by Claude.
      </p>
    </header>
  );
}