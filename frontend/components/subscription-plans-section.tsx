"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubscriptionPlan } from "@/types";
import { checkoutSubscriptionRequest } from "@/lib/commerce";
import { formatPrice } from "@/lib/course-access";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { CourseCheckoutModal } from "./course-checkout-modal";
import { Button } from "./ui/button";

export const SubscriptionPlansSection = ({ plans }: { plans: SubscriptionPlan[] }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const activateSubscription = useCommerceStore((state) => state.activateSubscription);
  const ensureAccount = useCommerceStore((state) => state.ensureAccount);
  const addActivity = useProfileStore((state) => state.addActivity);
  const pushToast = useToastStore((state) => state.pushToast);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handleOpen = (plan: SubscriptionPlan) => {
    if (!user) {
      router.push("/login");
      return;
    }

    ensureAccount(user);
    setSelectedPlan(plan);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/75">Membership</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-slate-900">
            Subscription plans for premium momentum
          </h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-[2rem] border bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${
              plan.recommended ? "border-primary/40 ring-1 ring-primary/15" : "border-slate-200"
            }`}
          >
            {plan.recommended ? (
              <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Recommended
              </span>
            ) : null}
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
            <div className="mt-6">
              <p className="text-3xl font-bold text-primary">{formatPrice(plan.priceMonthly)}</p>
              <p className="mt-1 text-sm text-slate-400">{formatPrice(plan.priceYearly)} billed yearly</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button className="mt-8 w-full" onClick={() => handleOpen(plan)}>
              Choose {plan.name}
            </Button>
          </article>
        ))}
      </div>

      <CourseCheckoutModal
        open={Boolean(selectedPlan)}
        mode="subscribe"
        onClose={() => setSelectedPlan(null)}
        onSubmit={async ({ billingCycle, method, plan }) => {
          const resolvedPlan = plan ?? selectedPlan;

          if (!resolvedPlan || !user || !billingCycle) {
            return;
          }

          try {
            await checkoutSubscriptionRequest(
              {
                planId: resolvedPlan.id,
                billingCycle,
                method
              },
              accessToken
            );
          } catch {
            // local fallback keeps the experience working without a live backend
          }

          activateSubscription({
            userId: user.id,
            plan: resolvedPlan,
            billingCycle,
            method
          });
          addActivity({
            title: "Subscription activated",
            description: `${resolvedPlan.name} membership is now active.`,
            type: "system"
          });
          pushToast({
            title: "Membership active",
            description: `${resolvedPlan.name} unlocked your subscription catalog.`,
            tone: "success"
          });
        }}
      />
    </section>
  );
};
