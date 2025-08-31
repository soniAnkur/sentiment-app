import { NextRequest, NextResponse } from 'next/server'
import { fetchRedditSentimentFromN8n, publishToN8n, n8nClient } from '@/lib/n8n'
import { getRedditData, generateMockRedditData } from '@/lib/data-service'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const stock = searchParams.get('stock') || 'AAPL'
  const subreddit = searchParams.get('subreddit') || 'stocks'
  const forceStatic = searchParams.get('static') === 'true'

  // If static mode is forced, return centralized data immediately
  if (forceStatic) {
    try {
      const staticData = await getRedditData(stock, subreddit)
      if (staticData) {
        return NextResponse.json({
          ...staticData,
          timestamp: new Date().toISOString(),
          metadata: {
            ...staticData.metadata,
            processedAt: new Date().toISOString(),
            source: 'static'
          }
        })
      }
      // Fall back to generated mock data if no static data exists
      const mockData = await generateMockRedditData(stock, subreddit)
      return NextResponse.json(mockData)
    } catch (error) {
      console.error('Error fetching static data:', error)
      const mockData = await generateMockRedditData(stock, subreddit)
      return NextResponse.json(mockData)
    }
  }

  // Try to fetch from N8N workflow first
  try {
    const n8nData = await fetchRedditSentimentFromN8n(stock, subreddit)
    
    if (n8nData) {
      // Publish the request data to N8n for analytics/logging
      await publishToN8n('analytics/reddit-request', {
        stock,
        subreddit,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        source: 'reddit-details-page'
      })
      
      return NextResponse.json({
        ...n8nData,
        metadata: {
          ...n8nData.metadata,
          source: 'n8n'
        }
      })
    }
  } catch (error) {
    console.error('N8N workflow error:', error)
  }

  // Check N8n health before falling back
  const isN8nHealthy = await n8nClient.checkHealth()
  console.log(`N8N health status: ${isN8nHealthy ? 'healthy' : 'unavailable'}`)

  // Use centralized data service as fallback
  const fallbackData = await generateMockRedditData(stock, subreddit)
  
  // Still try to publish the fallback usage for monitoring
  try {
    await publishToN8n('analytics/fallback-usage', {
      stock,
      subreddit,
      reason: 'n8n-unavailable',
      timestamp: new Date().toISOString(),
      n8nHealthy: isN8nHealthy
    })
  } catch {
    // Silently fail if analytics publishing fails
  }
  
  return NextResponse.json(fallbackData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { webhookPath, data } = body
    
    if (!webhookPath) {
      return NextResponse.json(
        { error: 'webhookPath is required' },
        { status: 400 }
      )
    }
    
    const success = await publishToN8n(webhookPath, data || {})
    
    return NextResponse.json({
      success,
      message: success ? 'Data published to N8n successfully' : 'Failed to publish to N8n'
    })
  } catch (error) {
    console.error('POST /api/reddit-sentiment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

