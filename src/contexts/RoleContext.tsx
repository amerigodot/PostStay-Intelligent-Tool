import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserRole, User } from '@/types';
import { users } from '@/data/mockData';

interface RoleContextType {
  currentRole: UserRole;
  currentUser: User;
  setRole: (role: UserRole) => void;
  availableRoles: UserRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const roleLabels: Record<UserRole, string> = {
  receptionist: 'Receptionist',
  'guest-relations': 'Guest Relations',
  marketing: 'Marketing',
  manager: 'Manager',
  admin: 'Admin',
};

const availableRoles: UserRole[] = ['receptionist', 'guest-relations', 'marketing', 'manager', 'admin'];

function getUserByRole(role: UserRole): User {
  return users.find(u => u.role === role) || users[0];
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('receptionist');
  const [currentUser, setCurrentUser] = useState<User>(getUserByRole('receptionist'));

  const setRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(getUserByRole(role));
  }, []);

  return (
    <RoleContext.Provider value={{ currentRole, currentUser, setRole, availableRoles }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export { roleLabels };
