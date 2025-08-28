"use client"

import { useState, useEffect, useTransition } from 'react'
import { SentimentScore } from '@/components/ui/sentiment-score'
import { MetricCard } from '@/components/ui/metric-card'
import { PlatformCard } from '@/components/ui/platform-card'
import { StockSelector, type StockOption } from '@/components/ui/stock-selector'
import { ActivityFeed, type ActivityItem } from '@/components/ui/activity-feed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchSentimentData, fetchMentionsData, type SentimentData } from '@/lib/actions'

const STOCK_OPTIONS: StockOption[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc. (AAPL)',
    icon: '🍎',
    price: 195.32,
    change: 2.4
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc. (TSLA)',
    icon: '🚗',
    price: 248.85,
    change: -1.2
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc. (GOOGL)',
    icon: '🔍',
    price: 138.75,
    change: 0.8
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp. (MSFT)',
    icon: '💻',
    price: 415.20,
    change: 1.5
  },
  {
    symbol: 'AMZN',
    name: 'Amazon Inc. (AMZN)',
    icon: '📦',
    price: 185.90,
    change: -0.5
  }
]

export function SentimentDashboard() {
  const [selectedStock, setSelectedStock] = useState<StockOption>(STOCK_OPTIONS[0])
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [, startTransition] = useTransition()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadData = async (symbol: string) => {
    startTransition(async () => {
      try {
        const [sentiment, mentions] = await Promise.all([
          fetchSentimentData(symbol),
          fetchMentionsData(symbol, 5)
        ])
        
        setSentimentData(sentiment)
        setActivities(mentions.map(mention => ({
          id: mention.id,
          platform: mention.platform,
          content: mention.content,
          sentiment: mention.sentiment,
          sentimentScore: mention.sentimentScore,
          author: mention.author,
          timestamp: mention.timestamp,
          metrics: mention.metadata
        })))
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error loading data:', error)
      }
    })
  }

  useEffect(() => {
    loadData(selectedStock.symbol)
  }, [selectedStock.symbol])

  const handleStockChange = (stock: StockOption) => {
    setSelectedStock(stock)
  }

  const handleMetricClick = (type: string) => {
    window.location.href = `/details/${type}`
  }

  const handlePlatformClick = (platform: string) => {
    window.location.href = `/details/${platform}`
  }

  if (!sentimentData) {
    return <div className="text-center py-8">Loading sentiment data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stock Selector */}
      <StockSelector
        stocks={STOCK_OPTIONS}
        selectedStock={selectedStock}
        onStockChange={handleStockChange}
      />

      {/* Sentiment Score */}
      <SentimentScore
        score={sentimentData.sentimentScore}
        change={sentimentData.sentimentTrend}
        lastUpdated={sentimentData.lastUpdated}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          value={`${sentimentData.positivePercentage}%`}
          label="BULLISH"
          type="bullish"
          onClick={() => handleMetricClick('bullish')}
        />
        <MetricCard
          value={sentimentData.totalMentions >= 1000 
            ? `${(sentimentData.totalMentions / 1000).toFixed(1)}K` 
            : sentimentData.totalMentions.toString()
          }
          label="MENTIONS"
          type="accent"
          onClick={() => handleMetricClick('mentions')}
        />
        <MetricCard
          value={`${sentimentData.negativePercentage}%`}
          label="BEARISH"
          type="bearish"
          onClick={() => handleMetricClick('bearish')}
        />
        <MetricCard
          value={`${sentimentData.neutralPercentage}%`}
          label="NEUTRAL"
          type="neutral"
          onClick={() => handleMetricClick('neutral')}
        />
      </div>

      {/* AI Insights */}
      <Card 
        className="glass-card relative cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => window.location.href = '/details/mentions'}
      >
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {">>> AI_ANALYSIS.exe"}
            </Badge>
            <span className="text-lg">📊 SYSTEM_STATUS: ANALYZING</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="console-text text-muted-foreground space-y-2">
          <div>[PROCESSING] Strong {sentimentData.sentimentScore >= 70 ? 'bullish' : sentimentData.sentimentScore >= 50 ? 'neutral' : 'bearish'} sentiment detected...</div>
          <div>[TRIGGER] Market momentum + {sentimentData.totalMentions} mentions analyzed</div>
          <div>[ANALYSIS] Social sentiment: {sentimentData.sentimentScore >= 70 ? 'POSITIVE' : sentimentData.sentimentScore >= 50 ? 'MIXED' : 'NEGATIVE'}</div>
          <div>[PREDICTION] Trend {sentimentData.sentimentTrend >= 0 ? 'sustained' : 'declining'} based on {sentimentData.sentimentTrend >= 0 ? 'positive' : 'negative'} momentum</div>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-3 gap-4">
        <PlatformCard
          name="TWITTER/X"
          icon="🐦"
          mentions={sentimentData.twitterMentions}
          onClick={() => handlePlatformClick('twitter')}
        />
        <PlatformCard
          name="REDDIT"
          icon="📱"
          mentions={sentimentData.redditMentions}
          onClick={() => handlePlatformClick('reddit')}
        />
        <PlatformCard
          name="STOCKTWITS"
          icon="📊"
          mentions={sentimentData.stocktwitsMentions}
          onClick={() => handlePlatformClick('stocktwits')}
        />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={activities} />

      {/* Status Footer */}
      <div className="text-center console-text text-xs text-muted-foreground">
        Last updated: {lastUpdated.toLocaleTimeString()} • 
        {sentimentData.isFallback ? (
          <Badge variant="outline" className="ml-2 status-neutral">
            DEMO MODE
          </Badge>
        ) : (
          <Badge variant="outline" className="ml-2 status-bullish animate-blink">
            LIVE DATA
          </Badge>
        )}
      </div>
    </div>
  )
}