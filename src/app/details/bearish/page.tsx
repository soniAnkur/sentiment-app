import { Suspense } from 'react'
import { BearishDetails } from '@/components/details/bearish-details'
import { BackButton } from '@/components/back-button'

export const metadata = {
  title: 'Bearish Sentiment Details | VIBE AI',
  description: 'Detailed analysis of bearish sentiment data',
}

export default function BearishDetailsPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <BackButton />
      
      <div className="text-center mb-8 pt-6">
        <h1 className="console-text text-2xl font-bold text-destructive animate-pulse-glow mb-2">
          {">>> BEARISH_ANALYSIS.exe"}
        </h1>
        <div className="console-text text-sm text-muted-foreground">
          SYSTEM_STATUS: Risk Analysis Mode
        </div>
      </div>

      <Suspense fallback={<DetailsSkeleton />}>
        <BearishDetails />
      </Suspense>
    </main>
  )
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card h-32 rounded-lg" />
      <div className="glass-card h-64 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card h-48 rounded-lg" />
        ))}
      </div>
    </div>
  )
}