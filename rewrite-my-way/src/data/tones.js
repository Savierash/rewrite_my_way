// src/data/tones.js
// All tone definitions — label, colors, AI system prompt, and user prompt builder.
// To add a new tone: add an entry here. Nothing else needs to change.

export const tones = {
  genz: {
    label: "Gen Z",
    emoji: "💀",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.35)",
    detail: "Lowkey chaotic, chronically online energy — slang used naturally, short punchy sentences, zero filter.",
    system: "You are a Gen Z content rewriter. Output ONLY the rewritten text, nothing else.",
    prompt: (text) => `Rewrite in genuine Gen Z voice. Use slang naturally (no cap, lowkey, fr, slay, bestie, it's giving). Short punchy sentences. Keep the core message intact.\n\nText: ${text}`,
  },
  corporate: {
    label: "Corporate",
    emoji: "📋",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.35)",
    detail: "Polished, formal, synergy-approved. Structured paragraphs, business jargon, authoritative tone.",
    system: "You are a corporate communications expert. Output ONLY the rewritten text, nothing else.",
    prompt: (text) => `Rewrite as professional corporate communication. Use formal language, business jargon (leverage, align, stakeholders, deliverables). Preserve all meaning.\n\nText: ${text}`,
  },
  trendy: {
    label: "Trendy",
    emoji: "✨",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.35)",
    detail: "That girl energy meets aesthetic influencer. Curated, intentional, aspirational — very now.",
    system: "You are a lifestyle content writer. Output ONLY the rewritten text, nothing else.",
    prompt: (text) => `Rewrite in a trendy aspirational lifestyle voice. Think wellness influencer. Use "it's giving", "the vibe is", "main character" sparingly. Keep core message intact.\n\nText: ${text}`,
  },
  hemingway: {
    label: "Hemingway",
    emoji: "🥃",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.35)",
    detail: "Short sentences. No adverbs. The iceberg principle — say less, mean more.",
    system: "You are a minimalist editor in the Hemingway style. Output ONLY the rewritten text, nothing else.",
    prompt: (text) => `Rewrite in Hemingway style. Short declarative sentences. Cut every adverb. No passive voice. No filler. Preserve all meaning.\n\nText: ${text}`,
  },
  pirate: {
    label: "Pirate",
    emoji: "🏴‍☠️",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.35)",
    detail: "Arr, the message stays true but the voice be swashbuckling. A certified virality engine.",
    system: "You are a pirate rewriter. Output ONLY the rewritten text, nothing else.",
    prompt: (text) => `Rewrite in pirate voice. Use: Arr, ye, aye, matey, blimey. Replace "you"→"ye", "my"→"me". Keep core message fully intact and readable.\n\nText: ${text}`,
  },
};