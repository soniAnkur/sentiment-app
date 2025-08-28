"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { refreshAllData } from "@/lib/actions"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"

export function RefreshButton() {
  const [isPending, startTransition] = useTransition()
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRefresh = () => {
    setIsSpinning(true)
    startTransition(async () => {
      await refreshAllData()
      setTimeout(() => setIsSpinning(false), 1000)
    })
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isPending}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 glow-bullish",
        "shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
      )}
    >
      <RotateCcw 
        className={cn(
          "w-6 h-6",
          (isSpinning || isPending) && "animate-spin"
        )} 
      />
    </Button>
  )
}