"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, ExternalLink, ArrowUp, MessageCircle, Send, Activity, Database, Wifi } from 'lucide-react'
import { fetchRedditSentiment } from '@/lib/stock-actions'

import type { RedditPost, RedditSentimentData } from '@/lib/types'

export function RedditDetails() {
  const [data, setData] = useState<RedditSentimentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState('AAPL')
  const [selectedSubreddit, setSelectedSubreddit] = useState('stocks')
  const [publishingToN8n, setPublishingToN8n] = useState(false)
  const [n8nStatus, setN8nStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown')
  const [useStaticData, setUseStaticData] = useState(false)

  const fetchRedditData = useCallback(async () => {
    setLoading(true)
    try {
      if (useStaticData) {
        // Use centralized data service for static data
        const redditData = await fetchRedditSentiment(selectedStock, selectedSubreddit)
        setData(redditData)
        setN8nStatus('disconnected')
      } else {
        // Try API first, then fall back to centralized data
        const url = `/api/reddit-sentiment?stock=${selectedStock}&subreddit=${selectedSubreddit}`
        const response = await fetch(url)
        
        if (response.ok) {
          const redditData = await response.json()
          setData(redditData)
          setN8nStatus(redditData.metadata?.source === 'n8n' ? 'connected' : 'disconnected')
        } else {
          // Fallback to centralized data service
          const redditData = await fetchRedditSentiment(selectedStock, selectedSubreddit)
          setData(redditData)
          setN8nStatus('disconnected')
        }
      }
    } catch (error) {
      console.error('Error fetching Reddit data:', error)
      // Final fallback to centralized data service
      try {
        const redditData = await fetchRedditSentiment(selectedStock, selectedSubreddit)
        setData(redditData)
        setN8nStatus('disconnected')
      } catch (fallbackError) {
        console.error('Error with fallback data:', fallbackError)
      }
    }
    setLoading(false)
  }, [selectedStock, selectedSubreddit, useStaticData])

  const publishDataToN8n = async () => {
    if (!data) return
    
    setPublishingToN8n(true)
    try {
      const response = await fetch('/api/reddit-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookPath: 'sentiment-analysis/reddit-data',
          data: {
            ...data,
            publishedAt: new Date().toISOString(),
            publishedBy: 'reddit-details-page'
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('Successfully published to N8n')
        setN8nStatus('connected')
      } else {
        console.error('Failed to publish to N8n:', result.message)
        setN8nStatus('disconnected')
      }
    } catch (error) {
      console.error('Error publishing to N8n:', error)
      setN8nStatus('disconnected')
    }
    setPublishingToN8n(false)
  }


  useEffect(() => {
    fetchRedditData()
  }, [fetchRedditData])

  const getSentimentBadgeVariant = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'default'
      case 'bearish':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-400'
      case 'bearish':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
    }
  }

  if (loading) {
    return <div className="console-text text-center py-8">Loading Reddit data...</div>
  }

  if (!data) {
    return <div className="console-text text-center py-8">No Reddit data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass-card">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="console-text text-sm font-medium mb-2 block">Stock Symbol</label>
              <select 
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="console-text bg-background border border-border rounded px-3 py-2"
              >
                <option value="AAPL">AAPL</option>
                <option value="TSLA">TSLA</option>
                <option value="GOOGL">GOOGL</option>
                <option value="MSFT">MSFT</option>
                <option value="AMZN">AMZN</option>
              </select>
            </div>
            <div>
              <label className="console-text text-sm font-medium mb-2 block">Subreddit</label>
              <select 
                value={selectedSubreddit}
                onChange={(e) => setSelectedSubreddit(e.target.value)}
                className="console-text bg-background border border-border rounded px-3 py-2"
              >
                <option value="stocks">r/stocks</option>
                <option value="investing">r/investing</option>
                <option value="SecurityAnalysis">r/SecurityAnalysis</option>
                <option value="ValueInvesting">r/ValueInvesting</option>
                <option value="StockMarket">r/StockMarket</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setUseStaticData(!useStaticData)}
              variant={useStaticData ? "default" : "outline"}
              className="console-text"
            >
              {useStaticData ? (
                <Database className="w-4 h-4 mr-2" />
              ) : (
                <Wifi className="w-4 h-4 mr-2" />
              )}
              {useStaticData ? 'Static Data' : 'Live Data'}
            </Button>
            <Button onClick={fetchRedditData} className="console-text">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={publishDataToN8n} 
              disabled={!data || publishingToN8n || useStaticData}
              variant="outline" 
              className="console-text"
            >
              {publishingToN8n ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Publish to N8n
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="glass-card">
        <div className="console-indicator top-left" />
        <div className="console-indicator top-right" />
        
        <CardHeader>
          <CardTitle className="console-text flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                r/{data.metadata.subreddit}
              </Badge>
              <span>Reddit Sentiment Analysis - {data.stock}</span>
            </div>
            <div className="flex items-center gap-2">
              {useStaticData ? (
                <>
                  <Database className="w-4 h-4 text-blue-400" />
                  <Badge variant="secondary">
                    STATIC DATA MODE
                  </Badge>
                </>
              ) : (
                <>
                  <Activity className={`w-4 h-4 ${
                    n8nStatus === 'connected' ? 'text-green-400' : 
                    n8nStatus === 'disconnected' ? 'text-red-400' : 
                    'text-yellow-400'
                  }`} />
                  <Badge variant={
                    n8nStatus === 'connected' ? 'default' : 
                    n8nStatus === 'disconnected' ? 'destructive' : 
                    'secondary'
                  }>
                    N8N: {n8nStatus === 'connected' ? 'Connected' : 
                          n8nStatus === 'disconnected' ? 'Offline' : 
                          'Unknown'}
                  </Badge>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="console-text text-2xl font-bold">{data.totalMentions}</div>
              <div className="console-text text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="console-text text-2xl font-bold">{data.sentimentScore}</div>
              <div className="console-text text-sm text-muted-foreground">Sentiment Score</div>
            </div>
            <div className="text-center">
              <div className="console-text text-2xl font-bold text-green-400">{data.positivePercentage}%</div>
              <div className="console-text text-sm text-muted-foreground">Bullish</div>
            </div>
            <div className="text-center">
              <div className="console-text text-2xl font-bold text-red-400">{data.negativePercentage}%</div>
              <div className="console-text text-sm text-muted-foreground">Bearish</div>
            </div>
            <div className="text-center">
              <div className="console-text text-2xl font-bold text-yellow-400">{data.neutralPercentage}%</div>
              <div className="console-text text-sm text-muted-foreground">Neutral</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between console-text text-sm text-muted-foreground">
            <span>📊 {data.metadata.totalUpvotes.toLocaleString()} total upvotes</span>
            <span>💬 {data.metadata.totalComments.toLocaleString()} total comments</span>
            <span>⏰ {new Date(data.metadata.processedAt).toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Posts */}
      <div className="space-y-4">
        <h2 className="console-text text-xl font-semibold">Top Discussions</h2>
        {data.topPosts.map((post) => (
          <Card key={post.id} className="glass-card hover:scale-[1.01] transition-transform">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="console-text text-lg leading-tight flex-1">
                  {post.title}
                </CardTitle>
                <Badge variant={getSentimentBadgeVariant(post.sentiment)} className="shrink-0">
                  {post.sentiment.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="console-text text-muted-foreground text-sm leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 console-text text-sm text-muted-foreground">
                  <span>u/{post.author}</span>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4" />
                    {post.upvotes.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {post.comments}
                  </div>
                  <div className={`font-medium ${getSentimentColor(post.sentiment)}`}>
                    Score: {post.sentimentScore}
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="console-text" asChild>
                  <a href={post.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Reddit
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <Card className="glass-card">
        <CardContent className="p-4 text-center console-text text-sm text-muted-foreground">
          <p>
            Data sourced from r/{data.metadata.subreddit} • 
            {useStaticData ? 'Static sample data' : 'Sentiment analysis powered by N8N workflow'} • 
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </p>
          <p className="mt-2">
            <Badge 
              variant="outline" 
              className={useStaticData ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "status-bullish animate-blink"}
            >
              {useStaticData ? (
                <>
                  <Database className="w-3 h-3 mr-1" />
                  STATIC DATA
                </>
              ) : (
                '🔄 LIVE REDDIT DATA'
              )}
            </Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}