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

const staticRedditDataByStock: Record<string, Record<string, RedditSentimentData>> = {
  'AAPL': {
    'stocks': {
      stock: 'AAPL',
      platform: 'reddit',
      timestamp: '2024-03-15T10:30:00Z',
      totalMentions: 247,
      sentimentScore: 72,
      positivePercentage: 58,
      negativePercentage: 23,
      neutralPercentage: 19,
      topPosts: [
        {
          id: 'aapl_post1',
          title: 'AAPL hitting new highs - iPhone 16 driving momentum',
          content: 'Apple continues to innovate with the iPhone 16 series. The new AI features and improved cameras are generating significant consumer interest. Strong pre-orders suggest another successful launch.',
          author: 'TechInvestor2024',
          upvotes: 892,
          comments: 234,
          sentiment: 'bullish',
          sentimentScore: 84,
          url: 'https://reddit.com/r/stocks/comments/aapl_bullish_1',
          subreddit: 'stocks'
        },
        {
          id: 'aapl_post2',
          title: 'Apple services revenue concerns - growth slowing?',
          content: 'While hardware sales remain strong, I\'m seeing signs that services growth is decelerating. App Store revenue growth has been modest and subscription fatigue might be setting in.',
          author: 'MarketSkeptic',
          upvotes: 456,
          comments: 178,
          sentiment: 'bearish',
          sentimentScore: 28,
          url: 'https://reddit.com/r/stocks/comments/aapl_bearish_1',
          subreddit: 'stocks'
        },
        {
          id: 'aapl_post3',
          title: 'AAPL dividend increase analysis',
          content: 'Apple announced another dividend increase, marking 12 consecutive years of growth. The current yield is modest but the consistency is impressive for a tech stock of this size.',
          author: 'DividendHunter',
          upvotes: 334,
          comments: 89,
          sentiment: 'neutral',
          sentimentScore: 55,
          url: 'https://reddit.com/r/stocks/comments/aapl_neutral_1',
          subreddit: 'stocks'
        }
      ],
      metadata: {
        subreddit: 'stocks',
        totalUpvotes: 1682,
        totalComments: 501,
        processedAt: '2024-03-15T10:30:00Z',
        source: 'static'
      }
    },
    'investing': {
      stock: 'AAPL',
      platform: 'reddit',
      timestamp: '2024-03-15T11:00:00Z',
      totalMentions: 189,
      sentimentScore: 68,
      positivePercentage: 52,
      negativePercentage: 27,
      neutralPercentage: 21,
      topPosts: [
        {
          id: 'aapl_inv_post1',
          title: 'Long-term AAPL investment thesis - 5 year outlook',
          content: 'Despite current headwinds, Apple\'s ecosystem lock-in and cash generation capabilities make it a solid long-term hold. The transition to services provides recurring revenue stability.',
          author: 'LongTermValue',
          upvotes: 567,
          comments: 123,
          sentiment: 'bullish',
          sentimentScore: 76,
          url: 'https://reddit.com/r/investing/comments/aapl_long_term',
          subreddit: 'investing'
        }
      ],
      metadata: {
        subreddit: 'investing',
        totalUpvotes: 1234,
        totalComments: 356,
        processedAt: '2024-03-15T11:00:00Z',
        source: 'static'
      }
    }
  },
  'TSLA': {
    'stocks': {
      stock: 'TSLA',
      platform: 'reddit',
      timestamp: '2024-03-15T10:45:00Z',
      totalMentions: 412,
      sentimentScore: 61,
      positivePercentage: 47,
      negativePercentage: 31,
      neutralPercentage: 22,
      topPosts: [
        {
          id: 'tsla_post1',
          title: 'Tesla FSD Beta shows impressive improvements',
          content: 'The latest FSD beta update is genuinely impressive. The neural network improvements are noticeable in city driving scenarios. This could be the breakthrough we\'ve been waiting for.',
          author: 'AutonomousBull',
          upvotes: 734,
          comments: 289,
          sentiment: 'bullish',
          sentimentScore: 82,
          url: 'https://reddit.com/r/stocks/comments/tsla_fsd_bull',
          subreddit: 'stocks'
        },
        {
          id: 'tsla_post2',
          title: 'Tesla margins under pressure - competition heating up',
          content: 'Chinese EV manufacturers are gaining market share with competitive pricing. Tesla\'s margin compression is concerning and the price wars are intensifying globally.',
          author: 'EVRealist',
          upvotes: 523,
          comments: 167,
          sentiment: 'bearish',
          sentimentScore: 31,
          url: 'https://reddit.com/r/stocks/comments/tsla_margins_bear',
          subreddit: 'stocks'
        },
        {
          id: 'tsla_post3',
          title: 'Tesla Cybertruck production ramp analysis',
          content: 'Production numbers for Cybertruck are gradually improving but still below initial projections. Manufacturing complexity remains a challenge but progress is steady.',
          author: 'ProductionTracker',
          upvotes: 398,
          comments: 134,
          sentiment: 'neutral',
          sentimentScore: 51,
          url: 'https://reddit.com/r/stocks/comments/tsla_cybertruck_neutral',
          subreddit: 'stocks'
        }
      ],
      metadata: {
        subreddit: 'stocks',
        totalUpvotes: 1655,
        totalComments: 590,
        processedAt: '2024-03-15T10:45:00Z',
        source: 'static'
      }
    }
  },
  'GOOGL': {
    'stocks': {
      stock: 'GOOGL',
      platform: 'reddit',
      timestamp: '2024-03-15T09:15:00Z',
      totalMentions: 156,
      sentimentScore: 74,
      positivePercentage: 61,
      negativePercentage: 19,
      neutralPercentage: 20,
      topPosts: [
        {
          id: 'googl_post1',
          title: 'Google Cloud gaining enterprise traction',
          content: 'Google Cloud Platform is finally gaining serious enterprise customers. The AI/ML capabilities are differentiating it from AWS and Azure. Revenue growth is accelerating.',
          author: 'CloudAnalyst',
          upvotes: 445,
          comments: 87,
          sentiment: 'bullish',
          sentimentScore: 79,
          url: 'https://reddit.com/r/stocks/comments/googl_cloud_bull',
          subreddit: 'stocks'
        },
        {
          id: 'googl_post2',
          title: 'YouTube ad revenue concerns persist',
          content: 'YouTube\'s ad revenue growth continues to decelerate. Competition from TikTok and other platforms is impacting engagement metrics. The creator economy is also fragmenting.',
          author: 'AdTechWatcher',
          upvotes: 287,
          comments: 92,
          sentiment: 'bearish',
          sentimentScore: 34,
          url: 'https://reddit.com/r/stocks/comments/googl_youtube_bear',
          subreddit: 'stocks'
        }
      ],
      metadata: {
        subreddit: 'stocks',
        totalUpvotes: 732,
        totalComments: 179,
        processedAt: '2024-03-15T09:15:00Z',
        source: 'static'
      }
    }
  }
}

export function getStaticRedditData(stock: string, subreddit: string): RedditSentimentData | null {
  return staticRedditDataByStock[stock]?.[subreddit] || null
}

export function generateFallbackRedditData(stock: string, subreddit: string): RedditSentimentData {
  // If we have static data, use it
  const staticData = getStaticRedditData(stock, subreddit)
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

  // Otherwise generate generic mock data
  const mockPosts: RedditPost[] = [
    {
      id: 'mock_post1',
      title: `${stock} showing strong technical signals`,
      content: 'Recent price action and volume patterns suggest underlying strength. The fundamentals also look solid based on the latest quarterly results.',
      author: 'TechnicalAnalyst',
      upvotes: 245,
      comments: 67,
      sentiment: 'bullish',
      sentimentScore: 78,
      url: `https://reddit.com/r/${subreddit}/comments/mock1`,
      subreddit
    },
    {
      id: 'mock_post2',
      title: `Concerns about ${stock} valuation metrics`,
      content: 'Current valuation seems stretched given the macroeconomic headwinds. Might be prudent to wait for a better entry point.',
      author: 'ValueInvestor',
      upvotes: 134,
      comments: 45,
      sentiment: 'bearish',
      sentimentScore: 25,
      url: `https://reddit.com/r/${subreddit}/comments/mock2`,
      subreddit
    },
    {
      id: 'mock_post3',
      title: `${stock} quarterly results discussion thread`,
      content: 'Mixed results this quarter. Some positive developments but also areas of concern. Overall outlook remains uncertain.',
      author: 'EarningsTracker',
      upvotes: 89,
      comments: 23,
      sentiment: 'neutral',
      sentimentScore: 52,
      url: `https://reddit.com/r/${subreddit}/comments/mock3`,
      subreddit
    }
  ]

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
}