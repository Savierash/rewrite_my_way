// src/hooks/useHistory.js
// Saves and retrieves rewrite history from localStorage.

import { useState } from "react";

const STORAGE_KEY = "rewrite_history";
const MAX_ITEMS   = 20;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addEntry = (inputText, output, toneLabel, toneEmoji) => {
    const entry = {
      id:        Date.now(),
      date:      new Date().toLocaleString(),
      inputText,
      output,
      toneLabel,
      toneEmoji,
    };
    const updated = [entry, ...history].slice(0, MAX_ITEMS);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeEntry = (id) => {
    const updated = history.filter(e => e.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addEntry, removeEntry, clearAll };
}