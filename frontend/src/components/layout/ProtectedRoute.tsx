'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'freelancer' | 'recruiter';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }
    setChecking(false);
  }, [user, requiredRole, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
