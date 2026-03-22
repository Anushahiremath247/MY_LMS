import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  userEnrollments,
  userPaymentHistory,
  userPurchases,
  userSubscription
} from "./user-commerce.controller.js";

export const userCommerceRouter = Router();

userCommerceRouter.use(requireAuth);
userCommerceRouter.get("/enrollments", userEnrollments);
userCommerceRouter.get("/purchases", userPurchases);
userCommerceRouter.get("/subscription", userSubscription);
userCommerceRouter.get("/payment-history", userPaymentHistory);
