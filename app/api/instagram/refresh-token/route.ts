import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  )

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: 500 })
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000).toISOString()

  console.log('[Instagram] New access token:', data.access_token)
  console.log('[Instagram] Expires at:', expiresAt)

  return NextResponse.json({
    access_token: data.access_token,
    expires_in: data.expires_in,
    expires_at: expiresAt,
  })
}
