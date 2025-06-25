'use client';

import { useState, useRef, useEffect } from 'react';
import { VideoData } from '@/types';
import VideoPlayer from './VideoPlayer';
import VideoControls from './VideoControls';
import VideoInfo from './VideoInfo';

interface VideoFeedProps {
  videos: VideoData[];
  currentIndex: number;
  onVideoChange: (direction: 'up' | 'down') => void;
}

export default function VideoFeed({ videos, currentIndex, onVideoChange }: VideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const [translateY, setTranslateY] = useState(0);

  const currentVideo = videos[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    setTranslateY(-diff * 0.5);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onVideoChange('down');
      } else {
        onVideoChange('up');
      }
    }
    
    setTranslateY(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      onVideoChange('down');
    } else {
      onVideoChange('up');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onVideoChange('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onVideoChange('down');
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying]);

  return (
    <div className="h-full w-full relative">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
        <div className="flex flex-col items-center space-y-4 pointer-events-auto">
          <button
            onClick={() => onVideoChange('up')}
            disabled={currentIndex === 0}
            className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {currentIndex + 1} / {videos.length}
          </div>
          
          <button
            onClick={() => onVideoChange('down')}
            disabled={currentIndex === videos.length - 1}
            className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className="transition-transform duration-300 ease-out lg:flex lg:items-center lg:justify-center lg:h-full"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          <div className="h-screen w-full lg:h-[90vh] lg:max-w-sm lg:mx-auto lg:rounded-2xl lg:overflow-hidden lg:shadow-2xl relative bg-black">
            <VideoPlayer
              video={currentVideo}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
            
            <VideoControls
              video={currentVideo}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
            
            <VideoInfo video={currentVideo} />
          </div>
        </div>
      </div>
    </div>
  );
}