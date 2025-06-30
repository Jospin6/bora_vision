// types.ts
import { Post, Hashtag } from '@prisma/client'

export type HashtagWithDetails = Hashtag & {
  _count?: {
    posts: number
  }
  posts?: Post[]
}