"use client";

import { useMemo, useState } from "react";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import type { Course, CourseListItem, SubscriptionPlan } from "@/types";
import { subscriptionPlans } from "@/lib/demo-data";
import { formatPrice } from "@/lib/course-access";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";

type CheckoutModalProps = {
  open: boolean;
  mode: "buy" | "subscribe";
  course?: Course | CourseListItem;
  onClose: () => void;
  onSubmit: (input: {
    method: "upi" | "card" | "bank_transfer";
    plan?: SubscriptionPlan;
    billingCycle?: "monthly" | "yearly";
  }) => Promise<void>;
};

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, hint: "Fastest for mobile checkout" },
  { id: "card", label: "Card", icon: CreditCard, hint: "Debit or credit card" },
  { id: "bank_transfer", label: "Bank", icon: Landmark, hint: "Account transfer reference" }
] as const;

export const CourseCheckoutModal = ({ open, mode, course, onClose, onSubmit }: CheckoutModalProps) => {
  const [method, setMethod] = useState<(typeof paymentMethods)[number]["id"]>("upi");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState(subscriptionPlans.find((plan) => plan.recommended)?.id ?? subscriptionPlans[0].id);
  const [accountValue, setAccountValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPlan = useMemo(
    () => subscriptionPlans.find((plan) => plan.id === selectedPlanId) ?? subscriptionPlans[0],
    [selectedPlanId]
  );

  const totalLabel =
    mode === "buy" && course ? formatPrice(course.price) : formatPrice(billingCycle === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await onSubmit({
        method,
        plan: selectedPlan,
        billingCycle
      });
      setAccountValue("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "buy" ? `Complete purchase${course ? ` for ${course.title}` : ""}` : "Unlock subscription access"}
      onClose={onClose}
    >
      <div className="space-y-6">
        {mode === "subscribe" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {subscriptionPlans.map((plan) => {
              const active = plan.id === selectedPlanId;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`pressable rounded-[1.5rem] border p-4 text-left transition ${
                    active
                      ? "border-primary bg-primary/5 shadow-[0_12px_30px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
                  <p className="mt-4 text-xl font-bold text-primary">
                    {formatPrice(billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly)}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}

        {mode === "subscribe" ? (
          <div className="flex gap-3">
            {(["monthly", "yearly"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`pressable rounded-full px-4 py-2 text-sm font-semibold transition ${
                  billingCycle === cycle ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {cycle === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          {paymentMethods.map((item) => {
            const active = item.id === method;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                className={`pressable rounded-[1.35rem] border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-primary" : "text-slate-400"}`} />
                <p className="mt-3 text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-medium text-slate-700">
            {method === "upi" ? "UPI ID" : method === "card" ? "Card / Holder name" : "Bank account / reference"}
          </label>
          <input
            value={accountValue}
            onChange={(event) => setAccountValue(event.target.value)}
            placeholder={method === "upi" ? "name@bank" : method === "card" ? "Aarav Sharma" : "Account or transfer note"}
            className="mt-3 h-12 w-full rounded-[1rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="rounded-[1.5rem] bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">{mode === "buy" ? "Course total" : "Membership total"}</p>
              <p className="mt-1 text-lg font-semibold">{totalLabel}</p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || accountValue.trim().length === 0}
              loading={isSubmitting}
              loadingLabel={mode === "buy" ? "Processing payment..." : "Activating plan..."}
            >
              {mode === "buy" ? "Pay & Unlock" : "Activate Subscription"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
