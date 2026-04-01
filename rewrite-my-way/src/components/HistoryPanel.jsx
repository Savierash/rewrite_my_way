// src/components/HistoryPanel.jsx
import { useState } from "react";

export default function HistoryPanel({ history, onRestore, onRemove, onClear }) {
  const [open, setOpen]         = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const btnBase = {
    background: "transparent",
    border: "1px solid #333338",
    borderRadius: 3,
    padding: "4px 10px",
    fontFamily: "'Syne Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.15s",
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          background: "#141417",
          border: "1px solid #252529",
          borderRight: "none",
          borderRadius: "6px 0 0 6px",
          padding: "14px 10px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 100,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#1e1e22"}
        onMouseLeave={e => e.currentTarget.style.background = "#141417"}
      >
        <span style={{ fontSize: 16 }}>🕐</span>
        {history.length > 0 && (
          <span style={{
            fontFamily: "'Syne Mono', monospace",
            fontSize: 9,
            background: "rgba(232,197,71,0.15)",
            color: "#e8c547",
            padding: "2px 5px",
            borderRadius: 2,
            minWidth: 16,
            textAlign: "center",
          }}>
            {history.length}
          </span>
        )}
        <span style={{
          fontFamily: "'Syne Mono', monospace",
          fontSize: 8,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6e6c75",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}>
          History
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 200,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 380,
        maxWidth: "90vw",
        height: "100vh",
        background: "#0d0d0f",
        borderLeft: "1px solid #252529",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Drawer header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          borderBottom: "1px solid #252529",
          background: "#141417",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🕐</span>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#eae8e3",
            }}>
              Rewrite History
            </span>
            {history.length > 0 && (
              <span style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: 9,
                background: "rgba(232,197,71,0.12)",
                color: "#e8c547",
                padding: "2px 8px",
                borderRadius: 2,
              }}>
                {history.length}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {history.length > 0 && (
              <button
                onClick={onClear}
                style={{ ...btnBase, color: "#e05c4b", borderColor: "#5c2820", fontSize: 9 }}
                onMouseEnter={e => e.currentTarget.style.background = "#1f0e0c"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{ ...btnBase, color: "#6e6c75", padding: "5px 10px", fontSize: 14 }}
              onMouseEnter={e => { e.currentTarget.style.color = "#eae8e3"; e.currentTarget.style.borderColor = "#eae8e3"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#6e6c75"; e.currentTarget.style.borderColor = "#333338"; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Drawer body */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {history.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 12,
              padding: 32,
              textAlign: "center",
            }}>
              <span style={{ fontSize: 32 }}>🕐</span>
              <span style={{
                fontFamily: "'Syne Mono', monospace",
                fontSize: 11,
                color: "#6e6c75",
                lineHeight: 1.6,
              }}>
                No rewrites yet.<br />Your history will appear here.
              </span>
            </div>
          ) : (
            history.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #1a1a1e",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#111114"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15 }}>{entry.toneEmoji}</span>
                    <span style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#eae8e3",
                    }}>
                      {entry.toneLabel}
                    </span>
                    <span style={{
                      fontFamily: "'Syne Mono', monospace",
                      fontSize: 9,
                      color: "#6e6c75",
                    }}>
                      #{history.length - i}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      fontFamily: "'Syne Mono', monospace",
                      fontSize: 9,
                      color: "#6e6c75",
                    }}>
                      {entry.date}
                    </span>
                    <button
                      onClick={() => onRemove(entry.id)}
                      style={{ ...btnBase, color: "#6e6c75", padding: "3px 7px", fontSize: 11, border: "none" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#e05c4b"}
                      onMouseLeave={e => e.currentTarget.style.color = "#6e6c75"}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div style={{
                  fontSize: 13,
                  color: "#9a9890",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  fontFamily: "'Lora', Georgia, serif",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}>
                  "{entry.output.slice(0, 160)}{entry.output.length > 160 ? "..." : ""}"
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => { onRestore(entry); setOpen(false); }}
                    style={{ ...btnBase, color: "#a78bfa", borderColor: "rgba(167,139,250,0.3)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    ↩ Restore
                  </button>
                  <button
                    onClick={() => copy(entry.output, entry.id)}
                    style={{
                      ...btnBase,
                      color: copiedId === entry.id ? "#34d399" : "#6e6c75",
                      borderColor: copiedId === entry.id ? "#34d399" : "#333338",
                    }}
                  >
                    {copiedId === entry.id ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0f; }
        ::-webkit-scrollbar-thumb { background: #252529; border-radius: 2px; }
      `}</style>
    </>
  );
}