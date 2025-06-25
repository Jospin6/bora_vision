'use client';

import { useState } from 'react';
import { VideoData } from '@/types';
import { 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaBookmark,
  FaEllipsisV 
} from 'react-icons/fa';

interface VideoControlsProps {
  video: VideoData;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function VideoControls({ video }: VideoControlsProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
          <img
            src={video.uploader.avatar}
            alt={video.uploader.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#FF0050] rounded-full flex items-center justify-center text-white text-xs font-bold">
          +
        </div>
      </div>

      {/* Like */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setLiked(!liked)}
          className={`p-3 rounded-full transition-all duration-300 ${
            liked ? 'bg-[#FF0050] text-white' : 'bg-black/50 text-white hover:bg-white/20'
          }`}
        >
          <FaHeart className="text-xl" />
        </button>
        <span className="text-xs text-white mt-1">
          {formatCount(video.likes + (liked ? 1 : 0))}
        </span>
      </div>

      {/* Comment */}
      <div className="flex flex-col items-center">
        <button className="p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all duration-300">
          <FaComment className="text-xl" />
        </button>
        <span className="text-xs text-white mt-1">
          {formatCount(video.comments)}
        </span>
      </div>

      {/* Bookmark */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`p-3 rounded-full transition-all duration-300 ${
            bookmarked ? 'bg-[#25F5FF] text-black' : 'bg-black/50 text-white hover:bg-white/20'
          }`}
        >
          <FaBookmark className="text-xl" />
        </button>
        <span className="text-xs text-white mt-1">
          {formatCount(video.bookmarks + (bookmarked ? 1 : 0))}
        </span>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center">
        <button className="p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all duration-300">
          <FaShare className="text-xl" />
        </button>
        <span className="text-xs text-white mt-1">
          {formatCount(video.shares)}
        </span>
      </div>

      {/* More */}
      <button className="p-3 rounded-full bg-black/50 text-white hover:bg-white/20 transition-all duration-300">
        <FaEllipsisV className="text-xl" />
      </button>
    </div>
  );
}