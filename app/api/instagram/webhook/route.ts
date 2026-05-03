import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseSection } from '@/lib/hashtagRouter'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_APP_SECRET) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const mediaId: string | undefined =
      body?.entry?.[0]?.changes?.[0]?.value?.media_id

    if (!mediaId) {
      return new NextResponse('OK', { status: 200 })
    }

    const igRes = await fetch(
      `https://graph.instagram.com/${mediaId}?fields=id,caption,media_url,permalink,timestamp&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    )

    if (!igRes.ok) {
      return new NextResponse('OK', { status: 200 })
    }

    const post = await igRes.json()
    const caption: string = post.caption ?? ''
    const section = parseSection(caption)

    if (section) {
      await supabase.from('portfolio_posts').upsert({
        instagram_id: post.id,
        image_url: post.media_url,
        caption: post.caption ?? null,
        section,
        permalink: post.permalink ?? null,
        timestamp: post.timestamp ?? null,
      }, { onConflict: 'instagram_id' })
    }
  } catch {
    // always return 200 so Instagram doesn't retry
  }

  return new NextResponse('OK', { status: 200 })
}
