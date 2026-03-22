import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/request.js";
import {
  buyCourse,
  checkoutSubscription,
  enrollInCourse,
  getCourseByIdentifier,
  getCoursesCatalog,
  getSubscriptionPlans
} from "./courses.service.js";

export const getCourses = asyncHandler(async (request: Request, response: Response) => {
  const courses = await getCoursesCatalog({
    userId: request.user?.sub,
    page: Number(request.query.page ?? 1),
    limit: Number(request.query.limit ?? 12),
    category: typeof request.query.category === "string" ? request.query.category : undefined,
    search: typeof request.query.search === "string" ? request.query.search : undefined,
    accessType: typeof request.query.accessType === "string" ? (request.query.accessType as "free" | "paid" | "subscription") : undefined
  });

  response.status(StatusCodes.OK).json(courses);
});

export const getCourse = asyncHandler(async (request: Request, response: Response) => {
  const course = await getCourseByIdentifier(getParam(request.params.id), request.user?.sub);
  response.status(StatusCodes.OK).json(course);
});

export const postEnrollCourse = asyncHandler(async (request: Request, response: Response) => {
  const result = await enrollInCourse(request.user!.sub, getParam(request.params.id));
  response.status(StatusCodes.CREATED).json(result);
});

export const postBuyCourse = asyncHandler(async (request: Request, response: Response) => {
  const result = await buyCourse(request.user!.sub, getParam(request.params.id), request.body);
  response.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
});

export const getPlans = asyncHandler(async (_request: Request, response: Response) => {
  const plans = await getSubscriptionPlans();
  response.status(StatusCodes.OK).json(plans);
});

export const postSubscriptionCheckout = asyncHandler(async (request: Request, response: Response) => {
  const result = await checkoutSubscription(request.user!.sub, request.body);
  response.status(result.success ? StatusCodes.CREATED : StatusCodes.BAD_REQUEST).json(result);
});
