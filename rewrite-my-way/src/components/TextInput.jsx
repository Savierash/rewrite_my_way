// src/components/TextInput.jsx
import { s } from "../styles";

export default function TextInput({ value, onChange }) {
  return (
    <div style={s.card}>
      <div style={s.cardHead}>
        <span style={s.stepNum}>01</span>
        <span style={s.stepName}>Your Text</span>
      </div>
      <div style={s.cardBody}>
        <textarea
          style={s.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type anything — an email, caption, bio, LinkedIn post..."
        />
        <p style={s.charCount}>
          {value.length === 0 ? "0 characters" : `${value.length.toLocaleString()} characters`}
        </p>
      </div>
    </div>
  );
}