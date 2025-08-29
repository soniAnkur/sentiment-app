import { Suspense } from 'react'
import { NeutralDetails } from '@/components/details/neutral-details'
import { BackButton } from '@/components/back-button'

export const metadata = {
  title: 'Neutral Sentiment Details | STOCK\'er',
  description: 'Detailed analysis of neutral sentiment data',
}

export default function NeutralDetailsPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl">
      <BackButton />
      
      <div className="text-center mb-8 pt-6">
        <h1 className="console-text text-2xl font-bold status-neutral animate-pulse-glow mb-2">
          {">>> NEUTRAL_ANALYSIS.exe"}
        </h1>
        <div className="console-text text-sm text-muted-foreground">
          SYSTEM_STATUS: Equilibrium Analysis Mode
        </div>
      </div>

      <Suspense fallback={<DetailsSkeleton />}>
        <NeutralDetails />
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