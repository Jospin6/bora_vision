import { User, Follow } from '@prisma/client'

export type FollowWithUser = Follow & {
  follower: User
  following: User
}