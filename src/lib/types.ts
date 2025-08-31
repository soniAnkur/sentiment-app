// Core types for the application
export interface StockOption {
  symbol: string
  name: string
  icon: string
  price: number
  change: number
  sector: string
  marketCap: string
}

export interface SentimentData {
  symbol: string
  sentimentScore: number
  totalMentions: number
  positivePercentage: number
  negativePercentage: number
  neutralPercentage: number
  twitterMentions: number
  redditMentions: number
  stocktwitsMentions: number
  sentimentTrend: number
  volumeTrend: number
  lastUpdated: string
  isFallback?: boolean
}

export interface MentionData {
  id: string
  platform: string
  content: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  sentimentScore: number
  author: string
  timestamp: string
  metadata: {
    likes?: number
    retweets?: number
    upvotes?: number
    comments?: number
    bullish?: number
    bearish?: number
  }
}

export interface RedditPost {
  id: string
  title: string
  content: string
  author: string
  upvotes: number
  comments: number
  sentiment: 'bullish' | 'bearish' | 'neutral'
  sentimentScore: number
  url: string
  subreddit?: string
}

export interface RedditSentimentData {
  stock: string
  platform: string
  timestamp: string
  totalMentions: number
  sentimentScore: number
  positivePercentage: number
  negativePercentage: number
  neutralPercentage: number
  topPosts: RedditPost[]
  metadata: {
    subreddit: string
    totalUpvotes: number
    totalComments: number
    processedAt: string
    source?: string
  }
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown'
  timestamp: string
  services: Record<string, unknown>
  error?: string
}