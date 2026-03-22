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
  const [hydrated, setHydrated] = useState(false);

  // Wait for zustand persist to rehydrate from localStorage
  useEffect(() => {
    // Check if already rehydrated (store has user from localStorage)
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If the store already hydrated before this effect ran
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  // Once hydrated, check auth
  useEffect(() => {
    if (!hydrated) return;

    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [hydrated, user, requiredRole, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
