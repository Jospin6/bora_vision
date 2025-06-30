// types.ts
import { User, Post, Notification } from '@prisma/client'

export type NotificationWithDetails = Notification & {
  post?: Post | null
  sender?: User | null
}