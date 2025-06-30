import { Duet, Post, User } from '@prisma/client';

export type DuetWithRelations = Duet & {
  originalPost: Post;
  duetPost: Post;
  User: User | null;
};

export type CreateDuetInput = {
  originalPostId: string;
  duetPostId: string;
  userId?: string;
};

export type UpdateDuetInput = {
  originalPostId?: string;
  duetPostId?: string;
  userId?: string | null;
};