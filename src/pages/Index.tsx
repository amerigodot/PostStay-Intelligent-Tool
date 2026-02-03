import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import type { UserRole } from '@/types';

const roleDefaultRoutes: Record<UserRole, string> = {
  receptionist: '/receptionist',
  'guest-relations': '/guest-relations',
  marketing: '/marketing',
  manager: '/manager',
  admin: '/admin',
};

const Index = () => {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  useEffect(() => {
    // Redirect to the appropriate dashboard based on current role
    navigate(roleDefaultRoutes[currentRole], { replace: true });
  }, [currentRole, navigate]);

  return null;
};

export default Index;
