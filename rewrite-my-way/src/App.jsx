// src/App.jsx
import { useState, useEffect } from "react";
import { tones } from "./data/tones";
import { useRewrite } from "./hooks/useRewrite";
import { useHistory } from "./hooks/useHistory";
import { useCustomTones } from "./hooks/useCustomTones";
import { s } from "./styles";
import Header from "./components/Header";
import TextInput from "./components/TextInput";
import ToneSelector from "./components/ToneSelector";
import OutputPanel from "./components/OutputPanel";
import HistoryPanel from "./components/HistoryPanel";
import ToneBuilder from "./components/ToneBuilder";

export default function App() {
  const [inputText, setInputText]       = useState("");
  const [selectedTone, setSelectedTone] = useState("genz");
  const [activeTone, setActiveTone]     = useState("genz");
  const [builderOpen, setBuilderOpen]   = useState(false);

  const { output, isLoading, error, streaming, rewrite } = useRewrite();
  const { history, addEntry, removeEntry, clearAll }     = useHistory();
  const { customTones, addTone, removeTone }             = useCustomTones();

  // Auto-save to history when streaming finishes
  useEffect(() => {
    if (!streaming && output) {
      const allTones = { ...tones, ...customTones };
      const tone     = allTones[activeTone];
      addEntry(inputText, output, tone.label, tone.emoji);
    }
  }, [streaming]);

  const handleRewrite = () => {
    const allTones = { ...tones, ...customTones };
    setActiveTone(selectedTone);
    rewrite(inputText, allTones[selectedTone]);
  };

  const handleRestore = (entry) => {
    setInputText(entry.inputText);
  };

  const handleSaveTone = (toneData) => {
    const id = addTone(toneData);
    setSelectedTone(id);
  };

  const handleRemoveCustom = (id) => {
    if (selectedTone === id) setSelectedTone("genz");
    removeTone(id);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Syne+Mono&family=Lora:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
      <div style={s.page}>
        <Header />
        <main style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", gap: 0 }}>
          <TextInput value={inputText} onChange={setInputText} />
          <ToneSelector
            selected={selectedTone}
            onSelect={setSelectedTone}
            customTones={customTones}
            onOpenBuilder={() => setBuilderOpen(true)}
            onRemoveCustom={handleRemoveCustom}
          />
          <button style={s.rewriteBtn(isLoading)} onClick={handleRewrite} disabled={isLoading}>
            {isLoading ? "↻ Rewriting..." : "↳ Rewrite My Text"}
          </button>
          {error && <div style={s.error}>{error}</div>}
          <OutputPanel
            output={output}
            streaming={streaming}
            activeTone={activeTone}
            inputText={inputText}
          />
          <HistoryPanel
            history={history}
            onRestore={handleRestore}
            onRemove={removeEntry}
            onClear={clearAll}
          />
        </main>
      </div>

      {/* Tone Builder Modal */}
      {builderOpen && (
        <ToneBuilder
          onSave={handleSaveTone}
          onClose={() => setBuilderOpen(false)}
        />
      )}
    </>
  );
}