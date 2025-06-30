// types.ts
import { Sound, Post } from '@prisma/client'

export type SoundWithPost = Sound & {
  post: Post
}