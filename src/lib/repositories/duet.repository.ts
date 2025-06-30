import prisma from '../../../prisma/prisma';
import { DuetWithRelations } from '../../types/duet';

export const DuetRepository = {
  async create(data: {
    originalPostId: string;
    duetPostId: string;
    userId?: string;
  }): Promise<DuetWithRelations> {
    return prisma.duet.create({
      data: {
        originalPostId: data.originalPostId,
        duetPostId: data.duetPostId,
        userId: data.userId,
      },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async findById(id: string): Promise<DuetWithRelations | null> {
    return prisma.duet.findUnique({
      where: { id },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async findByOriginalPostId(originalPostId: string): Promise<DuetWithRelations[]> {
    return prisma.duet.findMany({
      where: { originalPostId },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async findByDuetPostId(duetPostId: string): Promise<DuetWithRelations | null> {
    return prisma.duet.findFirst({
      where: { duetPostId },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async findByUserId(userId: string): Promise<DuetWithRelations[]> {
    return prisma.duet.findMany({
      where: { userId },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async findAll(): Promise<DuetWithRelations[]> {
    return prisma.duet.findMany({
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async update(
    id: string,
    data: {
      originalPostId?: string;
      duetPostId?: string;
      userId?: string | null;
    }
  ): Promise<DuetWithRelations> {
    return prisma.duet.update({
      where: { id },
      data: {
        originalPostId: data.originalPostId,
        duetPostId: data.duetPostId,
        userId: data.userId,
      },
      include: {
        originalPost: true,
        duetPost: true,
        User: true,
      },
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.duet.delete({
      where: { id },
    });
  },

  async deleteByDuetPostId(duetPostId: string): Promise<void> {
    const duet = await prisma.duet.findFirst({
      where: { duetPostId },
      select: { id: true },
    });
    if (duet) {
      await prisma.duet.delete({
        where: { id: duet.id },
      });
    }
  },
};