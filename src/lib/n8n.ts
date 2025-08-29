interface N8nWebhookResponse {
  success: boolean
  data?: unknown
  error?: string
}

interface RedditSentimentData {
  stock: string
  platform: string
  timestamp: string
  totalMentions: number
  sentimentScore: number
  positivePercentage: number
  negativePercentage: number
  neutralPercentage: number
  topPosts: Array<{
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
  }>
  metadata: {
    subreddit: string
    totalUpvotes: number
    totalComments: number
    processedAt: string
  }
}

export class N8nClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = 'http://localhost:5678', timeout = 10000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<N8nWebhookResponse> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
          }
        }
        return {
          success: false,
          error: error.message,
        }
      }
      
      return {
        success: false,
        error: 'Unknown error occurred',
      }
    }
  }

  async getRedditSentiment(
    stock: string,
    subreddit: string = 'stocks'
  ): Promise<RedditSentimentData | null> {
    const result = await this.makeRequest(
      `/webhook/reddit-sentiment?stock=${encodeURIComponent(stock)}&subreddit=${encodeURIComponent(subreddit)}`
    )

    if (!result.success) {
      console.warn('N8n Reddit sentiment request failed:', result.error)
      return null
    }

    return result.data as RedditSentimentData
  }

  async sendDataToN8n(
    webhookPath: string,
    data: Record<string, unknown>
  ): Promise<N8nWebhookResponse> {
    return this.makeRequest(`/webhook/${webhookPath}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async triggerWorkflow(
    workflowId: string,
    data: Record<string, unknown> = {}
  ): Promise<N8nWebhookResponse> {
    return this.makeRequest(`/webhook/${workflowId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Default instance
export const n8nClient = new N8nClient()

// Utility functions
export async function publishToN8n(
  webhookPath: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const result = await n8nClient.sendDataToN8n(webhookPath, data)
  
  if (!result.success) {
    console.error('Failed to publish to N8n:', result.error)
    return false
  }
  
  console.log('Successfully published to N8n:', webhookPath)
  return true
}

export async function fetchRedditSentimentFromN8n(
  stock: string,
  subreddit: string = 'stocks'
): Promise<RedditSentimentData | null> {
  return await n8nClient.getRedditSentiment(stock, subreddit)
}