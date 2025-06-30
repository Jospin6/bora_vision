// types.ts
import { User, LikeComment, Reply } from '@prisma/client'

export type CommentWithDetails = {
  id: string
  text: string
  author: User
  postId: string
  replies: (Reply & {
    author: User
  })[]
  likes: LikeComment[]
  _count?: {
    likes: number
    replies: number
  }
  createdAt: Date
}