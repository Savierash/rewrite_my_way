// server.js
import 'dotenv/config'
import { createServer } from 'http'

const API_KEY    = process.env.GROQ_API_KEY
const PORT       = process.env.PORT || 3001        // ← Render sets PORT automatically
const RENDER_URL = "https://rewrite-my-way-server.onrender.com"

console.log('API Key:', API_KEY ? '✓ loaded' : '✗ MISSING')

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/v1/messages') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        console.log('→ Forwarding request to Groq...')

        const parsed = JSON.parse(body)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model:      'llama-3.3-70b-versatile',
            stream:     true,
            max_tokens: 1000,
            messages: [
              { role: 'system', content: parsed.system },
              { role: 'user',   content: parsed.messages[0].content },
            ],
          }),
        })

        console.log('← Groq responded:', response.status)

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.writeHead(200)

        const reader  = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (!data || data === '[DONE]') continue

            try {
              const chunk = JSON.parse(data)
              const text  = chunk?.choices?.[0]?.delta?.content
              if (text) {
                const anthropicChunk = JSON.stringify({
                  type:  'content_block_delta',
                  delta: { text },
                })
                res.write(`data: ${anthropicChunk}\n\n`)
              }
            } catch {}
          }
        }

        res.end()
      } catch (err) {
        console.error('✗ Error:', err.message)
        res.writeHead(500)
        res.end(JSON.stringify({ error: err.message }))
      }
    })
  } else {
    res.writeHead(404)
    res.end()
  }
}).listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)

  // Keep Render alive — ping every 10 minutes
  setInterval(async () => {
    try {
      await fetch(RENDER_URL)
      console.log('✓ Keep-alive ping sent')
    } catch {}
  }, 10 * 60 * 1000)
})