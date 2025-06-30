// types.ts
import { Post, User, Topic } from '@prisma/client'

export type TopicWithDetails = Topic & {
  _count?: {
    posts: number
    User: number
  }
  posts?: Post[]
  User?: User[]
}