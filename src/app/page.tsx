import { Suspense } from 'react'
import { SentimentDashboard } from '@/components/sentiment-dashboard'
import { RefreshButton } from '@/components/refresh-button'
import { Header } from '@/components/header'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <Header />
      
      <Suspense fallback={<DashboardSkeleton />}>
        <SentimentDashboard />
      </Suspense>
      
      <RefreshButton />
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card h-32 rounded-lg" />
      <div className="glass-card h-48 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card h-24 rounded-lg" />
        ))}
      </div>
      <div className="glass-card h-64 rounded-lg" />
    </div>
  )
}
