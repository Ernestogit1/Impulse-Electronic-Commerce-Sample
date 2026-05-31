import { repositories } from '@/repositories';

export const categoryService = {
  list() {
    return repositories.categories.list();
  },
};
