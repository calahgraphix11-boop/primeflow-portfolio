import { createClient } from '@supabase/supabase-js'

export type PortfolioPost = {
  id: string
  instagram_id: string
  image_url: string
  caption: string | null
  section: string
  permalink: string | null
  timestamp: string | null
  created_at: string
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
