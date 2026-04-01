// src/components/OutputPanel.jsx
import { useState } from "react";
import { tones } from "../data/tones";
import CopyButton from "./CopyButton";
import CompareView from "./CompareView";
import { Document, Paragraph, TextRun, Packer } from "docx";

function DownloadButton({ text, toneLabel }) {
  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewrite-${toneLabel.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: `Rewritten in ${toneLabel} tone`, bold: true, size: 28 })],
          }),
          new Paragraph({ text: "" }),
          ...text.split("\n").map(
            (line) => new Paragraph({ children: [new TextRun({ text: line, size: 24 })] })
          ),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewrite-${toneLabel.toLowerCase()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnStyle = {
    background: "transparent",
    border: "1px solid #333338",
    borderRadius: 3,
    padding: "5px 12px",
    fontFamily: "'Syne Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    color: "#6e6c75",
    transition: "all 0.15s",
  };

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button style={btnStyle}
        onMouseEnter={e => { e.target.style.color = "#eae8e3"; e.target.style.borderColor = "#eae8e3"; }}
        onMouseLeave={e => { e.target.style.color = "#6e6c75"; e.target.style.borderColor = "#333338"; }}
        onClick={downloadTxt}>↓ .txt</button>
      <button style={btnStyle}
        onMouseEnter={e => { e.target.style.color = "#eae8e3"; e.target.style.borderColor = "#eae8e3"; }}
        onMouseLeave={e => { e.target.style.color = "#6e6c75"; e.target.style.borderColor = "#333338"; }}
        onClick={downloadDocx}>↓ .docx</button>
    </div>
  );
}

export default function OutputPanel({ output, streaming, activeTone, inputText }) {
  const [compareMode, setCompareMode] = useState(false);
  if (!output && !streaming) return null;
  const tone = tones[activeTone];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 18px",
        background: "#141417",
        border: "1px solid #252529",
        borderRadius: compareMode ? "6px 6px 0 0" : "6px 6px 0 0",
        borderBottom: "1px solid #252529",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "'Syne Mono', monospace", fontSize: 10,
          letterSpacing: "0.12em", textTransform: "uppercase", color: tone.color,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: tone.color, display: "inline-block" }} />
          {tone.emoji} {tone.label}
        </span>

        {!streaming && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Compare toggle */}
            <button
              onClick={() => setCompareMode(m => !m)}
              style={{
                background: compareMode ? "rgba(232,197,71,0.1)" : "transparent",
                border: `1px solid ${compareMode ? "#e8c547" : "#333338"}`,
                borderRadius: 3,
                padding: "5px 12px",
                fontFamily: "'Syne Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                color: compareMode ? "#e8c547" : "#6e6c75",
                transition: "all 0.15s",
              }}
            >
              {compareMode ? "↑ collapse" : "↔ compare"}
            </button>
            <DownloadButton text={output} toneLabel={tone.label} />
            <CopyButton text={output} />
          </div>
        )}
      </div>

      {/* Body */}
      {compareMode ? (
        <CompareView
          original={inputText}
          rewritten={output}
          toneColor={tone.color}
          toneLabel={tone.label}
          toneEmoji={tone.emoji}
        />
      ) : (
        <div style={{
          padding: "20px", fontSize: 15, lineHeight: 1.75,
          color: "#eae8e3", whiteSpace: "pre-wrap", wordBreak: "break-word",
          background: "#0d0d0f", minHeight: 80,
          border: "1px solid #252529",
          borderTop: "none",
          borderRadius: "0 0 6px 6px",
        }}>
          {output}
          {streaming && (
            <span style={{
              display: "inline-block", width: 2, height: "1em",
              background: "#e8c547", marginLeft: 2,
              verticalAlign: "text-bottom",
              animation: "blink 0.65s steps(1) infinite",
            }} />
          )}
        </div>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}