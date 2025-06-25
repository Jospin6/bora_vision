'use client';

import { VideoData } from '@/types';
import { FaMusic } from 'react-icons/fa';

interface VideoInfoProps {
  video: VideoData;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="absolute bottom-20 left-4 right-20 text-white">
      <div className="space-y-3">
        {/* Username */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg">@{video.uploader.username}</span>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <span className="text-sm text-gray-300">
            {video.createdAt}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm leading-relaxed max-w-xs">
          {video.content.title}
        </p>

        {/* Hashtags */}
        {video.hashtags && video.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {video.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="text-sm text-[#25F5FF] hover:text-white transition-colors cursor-pointer"
              >
                #{hashtag}
              </span>
            ))}
          </div>
        )}

        {/* Music */}
        {video.music && (
          <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm max-w-fit">
            <FaMusic className="text-xs" />
            <span className="text-xs truncate max-w-48">
              {video.music}
            </span>
          </div>
        )}

        {/* Video stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-300">
          {video.duration && (
            <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
          )}
          {video.quality && (
            <span>{video.quality}</span>
          )}
          {video.size && (
            <span>{(video.size / (1024 * 1024)).toFixed(1)}MB</span>
          )}
        </div>
      </div>
    </div>
  );
}