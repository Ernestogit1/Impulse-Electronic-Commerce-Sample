import type { User } from '@shared/types';

/** Demo accounts used by demo-mode "instant sign-in" (no Firebase needed). */
export const mockUsers: User[] = [
  {
    id: 'user-customer',
    firebaseUid: 'demo-customer-uid',
    email: 'customer@impulse.ph',
    name: 'Maria Santos',
    photoURL: 'https://i.pravatar.cc/150?img=47',
    role: 'customer',
    phone: '+63 917 555 0142',
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        fullName: 'Maria Santos',
        line1: '24 Aurora Blvd',
        line2: 'Unit 7B',
        city: 'Quezon City',
        region: 'Metro Manila',
        postalCode: '1109',
        country: 'Philippines',
        phone: '+63 917 555 0142',
        isDefault: true,
      },
    ],
    passwordPlaceholder: 'firebase-managed',
    createdAt: new Date(2025, 1, 12).toISOString(),
    updatedAt: new Date(2025, 1, 12).toISOString(),
  },
  {
    id: 'user-admin',
    firebaseUid: 'demo-admin-uid',
    email: 'admin@impulse.ph',
    name: 'Impulse Admin',
    photoURL: 'https://i.pravatar.cc/150?img=12',
    role: 'admin',
    phone: '+63 917 555 0100',
    addresses: [],
    passwordPlaceholder: 'firebase-managed',
    createdAt: new Date(2025, 0, 2).toISOString(),
    updatedAt: new Date(2025, 0, 2).toISOString(),
  },
];

/** Extra customers shown in the admin user-management table. */
export const mockDirectory: User[] = [
  ...mockUsers,
  ...[
    ['Liam Cruz', 'liam.cruz@example.com', 47],
    ['Sophia Reyes', 'sophia.reyes@example.com', 32],
    ['Noah Tan', 'noah.tan@example.com', 15],
    ['Ava Mendoza', 'ava.mendoza@example.com', 5],
    ['Ethan Lim', 'ethan.lim@example.com', 60],
    ['Isabella Garcia', 'bella.garcia@example.com', 23],
  ].map(([name, email, img], i) => ({
    id: `user-${100 + i}`,
    firebaseUid: `demo-uid-${100 + i}`,
    email: email as string,
    name: name as string,
    photoURL: `https://i.pravatar.cc/150?img=${img}`,
    role: 'customer' as const,
    addresses: [],
    passwordPlaceholder: 'firebase-managed' as const,
    createdAt: new Date(2025, 2, 1 + i).toISOString(),
    updatedAt: new Date(2025, 2, 1 + i).toISOString(),
  })),
];
