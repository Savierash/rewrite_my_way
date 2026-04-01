// src/components/CopyButton.jsx
import { useState } from "react";

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handle} style={{
      background: "transparent",
      border: `1px solid ${copied ? "#34d399" : "#333338"}`,
      borderRadius: 3, padding: "5px 12px",
      fontFamily: "'Syne Mono', monospace",
      fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
      cursor: "pointer", color: copied ? "#34d399" : "#6e6c75",
      transition: "all 0.15s",
    }}>
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}