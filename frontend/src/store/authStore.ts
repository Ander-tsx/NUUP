import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  updateBalance: (balance: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: (user: User) => set({ user }),
      updateBalance: (_balance: number) => set((state) => ({ ...state })),
      logout: () => set({ user: null }),
    }),
    {
      name: 'pw_auth',
    }
  )
);
