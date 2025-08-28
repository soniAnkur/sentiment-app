"use client"

export function Header() {
  return (
    <header className="text-center mb-8 pt-6">
      <div className="console-text mb-2">
        <h1 className="text-2xl font-bold text-primary animate-pulse-glow">
          {">>> VIBE_AI.exe"}
        </h1>
      </div>
      <div className="console-text text-sm text-muted-foreground">
        SYSTEM_READY: Real-time Sentiment Analysis
      </div>
    </header>
  )
}