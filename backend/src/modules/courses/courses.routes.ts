import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  getCourse,
  getCourses,
  getPlans,
  postBuyCourse,
  postEnrollCourse,
  postSubscriptionCheckout
} from "./courses.controller.js";
import { buyCourseSchema, subscriptionCheckoutSchema } from "./courses.schema.js";

export const coursesRouter = Router();
export const subscriptionRouter = Router();

coursesRouter.get("/", getCourses);
coursesRouter.get("/plans", getPlans);
coursesRouter.get("/:id", getCourse);
coursesRouter.post("/:id/enroll", requireAuth, postEnrollCourse);
coursesRouter.post("/:id/buy", requireAuth, validate(buyCourseSchema), postBuyCourse);

subscriptionRouter.use(requireAuth);
subscriptionRouter.post("/checkout", validate(subscriptionCheckoutSchema), postSubscriptionCheckout);
