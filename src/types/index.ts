export interface VideoData {
  id: string;
  contentId: string;
  url: string;
  format: string;
  quality?: string;
  bitrate?: number;
  size?: number;
  duration?: number;
  uploaderId: string;
  thumbnail?: string;
  content: {
    id: string;
    title: string;
  };
  uploader: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  hashtags?: string[];
  music?: string;
  createdAt: string;
}