import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Video {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

const SocialPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchVideos = async () => {
    try {
      const res = await axios.get<Video[]>(`${API_BASE_URL}/api/social/youtube`);
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  fetchVideos();
}, []);




  // useEffect(() => {
  //   axios
  //     .get(`${API_BASE_URL}/api/social/youtube`)
  //     .then((res) => {
  //       if (Array.isArray(res.data)) setVideos(res.data);
  //       else console.warn('Unexpected response:', res.data);
  //     })
  //     .catch((err) => console.error('Failed to fetch videos:', err))
  // }, []);
  

  return (
    <div className="min-h-screen px-6 py-10 pb-32 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            Explore Finance Videos 🎥 <span className="text-3xl"></span>
          </h1>
          <p className="text-gray-600">Listen & learn smart money moves from top creators!</p>
        </div>

        {loading ? (
          <p className="text-center text-purple-400 text-lg animate-pulse">Loading podcasts...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-red-500 text-lg">No podcasts found</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white/70 backdrop-blur-xl border-2 border-purple-300/40 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:scale-[1.03] p-4"
              >
                <div className="rounded-2xl overflow-hidden border border-purple-200">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allowFullScreen
                    className="w-full h-52 md:h-60"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-purple-800 mb-1 leading-snug">{video.title}</h3>
                  <p className="text-sm text-purple-500">🎙️ {video.channel}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPage;
