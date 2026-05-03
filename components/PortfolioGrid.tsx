'use client'

import Image from 'next/image'
import { usePortfolioPosts } from '@/hooks/usePortfolioPosts'

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-surf-border bg-surf-card animate-pulse">
      <div className="bg-surf-inset" style={{ aspectRatio: '1/1' }} />
      <div className="p-4 space-y-2">
        <div className="h-3 w-3/4 bg-surf-border rounded" />
        <div className="h-3 w-1/2 bg-surf-border rounded" />
        <div className="h-3 w-1/3 bg-surf-border rounded mt-3" />
      </div>
    </div>
  )
}

export default function PortfolioGrid({ section }: { section: string }) {
  const { posts, loading, error } = usePortfolioPosts(section)

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {[0, 1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-txt-muted text-sm py-16">
        Failed to load posts. Please try again later.
      </p>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-txt-faint text-4xl mb-4">📷</p>
        <p className="text-txt-primary font-semibold text-sm mb-1">No posts yet</p>
        <p className="text-txt-muted text-xs">
          New {section} work will appear here automatically when posted to Instagram.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      {posts.map(post => (
        <div key={post.id} className="rounded-2xl overflow-hidden border border-surf-border bg-surf-card group shadow-sm">
          <div className="relative overflow-hidden bg-surf-inset" style={{ aspectRatio: '1/1' }}>
            <Image
              src={post.image_url}
              alt={post.caption?.slice(0, 80) ?? 'Instagram post'}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-brand-gold/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.permalink && (
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-txt-primary font-bold text-sm tracking-wide"
                >
                  View on Instagram →
                </a>
              )}
            </div>
          </div>
          <div className="p-4">
            {post.caption && (
              <p className="text-txt-primary text-xs leading-relaxed mb-3 line-clamp-2">
                {post.caption.slice(0, 80)}{post.caption.length > 80 ? '…' : ''}
              </p>
            )}
            {post.permalink && (
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gold-dk text-xs font-semibold hover:underline"
              >
                View on Instagram →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
