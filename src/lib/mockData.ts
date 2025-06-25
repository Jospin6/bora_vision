import { VideoData } from '@/types';

export const mockVideos: VideoData[] = [
  {
    id: '1',
    contentId: 'content-1',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    format: 'mp4',
    quality: '720p',
    bitrate: 1200,
    size: 1048576,
    duration: 30,
    uploaderId: 'user-1',
    thumbnail: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: {
      id: 'content-1',
      title: 'Incroyable coucher de soleil sur la plage 🌅 #sunset #beach #nature'
    },
    uploader: {
      id: 'user-1',
      username: 'marie_adventures',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    likes: 12500,
    comments: 324,
    shares: 156,
    bookmarks: 89,
    hashtags: ['sunset', 'beach', 'nature', 'photography'],
    music: 'Summer Vibes - Tropical House Mix',
    createdAt: '2h'
  },
  {
    id: '2',
    contentId: 'content-2',
    url: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400',
    format: 'jpg',
    quality: '1080p',
    size: 2097152,
    uploaderId: 'user-2',
    content: {
      id: 'content-2',
      title: 'Recette facile de cookies aux pépites de chocolat 🍪 Qui veut la recette ?'
    },
    uploader: {
      id: 'user-2',
      username: 'chef_alex',
      avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    likes: 8900,
    comments: 567,
    shares: 234,
    bookmarks: 445,
    hashtags: ['cookies', 'recette', 'chocolate', 'cooking'],
    music: 'Cooking Time - Upbeat Kitchen',
    createdAt: '5h'
  },
  {
    id: '3',
    contentId: 'content-3',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    format: 'mp4',
    quality: '720p',
    bitrate: 1500,
    size: 2097152,
    duration: 45,
    uploaderId: 'user-3',
    thumbnail: 'https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: {
      id: 'content-3',
      title: 'Danse freestyle dans les rues de Paris 💃 #dance #paris #freestyle'
    },
    uploader: {
      id: 'user-3',
      username: 'dance_lily',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    likes: 25600,
    comments: 892,
    shares: 445,
    bookmarks: 234,
    hashtags: ['dance', 'paris', 'freestyle', 'street'],
    music: 'Urban Beat - Hip Hop Instrumental',
    createdAt: '8h'
  },
  {
    id: '4',
    contentId: 'content-4',
    url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    format: 'jpg',
    quality: '1080p',
    size: 1572864,
    uploaderId: 'user-4',
    content: {
      id: 'content-4',
      title: 'Look du jour : style casual chic 👗 #ootd #fashion #style'
    },
    uploader: {
      id: 'user-4',
      username: 'fashionista_emma',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    likes: 15200,
    comments: 445,
    shares: 189,
    bookmarks: 678,
    hashtags: ['ootd', 'fashion', 'style', 'casual'],
    music: 'Fashion Week - Trendy Pop',
    createdAt: '12h'
  },
  {
    id: '5',
    contentId: 'content-5',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    format: 'mp4',
    quality: '1080p',
    bitrate: 2000,
    size: 5242880,
    duration: 60,
    uploaderId: 'user-5',
    thumbnail: 'https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg?auto=compress&cs=tinysrgb&w=400',
    content: {
      id: 'content-5',
      title: 'Tutoriel makeup look naturel en 5 minutes ✨ #makeup #beauty #tutorial'
    },
    uploader: {
      id: 'user-5',
      username: 'beauty_sarah',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    likes: 32100,
    comments: 1245,
    shares: 567,
    bookmarks: 892,
    hashtags: ['makeup', 'beauty', 'tutorial', 'natural'],
    music: 'Beauty Routine - Soft Acoustic',
    createdAt: '1j'
  }
];