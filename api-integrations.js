// API Integration for Social Media Platforms
class SocialMediaAPI {
    constructor() {
        this.apiKeys = {
            // You'll need to get these API keys from each platform
            youtube: 'YOUR_YOUTUBE_API_KEY',
            twitch: 'YOUR_TWITCH_CLIENT_ID',
            twitter: 'YOUR_TWITTER_BEARER_TOKEN',
            instagram: 'YOUR_INSTAGRAM_ACCESS_TOKEN',
            tiktok: 'YOUR_TIKTOK_ACCESS_TOKEN'
        };
        
        this.channels = {
            youtube: 'YOUR_YOUTUBE_CHANNEL_ID',
            twitch: 'basicallysnail',
            kick: 'basicallysnail',
            twitter: 'basicallysnail',
            tiktok: 'basicallysnail',
            instagram: 'basicallysnail'
        };
        
        this.init();
    }

    init() {
        this.loadAllData();
        // Refresh data every 5 minutes
        setInterval(() => this.loadAllData(), 300000);
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadYouTubeData(),
                this.loadTwitchData(),
                this.loadKickData(),
                this.loadTwitterData(),
                this.loadTikTokData(),
                this.loadInstagramData()
            ]);
            this.updateTotals();
        } catch (error) {
            console.error('Error loading social media data:', error);
        }
    }

    // YouTube API Integration
    async loadYouTubeData() {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${this.channels.youtube}&key=${this.apiKeys.youtube}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const stats = data.items[0].statistics;
                this.updateElement('youtube-subs', this.formatNumber(stats.subscriberCount));
                this.updateElement('youtube-views', this.formatNumber(stats.viewCount));
                this.updateElement('youtube-videos', this.formatNumber(stats.videoCount));
                
                // Load latest video
                await this.loadLatestYouTubeVideo();
            }
        } catch (error) {
            console.error('YouTube API Error:', error);
            this.updateElement('youtube-subs', 'N/A');
            this.updateElement('youtube-views', 'N/A');
            this.updateElement('youtube-videos', 'N/A');
        }
    }

    async loadLatestYouTubeVideo() {
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.channels.youtube}&maxResults=1&order=date&type=video&key=${this.apiKeys.youtube}`
            );
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const video = data.items[0];
                const embedHtml = `
                    <iframe width="100%" height="100%" 
                            src="https://www.youtube.com/embed/${video.id.videoId}" 
                            frameborder="0" 
                            allowfullscreen>
                    </iframe>
                `;
                document.getElementById('latest-video-placeholder').innerHTML = embedHtml;
            }
        } catch (error) {
            console.error('Error loading latest YouTube video:', error);
        }
    }

    // Twitch API Integration
    async loadTwitchData() {
        try {
            // Get user info
            const userResponse = await fetch(
                `https://api.twitch.tv/helix/users?login=${this.channels.twitch}`,
                {
                    headers: {
                        'Client-ID': this.apiKeys.twitch,
                        'Authorization': `Bearer ${this.apiKeys.twitch}`
                    }
                }
            );
            const userData = await userResponse.json();
            
            if (userData.data && userData.data.length > 0) {
                const userId = userData.data[0].id;
                
                // Get follower count
                const followResponse = await fetch(
                    `https://api.twitch.tv/helix/users/follows?to_id=${userId}`,
                    {
                        headers: {
                            'Client-ID': this.apiKeys.twitch,
                            'Authorization': `Bearer ${this.apiKeys.twitch}`
                        }
                    }
                );
                const followData = await followResponse.json();
                this.updateElement('twitch-followers', this.formatNumber(followData.total));
                
                // Check if live
                const streamResponse = await fetch(
                    `https://api.twitch.tv/helix/streams?user_id=${userId}`,
                    {
                        headers: {
                            'Client-ID': this.apiKeys.twitch,
                            'Authorization': `Bearer ${this.apiKeys.twitch}`
                        }
                    }
                );
                const streamData = await streamResponse.json();
                
                const statusElement = document.getElementById('twitch-status');
                if (streamData.data && streamData.data.length > 0) {
                    statusElement.textContent = '🔴 LIVE';
                    statusElement.className = 'live-status live';
                } else {
                    statusElement.textContent = 'Offline';
                    statusElement.className = 'live-status offline';
                }
            }
        } catch (error) {
            console.error('Twitch API Error:', error);
            this.updateElement('twitch-followers', 'N/A');
            document.getElementById('twitch-status').textContent = 'Error';
        }
    }

    // Kick API Integration (Note: Kick doesn't have a public API, so this is a placeholder)
    async loadKickData() {
        try {
            // Since Kick doesn't have a public API, we'll use web scraping or a proxy
            // This is a simplified version - you might need a backend service for this
            this.updateElement('kick-followers', 'N/A');
            document.getElementById('kick-status').textContent = 'Check Kick.com';
            document.getElementById('kick-status').className = 'live-status offline';
        } catch (error) {
            console.error('Kick API Error:', error);
        }
    }

    // Twitter API Integration
    async loadTwitterData() {
        try {
            const response = await fetch(
                `https://api.twitter.com/2/users/by/username/${this.channels.twitter}?user.fields=public_metrics`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKeys.twitter}`
                    }
                }
            );
            const data = await response.json();
            
            if (data.data) {
                this.updateElement('twitter-followers', this.formatNumber(data.data.public_metrics.followers_count));
                this.updateElement('twitter-posts', this.formatNumber(data.data.public_metrics.tweet_count));
            }
        } catch (error) {
            console.error('Twitter API Error:', error);
            this.updateElement('twitter-followers', 'N/A');
            this.updateElement('twitter-posts', 'N/A');
        }
    }

    // TikTok API Integration
    async loadTikTokData() {
        try {
            // TikTok API requires special permissions and is complex
            // This is a placeholder - you'll need to implement TikTok's official API
            this.updateElement('tiktok-followers', 'N/A');
            this.updateElement('tiktok-likes', 'N/A');
        } catch (error) {
            console.error('TikTok API Error:', error);
        }
    }

    // Instagram API Integration
    async loadInstagramData() {
        try {
            // Instagram Basic Display API
            const response = await fetch(
                `https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${this.apiKeys.instagram}`
            );
            const data = await response.json();
            
            this.updateElement('instagram-followers', this.formatNumber(data.followers_count));
            this.updateElement('instagram-posts', this.formatNumber(data.media_count));
        } catch (error) {
            console.error('Instagram API Error:', error);
            this.updateElement('instagram-followers', 'N/A');
            this.updateElement('instagram-posts', 'N/A');
        }
    }

    // Utility functions
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatNumber(num) {
        if (num === null || num === undefined) return 'N/A';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    updateTotals() {
        // Calculate totals from all platforms
        const followers = this.getTotalFollowers();
        const videos = this.getTotalVideos();
        const views = this.getTotalViews();
        
        this.updateElement('total-followers', this.formatNumber(followers));
        this.updateElement('total-videos', this.formatNumber(videos));
        this.updateElement('total-views', this.formatNumber(views));
    }

    getTotalFollowers() {
        // This would sum up followers from all platforms
        // For now, return a placeholder
        return 0;
    }

    getTotalVideos() {
        // This would sum up videos from all platforms
        return 0;
    }

    getTotalViews() {
        // This would sum up views from all platforms
        return 0;
    }
}

// Initialize the API when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Note: You'll need to replace the placeholder API keys with real ones
    console.log('Social Media API Integration loaded');
    console.log('Please configure your API keys in api-integrations.js');
    
    // For demonstration, we'll show how to set up the API
    // const socialAPI = new SocialMediaAPI();
});

// Fallback data loading (when APIs are not available)
function loadFallbackData() {
    // Set some example data when APIs are not configured
    document.getElementById('youtube-subs').textContent = '0';
    document.getElementById('youtube-views').textContent = '0';
    document.getElementById('youtube-videos').textContent = '0';
    
    document.getElementById('twitch-followers').textContent = '0';
    document.getElementById('twitch-status').textContent = 'Offline';
    document.getElementById('twitch-status').className = 'live-status offline';
    
    document.getElementById('kick-followers').textContent = '0';
    document.getElementById('kick-status').textContent = 'Offline';
    document.getElementById('kick-status').className = 'live-status offline';
    
    document.getElementById('twitter-followers').textContent = '0';
    document.getElementById('twitter-posts').textContent = '0';
    
    document.getElementById('tiktok-followers').textContent = '0';
    document.getElementById('tiktok-likes').textContent = '0';
    
    document.getElementById('instagram-followers').textContent = '0';
    document.getElementById('instagram-posts').textContent = '0';
    
    document.getElementById('total-followers').textContent = '0';
    document.getElementById('total-videos').textContent = '0';
    document.getElementById('total-views').textContent = '0';
}

// Load fallback data immediately
loadFallbackData();
