import { z } from "zod";

export const buyCourseSchema = z.object({
  method: z.enum(["upi", "card", "bank_transfer"]),
  simulateFailure: z.boolean().optional()
});

export const subscriptionCheckoutSchema = z.object({
  planId: z.string().min(1),
  billingCycle: z.enum(["monthly", "yearly"]),
  method: z.enum(["upi", "card", "bank_transfer"]),
  simulateFailure: z.boolean().optional()
});
