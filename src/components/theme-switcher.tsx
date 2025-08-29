'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Palette } from 'lucide-react'

const themes = [
  { name: 'Default', value: 'default', description: 'Glass dark theme with green accents' },
  { name: 'Neumorphism', value: 'neumorphism', description: 'Soft shadows and raised elements' },
  { name: 'Glassmorphism', value: 'glassmorphism', description: 'Frosted glass with blur effects' },
  { name: 'Catppuccin', value: 'catppuccin', description: 'Soothing pastel dark theme' },
  { name: 'Rose Pine', value: 'rose-pine', description: 'Elegant purples and soft colors' },
  { name: 'Tokyo Night', value: 'tokyo-night', description: 'Popular developer theme' },
  { name: 'GitHub Dark', value: 'github-dark', description: 'Familiar GitHub styling' },
  { name: 'Emerald', value: 'emerald', description: 'Rich green-focused theme' },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default')

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('sentiment-app-theme') || 'default'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeName: string) => {
    // Remove all theme classes
    document.documentElement.classList.remove(
      'theme-neumorphism',
      'theme-glassmorphism',
      'theme-catppuccin',
      'theme-rose-pine', 
      'theme-tokyo-night',
      'theme-github-dark',
      'theme-emerald'
    )
    
    // Apply new theme class (except for default)
    if (themeName !== 'default') {
      document.documentElement.classList.add(`theme-${themeName}`)
    }
    
    // Save to localStorage
    localStorage.setItem('sentiment-app-theme', themeName)
    setCurrentTheme(themeName)
  }

  const currentThemeInfo = themes.find(theme => theme.value === currentTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="glass-card border-white/20 hover:border-accent/50 transition-all duration-200"
        >
          <Palette className="h-4 w-4 mr-2" />
          {currentThemeInfo?.name || 'Theme'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-card border-white/20 min-w-[240px]"
      >
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => applyTheme(theme.value)}
            className={`flex flex-col items-start p-3 cursor-pointer transition-all duration-200 ${
              currentTheme === theme.value 
                ? 'bg-accent/20 text-accent-foreground' 
                : 'hover:bg-accent/10'
            }`}
          >
            <div className="flex items-center gap-2 w-full">
              <div 
                className={`w-3 h-3 rounded-full border border-white/20 ${
                  currentTheme === theme.value ? 'bg-accent' : 'bg-muted'
                }`}
              />
              <span className="font-medium">{theme.name}</span>
              {currentTheme === theme.value && (
                <span className="ml-auto text-xs text-accent">Active</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground mt-1 ml-5">
              {theme.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}