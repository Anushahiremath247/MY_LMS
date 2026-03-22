"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  ActiveSubscription,
  AuthUser,
  PaymentHistoryItem,
  PurchasedCourse,
  SubscriptionPlan,
  WatchHistoryItem
} from "@/types";

type CommerceAccount = {
  enrolledCourseIds: string[];
  purchasedCourses: PurchasedCourse[];
  activeSubscription: ActiveSubscription | null;
  paymentHistory: PaymentHistoryItem[];
  watchHistory: WatchHistoryItem[];
};

type CommerceState = {
  accounts: Record<string, CommerceAccount>;
  hasHydrated: boolean;
  ensureAccount: (user: AuthUser) => void;
  enrollCourse: (userId: string, courseId: string) => void;
  purchaseCourse: (input: {
    userId: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    method: PaymentHistoryItem["method"];
  }) => { payment: PaymentHistoryItem; purchase: PurchasedCourse };
  activateSubscription: (input: {
    userId: string;
    plan: SubscriptionPlan;
    billingCycle: "monthly" | "yearly";
    method: PaymentHistoryItem["method"];
  }) => { payment: PaymentHistoryItem; subscription: ActiveSubscription };
  addWatchHistory: (userId: string, entry: Omit<WatchHistoryItem, "id" | "watchedAt">) => void;
  setHasHydrated: (value: boolean) => void;
};

const buildReference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

const createEmptyAccount = (): CommerceAccount => ({
  enrolledCourseIds: [],
  purchasedCourses: [],
  activeSubscription: null,
  paymentHistory: [],
  watchHistory: []
});

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      accounts: {},
      hasHydrated: false,
      ensureAccount: (user) =>
        set((state) =>
          state.accounts[user.id]
            ? state
            : {
                accounts: {
                  ...state.accounts,
                  [user.id]: createEmptyAccount()
                }
              }
        ),
      enrollCourse: (userId, courseId) =>
        set((state) => {
          const current = state.accounts[userId] ?? createEmptyAccount();
          if (current.enrolledCourseIds.includes(courseId)) {
            return state;
          }

          return {
            accounts: {
              ...state.accounts,
              [userId]: {
                ...current,
                enrolledCourseIds: [courseId, ...current.enrolledCourseIds]
              }
            }
          };
        }),
      purchaseCourse: ({ userId, courseId, courseTitle, amount, method }) => {
        const now = new Date().toISOString();
        const paymentId = crypto.randomUUID();
        const orderId = crypto.randomUUID();
        const payment: PaymentHistoryItem = {
          id: paymentId,
          type: "course_purchase",
          courseId,
          courseTitle,
          amount,
          currency: "INR",
          status: "succeeded",
          method,
          reference: buildReference("PAY"),
          createdAt: now
        };
        const purchase: PurchasedCourse = {
          courseId,
          purchasedAt: now,
          orderId,
          paymentId
        };

        set((state) => {
          const current = state.accounts[userId] ?? createEmptyAccount();
          const alreadyOwned = current.purchasedCourses.some((entry) => entry.courseId === courseId);

          return {
            accounts: {
              ...state.accounts,
              [userId]: {
                ...current,
                enrolledCourseIds: current.enrolledCourseIds.includes(courseId)
                  ? current.enrolledCourseIds
                  : [courseId, ...current.enrolledCourseIds],
                purchasedCourses: alreadyOwned ? current.purchasedCourses : [purchase, ...current.purchasedCourses],
                paymentHistory: [payment, ...current.paymentHistory]
              }
            }
          };
        });

        return { payment, purchase };
      },
      activateSubscription: ({ userId, plan, billingCycle, method }) => {
        const now = Date.now();
        const payment: PaymentHistoryItem = {
          id: crypto.randomUUID(),
          type: "subscription",
          subscriptionPlanId: plan.id,
          subscriptionPlanName: plan.name,
          amount: billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly,
          currency: "INR",
          status: "succeeded",
          method,
          reference: buildReference("SUB"),
          createdAt: new Date(now).toISOString()
        };
        const subscription: ActiveSubscription = {
          planId: plan.id,
          planName: plan.name,
          startedAt: new Date(now).toISOString(),
          expiresAt: new Date(now + (billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          billingCycle,
          status: "active"
        };

        set((state) => {
          const current = state.accounts[userId] ?? createEmptyAccount();

          return {
            accounts: {
              ...state.accounts,
              [userId]: {
                ...current,
                activeSubscription: subscription,
                paymentHistory: [payment, ...current.paymentHistory]
              }
            }
          };
        });

        return { payment, subscription };
      },
      addWatchHistory: (userId, entry) =>
        set((state) => {
          const current = state.accounts[userId] ?? createEmptyAccount();
          const item: WatchHistoryItem = {
            ...entry,
            id: crypto.randomUUID(),
            watchedAt: new Date().toISOString()
          };

          return {
            accounts: {
              ...state.accounts,
              [userId]: {
                ...current,
                watchHistory: [item, ...current.watchHistory].slice(0, 20)
              }
            }
          };
        }),
      setHasHydrated: (value) => set({ hasHydrated: value })
    }),
    {
      name: "lazy-learning-commerce",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accounts: state.accounts
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
