"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clearAuthPresenceCookie, setAuthPresenceCookie } from "@/lib/auth-cookie";
import type { AuthUser } from "@/types";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  isCheckingSession: boolean;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
  setCheckingSession: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      isCheckingSession: true,
      setSession: ({ accessToken, user }) => {
        setAuthPresenceCookie();
        set({ accessToken, user });
      },
      clearSession: () => {
        clearAuthPresenceCookie();
        set({ accessToken: null, user: null });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setCheckingSession: (value) => set({ isCheckingSession: value })
    }),
    {
      name: "lazy-learning-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
