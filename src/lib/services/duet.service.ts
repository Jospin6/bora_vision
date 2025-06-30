import { DuetRepository } from '../repositories/duet.repository';
import { DuetWithRelations } from '../../types/duet';

export const DuetService = {
  async createDuet(data: {
    originalPostId: string;
    duetPostId: string;
    userId?: string;
  }): Promise<DuetWithRelations> {
    const existingDuet = await DuetRepository.findByDuetPostId(data.duetPostId);
    if (existingDuet) {
      throw new Error('Un duet existe déjà pour ce post');
    }

    return DuetRepository.create(data);
  },

  async getDuetById(id: string): Promise<DuetWithRelations> {
    const duet = await DuetRepository.findById(id);
    if (!duet) {
      throw new Error('Duet non trouvé');
    }
    return duet;
  },

  async getDuetsByOriginalPost(originalPostId: string): Promise<DuetWithRelations[]> {
    return DuetRepository.findByOriginalPostId(originalPostId);
  },

  async getDuetByDuetPost(duetPostId: string): Promise<DuetWithRelations> {
    const duet = await DuetRepository.findByDuetPostId(duetPostId);
    if (!duet) {
      throw new Error('Duet non trouvé');
    }
    return duet;
  },

  async getDuetsByUser(userId: string): Promise<DuetWithRelations[]> {
    return DuetRepository.findByUserId(userId);
  },

  async getAllDuets(): Promise<DuetWithRelations[]> {
    return DuetRepository.findAll();
  },

  async updateDuet(
    id: string,
    data: {
      originalPostId?: string;
      duetPostId?: string;
      userId?: string | null;
    }
  ): Promise<DuetWithRelations> {
    const existingDuet = await DuetRepository.findById(id);
    if (!existingDuet) {
      throw new Error('Duet non trouvé');
    }

    return DuetRepository.update(id, data);
  },

  async deleteDuet(id: string): Promise<void> {
    const existingDuet = await DuetRepository.findById(id);
    if (!existingDuet) {
      throw new Error('Duet non trouvé');
    }

    await DuetRepository.delete(id);
  },

  async deleteDuetByDuetPost(duetPostId: string): Promise<void> {
    const existingDuet = await DuetRepository.findByDuetPostId(duetPostId);
    if (!existingDuet) {
      throw new Error('Duet non trouvé');
    }

    await DuetRepository.deleteByDuetPostId(duetPostId);
  },
};