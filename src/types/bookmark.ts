import { User, Post, Bookmark } from '@prisma/client'

export type BookmarkWithPost = Bookmark & {
  post: Post & {
    author: User
    _count: {
      likes: number
      comments: number
    }
  }
}