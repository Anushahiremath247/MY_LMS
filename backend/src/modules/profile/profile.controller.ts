import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  changeProfilePassword,
  deactivateUserAccount,
  deleteUserAccount,
  getNotificationSettings,
  getPrivacySettings,
  getProfileOverview,
  getUserActivity,
  getUserCourseSummary,
  updateNotificationSettings,
  updatePrivacySettings,
  updateProfileDetails
} from "./profile.service.js";

export const getProfile = asyncHandler(async (request: Request, response: Response) => {
  const profile = await getProfileOverview(request.user!.sub);
  response.status(StatusCodes.OK).json(profile);
});

export const updateProfile = asyncHandler(async (request: Request, response: Response) => {
  const profile = await updateProfileDetails(request.user!.sub, request.body);
  response.status(StatusCodes.OK).json(profile);
});

export const changePassword = asyncHandler(async (request: Request, response: Response) => {
  await changeProfilePassword(request.user!.sub, request.body);
  response.status(StatusCodes.OK).json({ message: "Password updated successfully" });
});

export const getActivity = asyncHandler(async (request: Request, response: Response) => {
  const activity = await getUserActivity(request.user!.sub);
  response.status(StatusCodes.OK).json(activity);
});

export const getCourses = asyncHandler(async (request: Request, response: Response) => {
  const courses = await getUserCourseSummary(request.user!.sub);
  response.status(StatusCodes.OK).json(courses);
});

export const getPrivacy = asyncHandler(async (request: Request, response: Response) => {
  const privacy = await getPrivacySettings(request.user!.sub);
  response.status(StatusCodes.OK).json(privacy);
});

export const updatePrivacy = asyncHandler(async (request: Request, response: Response) => {
  const privacy = await updatePrivacySettings(request.user!.sub, request.body);
  response.status(StatusCodes.OK).json(privacy);
});

export const getNotifications = asyncHandler(async (request: Request, response: Response) => {
  const notifications = await getNotificationSettings(request.user!.sub);
  response.status(StatusCodes.OK).json(notifications);
});

export const updateNotifications = asyncHandler(async (request: Request, response: Response) => {
  const notifications = await updateNotificationSettings(request.user!.sub, request.body);
  response.status(StatusCodes.OK).json(notifications);
});

export const deactivateAccount = asyncHandler(async (request: Request, response: Response) => {
  await deactivateUserAccount(request.user!.sub);
  response.status(StatusCodes.OK).json({ message: "Account deactivated successfully" });
});

export const deleteAccount = asyncHandler(async (request: Request, response: Response) => {
  await deleteUserAccount(request.user!.sub);
  response.status(StatusCodes.OK).json({ message: "Account deleted successfully" });
});
