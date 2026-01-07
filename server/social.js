// ✅ server/social.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/youtube', async (req, res) => {
    try {
        const query = 'Money management OR Teen Savings OR Finance podcast';
        const maxResults = 6;
        const apiKey = process.env.YOUTUBE_API_KEY;
        console.log('📦 YOUTUBE API KEY:', process.env.YOUTUBE_API_KEY); // or whatever you’re using

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`;

        const response = await axios.get(url);

        const videos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url
        }));

        res.json(videos);
    } catch (err) {
        console.error('YouTube API error:', err.message);
        console.error('Full Error:', err.response?.data || err);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

export default router;
