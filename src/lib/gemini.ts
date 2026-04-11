// GEMINI API — Bao
// Exports askGemini() which streams a response from Gemini 2.0 Flash.
// Set VITE_GEMINI_API_KEY in your .env file.
// Usage: await askGemini(prompt, chunk => appendToUI(chunk))

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent'

export class GeminiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'GeminiError'
  }
}

/**
 * Send a prompt to Gemini and stream the response back.
 * @param prompt     - the full prompt string
 * @param onChunk    - called with each text chunk as it streams in
 * @returns          - the full assembled response
 */
export async function askGemini(
  prompt: string,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (!API_KEY) {
    throw new GeminiError(
      'Missing VITE_GEMINI_API_KEY. Add it to your .env file.',
    )
  }

  const res = await fetch(`${GEMINI_URL}?key=${API_KEY}&alt=sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      systemInstruction: {
        parts: [
          {
            text: 'You are a Git tutor for beginners. Keep answers concise, practical, and accurate. When debugging commands: explain what failed, why it failed, and the next command to run. Prefer short step-by-step guidance.',
          },
        ],
      },
    }),
  })

  if (!res.ok) {
    throw new GeminiError(`Gemini API error: ${res.statusText}`, res.status)
  }

  const reader = res.body?.getReader()
  if (!reader) throw new GeminiError('No response body')

  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    for (const line of decoder.decode(value, { stream: true }).split('\n')) {
      if (!line.startsWith('data: ')) continue
      const json = line.slice(6).trim()
      if (!json || json === '[DONE]') continue
      try {
        const chunk: string =
          JSON.parse(json)?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (chunk) {
          fullText += chunk
          onChunk?.(chunk)
        }
      } catch {
        // skip malformed SSE chunks
      }
    }
  }

  return fullText
}
