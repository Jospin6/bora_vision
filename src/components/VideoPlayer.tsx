'use client';

import { useRef, useEffect, useState } from 'react';
import { VideoData } from '@/types';
import { FaPlay, FaPause } from 'react-icons/fa';

interface VideoPlayerProps {
  video: VideoData;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function VideoPlayer({ video, isPlaying, onPlayPause }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleClick = () => {
    onPlayPause();
    setShowControls(true);
    setTimeout(() => setShowControls(false), 1000);
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center">
      {video.format === 'mp4' || video.format === 'video' ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={video.thumbnail}
          onClick={handleClick}
        >
          <source src={video.url} type="video/mp4" />
        </video>
      ) : (
        <img
          src={video.url}
          alt={video.content.title}
          className="h-full w-full object-cover cursor-pointer"
          onClick={handleClick}
        />
      )}
      
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
            {isPlaying ? (
              <FaPause className="text-white text-2xl" />
            ) : (
              <FaPlay className="text-white text-2xl ml-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}