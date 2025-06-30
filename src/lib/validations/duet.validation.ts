import { z } from 'zod';

export const createDuetSchema = z.object({
  originalPostId: z.string().uuid(),
  duetPostId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

export const updateDuetSchema = z.object({
  originalPostId: z.string().uuid().optional(),
  duetPostId: z.string().uuid().optional(),
  userId: z.string().uuid().nullable().optional(),
});

export type CreateDuetDto = z.infer<typeof createDuetSchema>;
export type UpdateDuetDto = z.infer<typeof updateDuetSchema>;