# Reddit Sentiment Analysis N8N Workflow

This workflow integrates Reddit sentiment analysis with the sentiment app using N8N automation.

## Setup Instructions

### 1. Install N8N
```bash
npm install -g n8n
```

### 2. Import the Workflow
1. Start N8N: `n8n start`
2. Open http://localhost:5678
3. Go to Workflows > Import from file
4. Select `reddit-sentiment-workflow.json`

### 3. Configure Reddit API
1. Create a Reddit app at https://www.reddit.com/prefs/apps
2. Configure the Reddit node with your credentials:
   - Client ID
   - Client Secret
   - Username
   - Password

### 4. Configure Database (Optional)
If using database storage, configure the Supabase node with:
- Project URL
- API Key
- Table: `reddit_sentiment`

### 5. Test the Workflow
The workflow will be available at:
```
GET http://localhost:5678/webhook/reddit-sentiment?stock=AAPL&subreddit=stocks
```

## Workflow Overview

1. **Webhook Trigger**: Receives requests with stock symbol and subreddit
2. **Fetch Reddit Posts**: Gets recent posts from specified subreddit
3. **Fetch Comments**: Gets top comments for each post
4. **Sentiment Analysis**: Analyzes text for bullish/bearish sentiment
5. **Store in Database**: Saves processed data (optional)
6. **Aggregate Data**: Calculates sentiment metrics
7. **Return Response**: Sends aggregated sentiment data back to the app

## API Response Format

```json
{
  "stock": "AAPL",
  "platform": "reddit",
  "timestamp": "2025-08-29T00:00:00.000Z",
  "totalMentions": 25,
  "sentimentScore": 67,
  "positivePercentage": 45,
  "negativePercentage": 20,
  "neutralPercentage": 35,
  "topPosts": [
    {
      "id": "abc123",
      "title": "AAPL to the moon!",
      "content": "Apple stock is looking very bullish...",
      "author": "redditor123",
      "upvotes": 150,
      "comments": 25,
      "sentiment": "bullish",
      "sentimentScore": 75,
      "url": "https://reddit.com/r/stocks/comments/abc123"
    }
  ],
  "metadata": {
    "subreddit": "stocks",
    "totalUpvotes": 1250,
    "totalComments": 300,
    "processedAt": "2025-08-29T00:00:00.000Z"
  }
}
```

## Usage in App

The workflow integrates with the app when users click the Reddit platform card. The app will make a request to the N8N webhook and display the returned sentiment data.