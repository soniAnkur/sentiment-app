'use server'

import { revalidatePath } from 'next/cache'
import { getFallbackSentimentData, getFallbackMentionsData } from './data-service'
import type { SentimentData, MentionData, HealthStatus } from './types'

// N8N API Configuration
const N8N_CONFIG = {
  baseUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook',
  endpoints: {
    health: 'api?endpoint=health',
    stockDetails: 'api?endpoint=stock-details',
    mentions: 'api?endpoint=mentions',
    trends: 'api?endpoint=trends',
  }
}



// Helper function to make N8N API calls
async function fetchFromN8N(endpoint: string, params: Record<string, unknown> = {}) {
  try {
    const url = new URL(`${N8N_CONFIG.baseUrl}/${endpoint}`)
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key].toString())
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`N8N API Error for ${endpoint}:`, error)
    throw error
  }
}


// Server Actions
export async function fetchSentimentData(symbol: string = 'AAPL'): Promise<SentimentData> {
  try {
    const data = await fetchFromN8N(N8N_CONFIG.endpoints.stockDetails, { symbol })
    
    if (data.success && data.data) {
      return {
        symbol,
        sentimentScore: Math.round(data.data.avg_sentiment * 10) || 75,
        totalMentions: data.data.total_mentions || 0,
        positivePercentage: data.data.positive_percentage || 0,
        negativePercentage: data.data.negative_percentage || 0,
        neutralPercentage: data.data.neutral_percentage || 0,
        twitterMentions: data.data.twitter_mentions || 0,
        redditMentions: data.data.reddit_mentions || 0,
        stocktwitsMentions: data.data.stocktwits_mentions || 0,
        sentimentTrend: data.data.sentiment_trend || 0,
        volumeTrend: data.data.volume_trend || 0,
        lastUpdated: data.data.last_updated || new Date().toISOString(),
      }
    }
    
    throw new Error('Invalid response format from N8N')
  } catch (error) {
    console.warn(`Using fallback data for ${symbol} due to API error:`, error)
    return await getFallbackSentimentData(symbol)
  }
}

export async function fetchMentionsData(symbol: string = 'AAPL', limit: number = 10): Promise<MentionData[]> {
  try {
    const data = await fetchFromN8N(N8N_CONFIG.endpoints.mentions, { symbol, limit })
    
    if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((mention: unknown): MentionData => {
        const mentionObj = mention as Record<string, unknown>
        return {
          id: (mentionObj.id as string) || Math.random().toString(36),
          platform: (mentionObj.platform as string) || 'unknown',
          content: (mentionObj.content as string) || 'No content available',
          sentiment: mentionObj.sentiment_label === 'positive' ? 'bullish' : 
                    mentionObj.sentiment_label === 'negative' ? 'bearish' : 'neutral',
          sentimentScore: (mentionObj.sentiment_score as number) || 5,
          author: (mentionObj.author as string) || 'Anonymous',
          timestamp: (mentionObj.created_at as string) || new Date().toISOString(),
          metadata: (mentionObj.metadata as Record<string, unknown>) || {},
        }
      })
    }
    
    throw new Error('Invalid mentions response format')
  } catch (error) {
    console.warn(`Using fallback mentions for ${symbol} due to API error:`, error)
    return await getFallbackMentionsData()
  }
}

export async function checkHealthStatus(): Promise<HealthStatus> {
  try {
    const data = await fetchFromN8N(N8N_CONFIG.endpoints.health)
    
    if (data.success && data.data) {
      return {
        status: data.data.status === 'healthy' ? 'healthy' : 'unhealthy',
        timestamp: data.data.timestamp || new Date().toISOString(),
        services: data.data.services || {},
      }
    }
    
    return {
      status: 'unknown',
      timestamp: new Date().toISOString(),
      services: {},
    }
  } catch (error) {
    console.error('N8N Health Check Failed:', error)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function refreshAllData(symbol: string = 'AAPL') {
  'use server'
  
  try {
    // Fetch fresh data
    const [sentimentData, mentionsData, healthData] = await Promise.all([
      fetchSentimentData(symbol),
      fetchMentionsData(symbol, 5),
      checkHealthStatus(),
    ])
    
    // Revalidate the cache
    revalidatePath('/')
    
    return {
      success: true,
      data: {
        sentiment: sentimentData,
        mentions: mentionsData,
        health: healthData,
      },
    }
  } catch (error) {
    console.error('Error refreshing data:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}