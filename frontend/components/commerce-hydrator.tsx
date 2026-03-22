"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { useProfileStore } from "@/store/profile-store";

export const CommerceHydrator = () => {
  const user = useAuthStore((state) => state.user);
  const ensureAccount = useCommerceStore((state) => state.ensureAccount);
  const accounts = useCommerceStore((state) => state.accounts);
  const ensureProfile = useProfileStore((state) => state.ensureProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  useEffect(() => {
    if (!user) {
      return;
    }

    ensureAccount(user);
    ensureProfile(user);
  }, [ensureAccount, ensureProfile, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const account = accounts[user.id];
    if (!account) {
      return;
    }

    updateProfile({
      purchasedCourses: account.purchasedCourses,
      paymentHistory: account.paymentHistory,
      activeSubscription: account.activeSubscription,
      watchHistory: account.watchHistory
    });
  }, [accounts, updateProfile, user]);

  return null;
};
