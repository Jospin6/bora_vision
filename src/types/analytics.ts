// types.ts
import { User, UserAnalytic } from '@prisma/client'

export type UserAnalyticWithUser = UserAnalytic & {
  user: Pick<User, 'id' | 'username' | 'avatar'>
}