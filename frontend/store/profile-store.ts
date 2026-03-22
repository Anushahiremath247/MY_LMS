"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthUser, NotificationSettings, PrivacySettings, UserProfile } from "@/types";
import { buildInitialProfile } from "@/lib/profile-utils";

type ProfileState = {
  profile: UserProfile | null;
  hasHydrated: boolean;
  ensureProfile: (user: AuthUser) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePrivacy: (updates: Partial<PrivacySettings>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  addActivity: (entry: Omit<UserProfile["activity"][number], "id" | "timestamp">) => void;
  changePasswordTimestamp: () => void;
  resetSessions: () => void;
  deactivateAccount: () => void;
  clearProfile: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      hasHydrated: false,
      ensureProfile: (user) => {
        const current = get().profile;
        if (!current || current.userId !== user.id) {
          set({ profile: buildInitialProfile(user) });
          return;
        }

        set({
          profile: {
            ...current,
            fullName: current.fullName || user.name,
            email: current.email || user.email,
            avatar: current.avatar || user.avatar || buildInitialProfile(user).avatar,
            role: user.role ?? current.role
          }
        });
      },
      updateProfile: (updates) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  ...updates
                }
              }
            : state
        ),
      updatePrivacy: (updates) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  privacy: {
                    ...state.profile.privacy,
                    ...updates
                  }
                }
              }
            : state
        ),
      updateNotifications: (updates) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  notifications: {
                    ...state.profile.notifications,
                    ...updates
                  }
                }
              }
            : state
        ),
      addActivity: (entry) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  activity: [
                    {
                      ...entry,
                      id: crypto.randomUUID(),
                      timestamp: new Date().toISOString()
                    },
                    ...state.profile.activity
                  ].slice(0, 24)
                }
              }
            : state
        ),
      changePasswordTimestamp: () =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  passwordUpdatedAt: new Date().toISOString()
                }
              }
            : state
        ),
      resetSessions: () =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  sessions: [
                    {
                      id: "current-device",
                      label: "Current browser session",
                      location: "Primary device",
                      lastActiveAt: new Date().toISOString(),
                      current: true
                    }
                  ]
                }
              }
            : state
        ),
      deactivateAccount: () =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  accountStatus: "deactivated"
                }
              }
            : state
        ),
      clearProfile: () => set({ profile: null }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "lazy-learning-profile",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
