// src/hooks/useCustomTones.js
// Saves and retrieves user-defined custom tones from localStorage.

import { useState } from "react";

const STORAGE_KEY = "custom_tones";

export function useCustomTones() {
  const [customTones, setCustomTones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const addTone = (tone) => {
    const id = `custom_${Date.now()}`;
    const newTone = {
      ...tone,
      id,
      color:  tone.color  || "#e8c547",
      bg:     `${tone.color || "#e8c547"}15`,
      border: `${tone.color || "#e8c547"}55`,
      system: `You are a rewriting expert. Rewrite text in the following style: ${tone.description}. Output ONLY the rewritten text, nothing else.`,
      prompt: (text) => `${tone.instructions}\n\nText to rewrite:\n${text}`,
      custom: true,
    };
    const updated = { ...customTones, [id]: newTone };
    setCustomTones(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return id;
  };

  const removeTone = (id) => {
    const updated = { ...customTones };
    delete updated[id];
    setCustomTones(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { customTones, addTone, removeTone };
}