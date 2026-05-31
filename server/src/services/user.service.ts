import { repositories } from '@/repositories';
import { ApiError } from '@/utils/ApiError';
import type { UserRole } from '@shared/types';

export const userService = {
  list() {
    return repositories.users.listAll();
  },
  async updateRole(id: string, role: UserRole) {
    const updated = await repositories.users.updateRole(id, role);
    if (!updated) throw ApiError.notFound('User not found');
    return updated;
  },
};
