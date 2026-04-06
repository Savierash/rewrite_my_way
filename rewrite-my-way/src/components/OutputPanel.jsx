// src/components/OutputPanel.jsx
import { useState } from "react";
import { tones } from "../data/tones";
import CopyButton from "./CopyButton";
import CompareView from "./CompareView";
import { Document, Paragraph, TextRun, Packer } from "docx";

function DownloadButton({ text, toneLabel }) {
  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
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
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `rewrite-${toneLabel.toLowerCase()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btnStyle = {
    background: "transparent",
    border: "1px solid #333338",
    borderRadius: 3, padding: "5px 12px",
    fontFamily: "'Syne Mono', monospace",
    fontSize: 9, letterSpacing: "0.12em",
    textTransform: "uppercase", cursor: "pointer",
    color: "#6e6c75", transition: "all 0.15s",
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

// Inline translation logic — no separate component needed
function useTranslation() {
  const [selectedLang, setSelectedLang] = useState("");
  const [translated,   setTranslated]   = useState("");
  const [isLoading,    setLoading]      = useState(false);
  const [streaming,    setStreaming]     = useState(false);
  const [error,        setError]        = useState("");

  const translate = async (sourceText, langCode, langLabel) => {
    setSelectedLang(langCode);
    setTranslated("");
    setError("");
    setLoading(true);
    setStreaming(true);

    try {
      const res = await fetch("http://localhost:3001/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream:     true,
          system:     `You are a professional translator. Translate text accurately to ${langLabel}. Output ONLY the translated text, nothing else.`,
          messages:   [{ role: "user", content: `Translate this to ${langLabel}:\n\n${sourceText}` }],
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "", full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              full += parsed.delta.text;
              setTranslated(full);
            }
          } catch {}
        }
      }
    } catch (err) {
      setError(`Translation failed: ${err.message}`);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  return { selectedLang, translated, isLoading, streaming, error, translate };
}

const LANGUAGES = [
  { code: "es", label: "Spanish",    flag: "🇪🇸" },
  { code: "fr", label: "French",     flag: "🇫🇷" },
  { code: "de", label: "German",     flag: "🇩🇪" },
  { code: "it", label: "Italian",    flag: "🇮🇹" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "ja", label: "Japanese",   flag: "🇯🇵" },
  { code: "ko", label: "Korean",     flag: "🇰🇷" },
  { code: "zh", label: "Chinese",    flag: "🇨🇳" },
  { code: "ar", label: "Arabic",     flag: "🇸🇦" },
  { code: "hi", label: "Hindi",      flag: "🇮🇳" },
  { code: "ru", label: "Russian",    flag: "🇷🇺" },
  { code: "tl", label: "Filipino",   flag: "🇵🇭" },
  { code: "id", label: "Indonesian", flag: "🇮🇩" },
  { code: "th", label: "Thai",       flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", flag: "🇻🇳" },
];

export default function OutputPanel({ output, streaming, activeTone, inputText, customTones = {} }) {
  const [compareMode,  setCompareMode]  = useState(false);
  const [translateMode, setTranslateMode] = useState(false);
  const [copiedTx,     setCopiedTx]     = useState(false);

  const {
    selectedLang, translated, isLoading: txLoading,
    streaming: txStreaming, error: txError, translate,
  } = useTranslation();

  if (!output && !streaming) return null;

  const allTones  = { ...tones, ...customTones };
  const tone      = allTones[activeTone] || tones["genz"];
  const activeLang = LANGUAGES.find(l => l.code === selectedLang);

  const copyTx = () => {
    navigator.clipboard.writeText(translated).then(() => {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    });
  };

  const colHead = (color) => ({
    padding: "11px 18px",
    background: "#141417",
    borderBottom: "1px solid #252529",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 42,
    fontFamily: "'Syne Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: color || "#6e6c75",
  });

  const colBody = {
    padding: "20px",
    fontSize: 15,
    lineHeight: 1.75,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "'Lora', Georgia, serif",
    minHeight: 120,
    background: "#0d0d0f",
    color: "#eae8e3",
  };

  const btnStyle = {
    background: "transparent",
    border: "1px solid #333338",
    borderRadius: 3, padding: "5px 12px",
    fontFamily: "'Syne Mono', monospace",
    fontSize: 9, letterSpacing: "0.12em",
    textTransform: "uppercase", cursor: "pointer",
    color: "#6e6c75", transition: "all 0.15s",
  };

  return (
    <div style={{ marginBottom: 12 }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 18px",
        background: "#141417",
        border: "1px solid #252529",
        borderRadius: "6px 6px 0 0",
        borderBottom: "1px solid #252529",
      }}>
        {/* Tone badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "'Syne Mono', monospace", fontSize: 10,
          letterSpacing: "0.12em", textTransform: "uppercase", color: tone.color,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: tone.color, display: "inline-block" }} />
          {tone.emoji} {tone.label}
        </span>

        {/* Actions */}
        {!streaming && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Compare toggle */}
            <button
              onClick={() => { setCompareMode(m => !m); setTranslateMode(false); }}
              style={{
                ...btnStyle,
                background: compareMode ? "rgba(232,197,71,0.1)" : "transparent",
                borderColor: compareMode ? "#e8c547" : "#333338",
                color: compareMode ? "#e8c547" : "#6e6c75",
              }}
            >
              {compareMode ? "↑ collapse" : "↔ compare"}
            </button>

            {/* Translate toggle */}
            <button
              onClick={() => { setTranslateMode(m => !m); setCompareMode(false); }}
              style={{
                ...btnStyle,
                background: translateMode ? "rgba(96,165,250,0.1)" : "transparent",
                borderColor: translateMode ? "#60a5fa" : "#333338",
                color: translateMode ? "#60a5fa" : "#6e6c75",
              }}
            >
              {translateMode ? "↑ collapse" : "🌐 translate"}
            </button>

            <DownloadButton text={output} toneLabel={tone.label} />
            <CopyButton text={output} />
          </div>
        )}
      </div>

      {/* ── Compare mode ── */}
      {compareMode && (
        <CompareView
          original={inputText}
          rewritten={output}
          toneColor={tone.color}
          toneLabel={tone.label}
          toneEmoji={tone.emoji}
        />
      )}

      {/* ── Translate mode — side by side ── */}
      {translateMode && !compareMode && (
        <>
          {/* Language picker bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px",
            background: "#141417",
            borderLeft: "1px solid #252529",
            borderRight: "1px solid #252529",
            borderBottom: "1px solid #252529",
          }}>
            <span style={{
              fontFamily: "'Syne Mono', monospace", fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#6e6c75",
            }}>
              🌐 Pick a language
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {translated && !txStreaming && (
                <button
                  style={{
                    ...btnStyle,
                    color: copiedTx ? "#34d399" : "#6e6c75",
                    borderColor: copiedTx ? "#34d399" : "#333338",
                  }}
                  onClick={copyTx}
                >
                  {copiedTx ? "Copied ✓" : "Copy translation"}
                </button>
              )}
              <select
                value={selectedLang}
                onChange={e => {
                  const lang = LANGUAGES.find(l => l.code === e.target.value);
                  if (lang) translate(output, lang.code, lang.label);
                }}
                disabled={txLoading}
                style={{
                  background: "#0d0d0f",
                  border: "1px solid #333338",
                  borderRadius: 3,
                  padding: "5px 10px",
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: 9, letterSpacing: "0.1em",
                  color: selectedLang ? "#eae8e3" : "#6e6c75",
                  cursor: txLoading ? "not-allowed" : "pointer",
                  outline: "none",
                }}
              >
                <option value="" disabled>🌐 Select language...</option>
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by side */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "#252529", // column divider
            border: "1px solid #252529",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            overflow: "hidden",
            gap: 1,
          }}>
            {/* Left — Rewrite */}
            <div>
              <div style={colHead(tone.color)}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: tone.color, display: "inline-block" }} />
                  {tone.emoji} {tone.label}
                </span>
              </div>
              <div style={colBody}>{output}</div>
            </div>

            {/* Right — Translation */}
            <div>
              <div style={colHead(activeLang ? "#60a5fa" : "#6e6c75")}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {activeLang ? (
                    <>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
                      {activeLang.flag} {activeLang.label}
                    </>
                  ) : "🌐 Translation"}
                </span>
                {txLoading && (
                  <span style={{ fontSize: 9, color: "#6e6c75" }}>translating...</span>
                )}
              </div>
              <div style={{ ...colBody, color: translated ? "#eae8e3" : "#6e6c75" }}>
                {txError ? (
                  <span style={{ color: "#e05c4b", fontFamily: "'Syne Mono', monospace", fontSize: 11 }}>
                    {txError}
                  </span>
                ) : translated ? (
                  <>
                    {translated}
                    {txStreaming && (
                      <span style={{
                        display: "inline-block", width: 2, height: "1em",
                        background: "#e8c547", marginLeft: 2,
                        verticalAlign: "text-bottom",
                        animation: "blink 0.65s steps(1) infinite",
                      }} />
                    )}
                  </>
                ) : (
                  <span style={{ fontStyle: "italic", fontSize: 13 }}>
                    Select a language to see the translation here.
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Normal output (no mode active) ── */}
      {!compareMode && !translateMode && (
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