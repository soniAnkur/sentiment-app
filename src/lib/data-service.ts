'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'

import type {
  StockOption,
  SentimentData,
  MentionData,
  RedditPost,
  RedditSentimentData
} from './types'

// Helper function to read JSON data
async function readJsonFile<T>(fileName: string): Promise<T> {
  try {
    const dataDirectory = path.join(process.cwd(), 'src', 'data')
    const filePath = path.join(dataDirectory, fileName)
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error)
    throw new Error(`Failed to read ${fileName}`)
  }
}

// Stock data service
export async function getStockOptions(): Promise<StockOption[]> {
  try {
    const data = await readJsonFile<{ stocks: StockOption[] }>('stocks.json')
    return data.stocks
  } catch (error) {
    console.error('Error fetching stock options:', error)
    // Fallback to basic stock list
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc. (AAPL)',
        icon: '🍎',
        price: 195.32,
        change: 2.4,
        sector: 'Technology',
        marketCap: '3000000000000'
      }
    ]
  }
}

export async function getStockBySymbol(symbol: string): Promise<StockOption | null> {
  try {
    const stocks = await getStockOptions()
    return stocks.find(stock => stock.symbol === symbol) || null
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error)
    return null
  }
}

// Sentiment data service
export async function getFallbackSentimentData(symbol: string): Promise<SentimentData> {
  try {
    const data = await readJsonFile<{ fallbackSentimentData: Record<string, Partial<SentimentData>> }>('sentiment-fallback.json')
    const stockData = data.fallbackSentimentData[symbol] || data.fallbackSentimentData['AAPL']
    
    return {
      symbol,
      sentimentScore: stockData.sentimentScore!,
      totalMentions: stockData.totalMentions!,
      positivePercentage: stockData.positivePercentage!,
      negativePercentage: stockData.negativePercentage!,
      neutralPercentage: stockData.neutralPercentage!,
      twitterMentions: stockData.twitterMentions!,
      redditMentions: stockData.redditMentions!,
      stocktwitsMentions: stockData.stocktwitsMentions!,
      sentimentTrend: stockData.sentimentTrend!,
      volumeTrend: stockData.volumeTrend || Math.random() * 10 - 5,
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    }
  } catch (error) {
    console.error(`Error fetching fallback sentiment data for ${symbol}:`, error)
    // Ultimate fallback
    return {
      symbol,
      sentimentScore: 75,
      totalMentions: 1000,
      positivePercentage: 60,
      negativePercentage: 25,
      neutralPercentage: 15,
      twitterMentions: 400,
      redditMentions: 350,
      stocktwitsMentions: 250,
      sentimentTrend: 5.0,
      volumeTrend: 0,
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    }
  }
}

// Mentions data service
export async function getFallbackMentionsData(): Promise<MentionData[]> {
  try {
    const data = await readJsonFile<{ fallbackMentions: MentionData[] }>('mentions-fallback.json')
    return data.fallbackMentions.map(mention => ({
      ...mention,
      timestamp: new Date(Date.now() - Math.random() * 1800000).toISOString() // Random time within last 30 minutes
    }))
  } catch (error) {
    console.error('Error fetching fallback mentions data:', error)
    return []
  }
}

// Reddit data service
export async function getRedditData(stock: string, subreddit: string): Promise<RedditSentimentData | null> {
  try {
    const data = await readJsonFile<{ redditData: Record<string, Record<string, RedditSentimentData>> }>('reddit-posts.json')
    return data.redditData[stock]?.[subreddit] || null
  } catch (error) {
    console.error(`Error fetching Reddit data for ${stock} in ${subreddit}:`, error)
    return null
  }
}

export async function generateMockRedditData(stock: string, subreddit: string): Promise<RedditSentimentData> {
  try {
    // First try to get static data
    const staticData = await getRedditData(stock, subreddit)
    if (staticData) {
      return {
        ...staticData,
        timestamp: new Date().toISOString(),
        metadata: {
          ...staticData.metadata,
          processedAt: new Date().toISOString()
        }
      }
    }

    // Generate from templates
    const templates = await readJsonFile<{ templates: { posts: unknown[] } }>('mock-templates.json')
    const postTemplates = templates.templates.posts

    const mockPosts: RedditPost[] = postTemplates.map((template: Record<string, unknown>, index) => ({
      id: `mock_post_${index + 1}`,
      title: (template.titleTemplate as string).replace('{stock}', stock),
      content: template.contentTemplate as string,
      author: template.author as string,
      upvotes: (template.upvotes as number) + Math.floor(Math.random() * 100),
      comments: (template.comments as number) + Math.floor(Math.random() * 20),
      sentiment: template.sentiment as 'bullish' | 'bearish' | 'neutral',
      sentimentScore: (template.sentimentScore as number) + Math.floor(Math.random() * 10) - 5,
      url: `https://reddit.com/r/${subreddit}/comments/mock_${index + 1}`,
      subreddit
    }))

    const totalPosts = mockPosts.length
    const bullishPosts = mockPosts.filter(p => p.sentiment === 'bullish').length
    const bearishPosts = mockPosts.filter(p => p.sentiment === 'bearish').length
    const neutralPosts = mockPosts.filter(p => p.sentiment === 'neutral').length

    return {
      stock,
      platform: 'reddit',
      timestamp: new Date().toISOString(),
      totalMentions: totalPosts,
      sentimentScore: Math.round(mockPosts.reduce((sum, post) => sum + post.sentimentScore, 0) / totalPosts),
      positivePercentage: Math.round((bullishPosts / totalPosts) * 100),
      negativePercentage: Math.round((bearishPosts / totalPosts) * 100),
      neutralPercentage: Math.round((neutralPosts / totalPosts) * 100),
      topPosts: mockPosts.sort((a, b) => b.upvotes - a.upvotes),
      metadata: {
        subreddit,
        totalUpvotes: mockPosts.reduce((sum, post) => sum + post.upvotes, 0),
        totalComments: mockPosts.reduce((sum, post) => sum + post.comments, 0),
        processedAt: new Date().toISOString(),
        source: 'fallback'
      }
    }
  } catch (error) {
    console.error(`Error generating mock Reddit data for ${stock}:`, error)
    throw error
  }
}

// Refresh data action
export async function refreshDataCache(path: string = '/') {
  revalidatePath(path)
}

