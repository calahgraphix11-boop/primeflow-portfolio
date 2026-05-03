'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { PortfolioPost } from '@/lib/supabase'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function usePortfolioPosts(section: string) {
  const [posts, setPosts] = useState<PortfolioPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPosts() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('portfolio_posts')
        .select('*')
        .eq('section', section)
        .order('timestamp', { ascending: false })

      if (cancelled) return

      if (error) {
        setError(error.message)
      } else {
        setPosts(data ?? [])
      }
      setLoading(false)
    }

    fetchPosts()

    const channel = supabase
      .channel(`portfolio_posts:section=${section}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_posts',
          filter: `section=eq.${section}`,
        },
        () => { fetchPosts() }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [section])

  return { posts, loading, error }
}
