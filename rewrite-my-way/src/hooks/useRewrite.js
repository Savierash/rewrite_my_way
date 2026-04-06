// src/hooks/useRewrite.js
import { useState, useRef, useCallback } from "react";
import { API_URL } from "../config";

export function useRewrite() {
  const [output, setOutput]     = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState("");
  const [streaming, setStream]  = useState(false);
  const isLoadingRef            = useRef(false);

  const rewrite = useCallback(async (inputText, tone) => {
    const text = inputText.trim();
    setError("");
    setOutput("");

    if (!text)              return setError("Please enter some text first.");
    if (text.length > 4000) return setError("Text is too long. Keep it under 4,000 characters.");
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    setStream(true);

    try {
      console.log("Sending request to:", API_URL);

      const res = await fetch(API_URL, {   // ← uses config, works on mobile + desktop
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream:     true,
          system:     tone.system,
          messages:   [{ role: "user", content: tone.prompt(text) }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API error ${res.status}: ${errBody}`);
      }

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
              setOutput(full);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error("Rewrite error:", err.message);
      setError(`Something went wrong: ${err.message}`);
      setOutput("");
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setStream(false);
    }
  }, []);

  return { output, isLoading, error, streaming, rewrite };
}