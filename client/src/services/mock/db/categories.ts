import type { Category } from '@shared/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Studio-grade headphones, speakers, and earbuds tuned for clarity.',
    image:
      'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
  {
    id: 'cat-wearables',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smartwatches and trackers that blend craft with intelligence.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
  {
    id: 'cat-workspace',
    name: 'Workspace',
    slug: 'workspace',
    description: 'Mechanical keyboards, precision mice, and desk essentials.',
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
  {
    id: 'cat-smart-home',
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Ambient lighting and hubs for a connected, considered home.',
    image:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
  {
    id: 'cat-carry',
    name: 'Bags & Carry',
    slug: 'bags-carry',
    description: 'Technical bags engineered to carry your craft in style.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Chargers, stands, and cables — the details that finish the setup.',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    parentId: null,
    isActive: true,
  },
];
