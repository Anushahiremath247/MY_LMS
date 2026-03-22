import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  changePassword,
  deactivateAccount,
  deleteAccount,
  getActivity,
  getCourses,
  getNotifications,
  getPrivacy,
  getProfile,
  updateNotifications,
  updatePrivacy,
  updateProfile
} from "./profile.controller.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updateNotificationSchema,
  updatePrivacySchema,
  updateProfileSchema
} from "./profile.schema.js";

export const profileRouter = Router();
export const accountRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get("/", getProfile);
profileRouter.put("/", validate(updateProfileSchema), updateProfile);
profileRouter.put("/change-password", validate(changePasswordSchema), changePassword);
profileRouter.get("/activity", getActivity);
profileRouter.get("/courses", getCourses);
profileRouter.get("/privacy", getPrivacy);
profileRouter.put("/privacy", validate(updatePrivacySchema), updatePrivacy);
profileRouter.get("/notifications", getNotifications);
profileRouter.put("/notifications", validate(updateNotificationSchema), updateNotifications);

accountRouter.use(requireAuth);
accountRouter.delete("/", validate(deleteAccountSchema), deleteAccount);
accountRouter.put("/deactivate", deactivateAccount);
