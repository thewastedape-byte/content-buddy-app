import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CONTENT_TYPE_DESCRIPTIONS: Record<string, string> = {
  youtube_script: 'YouTube Script: A full, engaging video script with hook, body sections, and a call-to-action. Include [timestamps], stage directions like [CUT TO:], and natural speaking language. Aim for a 5-8 minute video.',
  blog_post: 'Blog Post: A well-structured, SEO-friendly blog post with H2 subheadings, intro paragraph, body sections, and conclusion. Aim for 600-900 words. Use markdown-style formatting with ## for headings.',
  youtube_titles: 'YouTube Title Options: 5 click-worthy YouTube title options using proven formulas (curiosity gaps, numbers, how-tos, controversy). One per line, no numbering.',
  youtube_description: 'YouTube Description: A YouTube video description with a compelling first 2 lines (shown before "show more"), timestamps section, what you\'ll learn bullet points, and a subscribe CTA. Include relevant hashtags at the end.',
  instagram_caption: 'Instagram Caption: An engaging Instagram caption with a strong hook on the first line, value-packed body, and 3-5 relevant hashtags. Include a call-to-action. Keep it authentic and conversational.',
  tiktok_script: 'TikTok Script: A 60-second TikTok video script with a pattern-interrupt hook in the first 3 seconds, fast-paced content, and a strong ending. Include [TEXT ON SCREEN] cues and [VISUAL] directions.',
  twitter_thread: 'Twitter Thread: A 6-8 tweet thread. Tweet 1 is the hook (standalone compelling statement). Each subsequent tweet adds value. End with a summary tweet. Format as: Tweet 1: [content] Tweet 2: [content] etc.',
  linkedin_post: 'LinkedIn Post: A professional LinkedIn post with a personal story hook, value-driven insights, and a question to drive engagement. Use line breaks for readability. 150-300 words.',
  email_newsletter: 'Email Newsletter: A complete email newsletter with subject line, preview text, greeting, valuable main content, one clear CTA, and sign-off. Casual-professional tone. Include: Subject: and Preview: at the top.',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, contentTypes } = body

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 })
    }

    if (!contentTypes || !Array.isArray(contentTypes) || contentTypes.length === 0) {
      return NextResponse.json({ error: 'At least one content type is required.' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured.' }, { status: 500 })
    }

    // Build the prompt
    const selectedDescriptions = contentTypes
      .map(type => CONTENT_TYPE_DESCRIPTIONS[type])
      .filter(Boolean)
      .join('\n\n')

    const systemPrompt = `You are ContentBuddy, an expert content creator and copywriter. 
You create platform-optimized content that is engaging, authentic, and designed to perform.
Always respond with a valid JSON object — nothing else. No markdown code blocks, no explanation.`

    const userPrompt = `Create content for the following topic:

TOPIC: "${topic}"

Generate the following content types. Return a JSON object where each key is the content type identifier and the value is the full content string.

Content types to generate:
${selectedDescriptions}

JSON keys to use (use exactly these keys):
${contentTypes.join(', ')}

Return ONLY a valid JSON object with the content. Example format:
{
  "youtube_script": "...",
  "blog_post": "..."
}

Make each piece of content complete, high-quality, and ready to use. Be specific and relevant to the topic.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'No content generated.' }, { status: 500 })
    }

    let results: Record<string, string>
    try {
      results = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Failed to parse generated content.' }, { status: 500 })
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Generate API error:', error)
    const message = error?.message || 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
