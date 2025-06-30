// types.ts
import { User, Hashtag, Like, Comment, Sound, Post } from '@prisma/client'

export type PostWithDetails = Post & {
  author: User
  hashtags: Hashtag[]
  likes: Like[]
  comments: (Comment & {
    author: User
  })[]
  sound: Sound | null
  _count?: {
    likes: number
    comments: number
    views: number
  }
}