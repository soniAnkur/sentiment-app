"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ActivityFeed } from "@/components/ui/activity-feed"
import { useState, useEffect } from "react"
import { fetchMentionsData, type MentionData } from "@/lib/actions"

export function TwitterDetails() {
  const [activities, setActivities] = useState<MentionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTwitterData = async () => {
      try {
        const mentions = await fetchMentionsData('AAPL', 30)
        // Filter for Twitter mentions only
        const twitterMentions = mentions.filter(m => m.platform === 'twitter')
        setActivities(twitterMentions.map(mention => ({
          id: mention.id,
          platform: mention.platform,
          content: mention.content,
          sentiment: mention.sentiment,
          sentimentScore: mention.sentimentScore,
          author: mention.author,
          timestamp: mention.timestamp,
          metrics: mention.metadata
        })))
      } catch (error) {
        console.error('Error loading Twitter data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTwitterData()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading Twitter/X data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Twitter Overview */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {">>> TWITTER_METRICS.exe"}
            </Badge>
            <span className="text-2xl">🐦</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="metric-large status-accent glow-accent mb-2">
                1.2K
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [TOTAL_TWEETS]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-bullish glow-bullish mb-2">
                82%
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [BULLISH_RATIO]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-accent glow-accent mb-2">
                45K
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [TOTAL_ENGAGEMENT]
              </div>
            </div>
            
            <div className="text-center">
              <div className="metric-large status-neutral glow-neutral mb-2">
                8.3
              </div>
              <div className="console-text text-sm text-muted-foreground">
                [AVG_SENTIMENT]
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[POSITIVE_TWEETS]</span>
                <span>82% (984)</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[NEGATIVE_TWEETS]</span>
                <span>15% (180)</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between console-text text-sm mb-2">
                <span>[NEUTRAL_TWEETS]</span>
                <span>3% (36)</span>
              </div>
              <Progress value={3} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Influencers */}
      <Card className="glass-card relative">
        <div className="console-indicator top-left" />
        <div className="console-indicator bottom-right" />
        
        <CardHeader>
          <CardTitle className="console-text">
            👑 [TOP_INFLUENCERS]
          </CardTitle>
        </CardHeader>
        
        <CardContent className="console-text space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="status-bullish font-semibold">@TechAnalyst</div>
                <Badge className="status-bullish">234K followers</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                "iPhone 16 Pro pre-orders exceeding expectations! 🚀"
              </div>
              <div className="text-xs text-accent mt-2">
                Engagement: 15.2K • Sentiment: 9.2/10
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="status-bullish font-semibold">@AppleInsider</div>
                <Badge className="status-accent">1.2M followers</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                "Apple Intelligence features getting strong user adoption"
              </div>
              <div className="text-xs text-accent mt-2">
                Engagement: 28.7K • Sentiment: 8.8/10
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="status-neutral font-semibold">@MarketWatch</div>
                <Badge className="status-neutral">890K followers</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                "AAPL trading sideways as investors await guidance"
              </div>
              <div className="text-xs text-accent mt-2">
                Engagement: 8.9K • Sentiment: 5.1/10
              </div>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="status-bullish font-semibold">@iPhoneFan</div>
                <Badge className="status-bullish">156K followers</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                "New camera features are absolutely incredible! 📸"
              </div>
              <div className="text-xs text-accent mt-2">
                Engagement: 5.6K • Sentiment: 9.5/10
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Twitter Activity */}
      <ActivityFeed 
        activities={activities.length > 0 ? activities : [
          {
            id: '1',
            platform: 'twitter',
            content: '@TechAnalyst: Apple\'s AI integration in iOS 18 is a game-changer! The Photos app improvements alone are worth the upgrade. $AAPL 🚀📱✨',
            sentiment: 'bullish' as const,
            sentimentScore: 9.2,
            author: 'TechAnalyst',
            timestamp: new Date(Date.now() - 180000).toISOString(),
            metrics: { likes: 1420, retweets: 567 }
          },
          {
            id: '2',
            platform: 'twitter',
            content: 'Just used the new iPhone 16 Pro camera in low light. The results are stunning! Apple continues to lead in mobile photography. #iPhone16Pro',
            sentiment: 'bullish' as const,
            sentimentScore: 8.8,
            author: 'PhotoPro_Mike',
            timestamp: new Date(Date.now() - 420000).toISOString(),
            metrics: { likes: 892, retweets: 234 }
          },
          {
            id: '3',
            platform: 'twitter',
            content: '$AAPL services revenue growth trajectory is impressive. The ecosystem lock-in effect keeps getting stronger with each new product launch.',
            sentiment: 'bullish' as const,
            sentimentScore: 8.5,
            author: 'InvestmentGuru',
            timestamp: new Date(Date.now() - 680000).toISOString(),
            metrics: { likes: 645, retweets: 189 }
          },
          {
            id: '4',
            platform: 'twitter',
            content: 'Apple Event was solid but not groundbreaking. Iterative improvements across the board. $AAPL remains a hold for me.',
            sentiment: 'neutral' as const,
            sentimentScore: 5.5,
            author: 'TechReviewer',
            timestamp: new Date(Date.now() - 950000).toISOString(),
            metrics: { likes: 234, retweets: 67 }
          }
        ]}
      />
    </div>
  )
}