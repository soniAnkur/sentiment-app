'use server'

import { getStockOptions, getStockBySymbol, getRedditData, generateMockRedditData } from './data-service'
import type { StockOption, RedditSentimentData } from './types'

// Server actions for stock data
export async function fetchStockOptions(): Promise<StockOption[]> {
  try {
    return await getStockOptions()
  } catch (error) {
    console.error('Error fetching stock options:', error)
    return []
  }
}

export async function fetchStock(symbol: string): Promise<StockOption | null> {
  try {
    return await getStockBySymbol(symbol)
  } catch (error) {
    console.error(`Error fetching stock ${symbol}:`, error)
    return null
  }
}

export async function fetchRedditSentiment(stock: string, subreddit: string): Promise<RedditSentimentData> {
  try {
    // Try to get static data first
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
    
    // Fall back to mock generation
    return await generateMockRedditData(stock, subreddit)
  } catch (error) {
    console.error(`Error fetching Reddit sentiment for ${stock} in ${subreddit}:`, error)
    return await generateMockRedditData(stock, subreddit)
  }
}

