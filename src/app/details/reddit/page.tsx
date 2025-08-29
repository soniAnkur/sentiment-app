import { Suspense } from 'react'
import { RedditDetails } from '@/components/details/reddit-details'
import { BackButton } from '@/components/back-button'

export default function RedditPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <BackButton />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold console-text flex items-center gap-3">
          <span className="text-3xl">📱</span>
          REDDIT SENTIMENT ANALYSIS
        </h1>
        <p className="console-text text-muted-foreground mt-2">
          Real-time sentiment analysis from Reddit discussions
        </p>
      </div>

      <Suspense fallback={<RedditDetailsSkeleton />}>
        <RedditDetails />
      </Suspense>
    </main>
  )
}

function RedditDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card h-32 rounded-lg" />
      <div className="glass-card h-48 rounded-lg" />
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
}