import { GoogleGenAI } from '@google/genai'
import { withAuth } from '@/lib/api-handler'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

type DescriptionPayload = {
  description: string
}

export type DescriptionResponsePayload = {
  summary_text: string
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const POST = withAuth(async (req, _) => {
  try {
    const body = await req.json()
    const { description: fullDescription }: DescriptionPayload = body

    if (typeof fullDescription !== 'string' || !fullDescription) {
      return new Response(JSON.stringify({ error: 'Invalid description' }), {
        status: 400
      })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro-exp-03-25',
      contents: `Give only the 2-sentence summary of the following content, without any intro or explanation: ${fullDescription}`
    })

    if (!response.text)
      return new Response(
        JSON.stringify({ error: 'Invalid response from Google GenAI API.' }),
        { status: 400 }
      )
    const cleanedText = response.text
      .replace(/^.*?:\s*/, '')
      .replace(/\\n/g, '')
      .trim()

    return new Response(JSON.stringify({ summary_text: cleanedText }))
  } catch (error) {
    console.error('Error calling Google GenAI API:', error)
    return new Response(
      JSON.stringify({ error: 'Error calling Google GenAI API.' }),
      {
        status: 500
      }
    )
  }
})
