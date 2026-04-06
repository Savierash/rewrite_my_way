// src/config.js
const isProd = import.meta.env.PROD;

export const API_URL = isProd
  ? "https://rewrite-my-way-server.onrender.com/api/v1/messages"  // ← your Render URL
  : "http://localhost:3001/api/v1/messages";