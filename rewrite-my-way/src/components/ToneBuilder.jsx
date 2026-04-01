// src/components/ToneBuilder.jsx
import { useState } from "react";

const COLORS = [
  "#e8c547", "#a78bfa", "#60a5fa", "#f472b6",
  "#fb923c", "#34d399", "#e05c4b", "#38bdf8",
];

const EMOJI_OPTIONS = [
  "🎯","🔥","💎","🌊","⚡","🎭","🦁","🌙",
  "🎪","🧠","💫","🎨","🚀","🌿","👑","🎸",
];

export default function ToneBuilder({ onSave, onClose }) {
  const [form, setForm] = useState({
    label:        "",
    emoji:        "🎯",
    color:        "#e8c547",
    description:  "",
    instructions: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.label.trim())        return setError("Please enter a tone name.");
    if (!form.description.trim())  return setError("Please enter a description.");
    if (!form.instructions.trim()) return setError("Please enter rewrite instructions.");
    setError("");
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const inputStyle = {
    width: "100%",
    background: "#0d0d0f",
    border: "1px solid #252529",
    borderRadius: 4,
    padding: "10px 14px",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 13,
    color: "#eae8e3",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    fontFamily: "'Syne Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#6e6c75",
    marginBottom: 6,
    display: "block",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 400,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 480,
        maxWidth: "92vw",
        maxHeight: "88vh",
        overflowY: "auto",
        background: "#0d0d0f",
        border: "1px solid #252529",
        borderRadius: 8,
        zIndex: 500,
        animation: "slideUp 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px",
          borderBottom: "1px solid #252529",
          background: "#141417",
          position: "sticky", top: 0, zIndex: 1,
        }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: "#eae8e3" }}>
              Build a Custom Tone
            </div>
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: "#6e6c75", marginTop: 3, letterSpacing: "0.1em" }}>
              Define your own rewriting voice
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "1px solid #333338",
              borderRadius: 3, padding: "5px 10px", cursor: "pointer",
              fontFamily: "'Syne Mono', monospace", fontSize: 13, color: "#6e6c75",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#eae8e3"; e.currentTarget.style.borderColor = "#eae8e3"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6e6c75"; e.currentTarget.style.borderColor = "#333338"; }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Name + Emoji row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
            <div>
              <label style={labelStyle}>Tone Name</label>
              <input
                style={inputStyle}
                placeholder="e.g. Shakespeare, Valley Girl..."
                value={form.label}
                onChange={e => set("label", e.target.value)}
                onFocus={e => e.target.style.borderColor = "#333338"}
                onBlur={e => e.target.style.borderColor = "#252529"}
              />
            </div>
            <div>
              <label style={labelStyle}>Emoji</label>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                gap: 4,
              }}>
                {EMOJI_OPTIONS.map(em => (
                  <button
                    key={em}
                    onClick={() => set("emoji", em)}
                    style={{
                      background: form.emoji === em ? "rgba(232,197,71,0.12)" : "transparent",
                      border: `1px solid ${form.emoji === em ? "#e8c547" : "#252529"}`,
                      borderRadius: 3, padding: "5px",
                      cursor: "pointer", fontSize: 14, lineHeight: 1,
                      transition: "all 0.15s",
                    }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => set("color", c)}
                  style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: c,
                    border: `2px solid ${form.color === c ? "#eae8e3" : "transparent"}`,
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    outline: "none",
                    boxShadow: form.color === c ? `0 0 0 2px #0d0d0f, 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description <span style={{ color: "#6e6c75", textTransform: "none", letterSpacing: 0 }}>(shown in tone selector)</span></label>
            <input
              style={inputStyle}
              placeholder="e.g. Dramatic, poetic, Elizabethan flair..."
              value={form.description}
              onChange={e => set("description", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#333338"}
              onBlur={e => e.target.style.borderColor = "#252529"}
            />
          </div>

          {/* Instructions */}
          <div>
            <label style={labelStyle}>
              Rewrite Instructions <span style={{ color: "#6e6c75", textTransform: "none", letterSpacing: 0 }}>(sent to AI)</span>
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: "vertical", lineHeight: 1.6 }}
              placeholder={`e.g. Rewrite this text in Shakespearean English. Use "thee", "thou", "dost", "wherefore". Keep iambic rhythm where possible. Preserve the original meaning.`}
              value={form.instructions}
              onChange={e => set("instructions", e.target.value)}
              onFocus={e => e.target.style.borderColor = "#333338"}
              onBlur={e => e.target.style.borderColor = "#252529"}
            />
            <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: 9, color: "#6e6c75", marginTop: 6 }}>
              Be specific — the more detail you give, the better the rewrite.
            </div>
          </div>

          {/* Preview badge */}
          {form.label && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px",
              background: `${form.color}10`,
              border: `1px solid ${form.color}40`,
              borderRadius: 4,
            }}>
              <span style={{ fontSize: 18 }}>{form.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: form.color }}>
                  {form.label}
                </div>
                {form.description && (
                  <div style={{ fontFamily: "'Lora', serif", fontSize: 11, color: "#6e6c75", fontStyle: "italic", marginTop: 2 }}>
                    {form.description}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: "10px 14px",
              background: "#1f0e0c", border: "1px solid #5c2820", borderRadius: 4,
              fontFamily: "'Syne Mono', monospace", fontSize: 11, color: "#e05c4b",
            }}>
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            style={{
              width: "100%",
              background: saved ? "#34d399" : form.color,
              color: "#0d0d0f",
              border: "none", borderRadius: 6,
              padding: "14px",
              fontFamily: "'Syne', sans-serif",
              fontSize: 12, fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            {saved ? "✓ Tone Saved!" : `+ Save "${form.label || "My Tone"}"`}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translate(-50%,-48%)} to{opacity:1;transform:translate(-50%,-50%)} }
      `}</style>
    </>
  );
}