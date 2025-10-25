# API Setup Instructions for Snail Studios Website

This document explains how to set up API integrations for your social media platforms to display real-time data on your website.

## Required API Keys

### 1. YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Replace `YOUR_YOUTUBE_API_KEY` in `api-integrations.js`
6. Get your YouTube Channel ID and replace `YOUR_YOUTUBE_CHANNEL_ID`

### 2. Twitch API
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Get your Client ID
4. Generate an App Access Token
5. Replace `YOUR_TWITCH_CLIENT_ID` in `api-integrations.js`

### 3. Twitter API
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project/app
3. Generate a Bearer Token
4. Replace `YOUR_TWITTER_BEARER_TOKEN` in `api-integrations.js`

### 4. Instagram API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Basic Display product
4. Generate a User Access Token
5. Replace `YOUR_INSTAGRAM_ACCESS_TOKEN` in `api-integrations.js`

### 5. TikTok API
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Get your access token
4. Replace `YOUR_TIKTOK_ACCESS_TOKEN` in `api-integrations.js`

## Important Notes

### CORS Issues
Most social media APIs have CORS restrictions. You have two options:

1. **Use a Backend Proxy** (Recommended)
   - Create a backend service (Node.js, Python, etc.) that makes API calls
   - Your frontend calls your backend, which calls the social media APIs
   - This avoids CORS issues and keeps your API keys secure

2. **Use a CORS Proxy Service**
   - Services like `cors-anywhere` or `allorigins` can help
   - Not recommended for production due to security concerns

### Backend Proxy Example (Node.js/Express)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/youtube/:channelId', async (req, res) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${req.params.channelId}&key=${process.env.YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Proxy server running on port 3001');
});
```

### Environment Variables
Create a `.env` file in your project root:

```
YOUTUBE_API_KEY=your_youtube_api_key
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_ACCESS_TOKEN=your_twitch_access_token
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
TIKTOK_ACCESS_TOKEN=your_tiktok_access_token
```

## Platform-Specific Setup

### YouTube
- **API**: YouTube Data API v3
- **Quota**: 10,000 units per day (free tier)
- **Rate Limits**: 100 requests per 100 seconds per user

### Twitch
- **API**: Twitch Helix API
- **Rate Limits**: 800 requests per minute
- **Authentication**: App Access Token required

### Twitter
- **API**: Twitter API v2
- **Rate Limits**: 300 requests per 15 minutes
- **Authentication**: Bearer Token required

### Instagram
- **API**: Instagram Basic Display API
- **Rate Limits**: 200 requests per hour
- **Authentication**: User Access Token required

### TikTok
- **API**: TikTok for Developers
- **Rate Limits**: Varies by endpoint
- **Authentication**: Access Token required

## Testing Your Setup

1. Open your website
2. Check the browser console for any API errors
3. Verify that data is loading correctly
4. Test the live status indicators
5. Check that embedded content is working

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Use a backend proxy
2. **Rate Limiting**: Implement request caching
3. **API Key Issues**: Verify keys are correct and have proper permissions
4. **Embed Issues**: Check if domains are whitelisted

### Debug Mode:
Add this to your `api-integrations.js` to see detailed error messages:

```javascript
// Add at the top of the file
const DEBUG = true;

// Add this to each API call
if (DEBUG) {
    console.log('API Response:', data);
}
```

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Use environment variables**
3. **Implement rate limiting**
4. **Use HTTPS in production**
5. **Regularly rotate API keys**

## Alternative Solutions

If setting up APIs is too complex, consider:

1. **Static Data**: Update manually or via CMS
2. **Third-party Services**: Use services like Social Media APIs
3. **Web Scraping**: Use services like Puppeteer (backend only)
4. **Manual Updates**: Update stats manually in the HTML

## Support

For issues with specific APIs, check their official documentation:
- [YouTube API Docs](https://developers.google.com/youtube/v3)
- [Twitch API Docs](https://dev.twitch.tv/docs/api/)
- [Twitter API Docs](https://developer.twitter.com/en/docs)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api/)
- [TikTok API Docs](https://developers.tiktok.com/)
