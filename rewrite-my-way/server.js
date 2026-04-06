export const handler = async (event) => {
  const API_KEY = process.env.GROQ_API_KEY;

  // 1. Handle CORS (Same as your server.js)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const parsed = JSON.parse(event.body);

    // 2. Fetch from Groq (Streaming is tricky in Functions, so we fetch the full result here)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        stream: false, // Standard functions work best without stream
        max_tokens: 1000,
        messages: [
          { role: 'system', content: parsed.system },
          { role: 'user',   content: parsed.messages[0].content },
        ],
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    // 3. Return in the "Anthropic" format your frontend expects
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        type: 'content_block_delta',
        delta: { text }
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
