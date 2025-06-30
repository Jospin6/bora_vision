// types.ts
import { Post, User } from '@prisma/client'

export type ViewWithDetails = {
  id: string
  postId: string
  viewerId: string | null
  device: string | null
  country: string | null
  duration: number | null
  createdAt: Date
  post?: Post
  viewer?: User | null
}

export type ViewStats = {
  totalViews: number
  uniqueViewers: number
  avgDuration: number | null
  byCountry: Array<{ country: string | null, _count: number }>
  byDevice: Array<{ device: string | null, _count: number }>
}