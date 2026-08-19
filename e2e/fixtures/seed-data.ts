import { UserProfile, UserRole } from '../../app/erp/types';

export const TEST_USERS: Record<UserRole, UserProfile> = {
  ADMIN: {
    id: 'usr-1',
    name: 'Om Upadhye (Admin)',
    email: 'admin@perfectprinters.com',
    role: 'ADMIN',
    department: 'Executive Management',
  },
  SALES: {
    id: 'usr-2',
    name: 'Mahesh Joshi (Sales)',
    email: 'sales@perfectprinters.com',
    role: 'SALES',
    department: 'Commercial Sales',
  },
  PRODUCTION: {
    id: 'usr-3',
    name: 'Anand Sawant (Floor Master)',
    email: 'prod@perfectprinters.com',
    role: 'PRODUCTION',
    department: 'Plant Operations',
  },
  ACCOUNTS: {
    id: 'usr-4',
    name: 'Ketan Shinde (Accounts)',
    email: 'accounts@perfectprinters.com',
    role: 'ACCOUNTS',
    department: 'Billing & Accounts',
  },
};

export function createTestSession(role: UserRole = 'ADMIN') {
  const user = TEST_USERS[role];
  return {
    authenticated: true,
    role: user.role,
    name: user.name,
    timestamp: Date.now(),
  };
}
