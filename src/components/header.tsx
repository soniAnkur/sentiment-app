"use client"

import { ThemeSwitcher } from '@/components/theme-switcher'

export function Header() {
  return (
    <header className="text-center mb-8 pt-6 relative">
      <div className="absolute top-0 right-0">
        <ThemeSwitcher />
      </div>
      <div className="console-text mb-2">
        <h1 className="text-2xl font-bold text-primary animate-pulse-glow">
          {">>> STOCK'er.exe"}
        </h1>
      </div>
      <div className="console-text text-sm text-muted-foreground">
        SYSTEM_READY: Real-time Sentiment Analysis
      </div>
    </header>
  )
}