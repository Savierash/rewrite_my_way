// src/components/ToneSelector.jsx
import { tones as builtInTones } from "../data/tones";
import ToneButton from "./ToneButton";
import { s, tokens } from "../styles";

export default function ToneSelector({ selected, onSelect, customTones, onOpenBuilder, onRemoveCustom }) {
  const allTones   = { ...builtInTones, ...customTones };
  const activeTone = allTones[selected] || builtInTones["genz"];

  return (
    <div style={s.card}>
      <div style={s.cardHead}>
        <span style={s.stepNum}>02</span>
        <span style={s.stepName}>Choose a Voice</span>
      </div>
      <div style={s.cardBody}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
        }}>
          {/* Built-in tones */}
          {Object.entries(builtInTones).map(([id, tone]) => (
            <ToneButton key={id} id={id} tone={tone} isActive={selected === id} onClick={onSelect} />
          ))}

          {/* Custom tones */}
          {Object.entries(customTones).map(([id, tone]) => (
            <div key={id} style={{ position: "relative" }}>
              <ToneButton id={id} tone={tone} isActive={selected === id} onClick={onSelect} />
              {/* Remove custom tone */}
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveCustom(id); }}
                style={{
                  position: "absolute", top: 3, right: 3,
                  width: 14, height: 14,
                  background: "#1a1a1e", border: "1px solid #333338",
                  borderRadius: "50%", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne Mono', monospace", fontSize: 8, color: "#6e6c75",
                  lineHeight: 1, padding: 0,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e05c4b"; e.currentTarget.style.borderColor = "#e05c4b"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6e6c75"; e.currentTarget.style.borderColor = "#333338"; }}
              >
                ✕
              </button>
            </div>
          ))}

          {/* Add custom tone button */}
          <button
            onClick={onOpenBuilder}
            style={{
              background: "transparent",
              border: "1px dashed #333338",
              borderRadius: 4,
              padding: "13px 8px 11px",
              cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6,
              outline: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8c547"; e.currentTarget.style.background = "rgba(232,197,71,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#333338"; e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 20, color: "#6e6c75" }}>＋</span>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.04em", textTransform: "uppercase", color: "#6e6c75",
            }}>
              Custom
            </span>
          </button>
        </div>

        {/* Active tone detail */}
        <div style={{
          marginTop: 12, padding: "12px 14px",
          background: tokens.surface, border: `1px solid #252529`,
          borderRadius: 4, display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeTone.color, flexShrink: 0, marginTop: 5, display: "inline-block" }} />
          <span style={{ fontSize: 13, color: tokens.muted, fontStyle: "italic", lineHeight: 1.55 }}>
            {activeTone.detail || activeTone.description}
          </span>
        </div>
      </div>
    </div>
  );
}