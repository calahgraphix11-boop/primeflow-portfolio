// Polled every 10 minutes by Vercel cron — see vercel.json
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { parseSection } from '@/lib/hashtagRouter'

interface IGMedia {
  id: string
  caption?: string
  media_url: string
  permalink: string
  timestamp: string
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Missing INSTAGRAM_ACCESS_TOKEN' }, { status: 500 })
  }

  const igRes = await fetch(
    `https://graph.instagram.com/17841459028819199/media?fields=id,caption,media_url,permalink,timestamp&access_token=${token}`
  )

  if (!igRes.ok) {
    const text = await igRes.text()
    return NextResponse.json({ error: 'Instagram API error', detail: text }, { status: 502 })
  }

  const { data: posts }: { data: IGMedia[] } = await igRes.json()

  let synced = 0
  let skipped = 0

  for (const post of posts) {
    const section = parseSection(post.caption ?? '')
    if (!section) { skipped++; continue }

    const { error } = await supabase.from('portfolio_posts').upsert({
      instagram_id: post.id,
      image_url: post.media_url,
      caption: post.caption ?? null,
      section,
      permalink: post.permalink ?? null,
      timestamp: post.timestamp ?? null,
    }, { onConflict: 'instagram_id' })

    if (!error) synced++
  }

  return NextResponse.json({ synced, skipped, total: posts.length })
}
