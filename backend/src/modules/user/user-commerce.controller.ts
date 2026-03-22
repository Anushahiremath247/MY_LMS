import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  getUserEnrollments,
  getUserPaymentHistory,
  getUserPurchases,
  getUserSubscription
} from "./user-commerce.service.js";

export const userEnrollments = asyncHandler(async (request: Request, response: Response) => {
  const data = await getUserEnrollments(request.user!.sub);
  response.status(StatusCodes.OK).json(data);
});

export const userPurchases = asyncHandler(async (request: Request, response: Response) => {
  const data = await getUserPurchases(request.user!.sub);
  response.status(StatusCodes.OK).json(data);
});

export const userSubscription = asyncHandler(async (request: Request, response: Response) => {
  const data = await getUserSubscription(request.user!.sub);
  response.status(StatusCodes.OK).json(data);
});

export const userPaymentHistory = asyncHandler(async (request: Request, response: Response) => {
  const data = await getUserPaymentHistory(request.user!.sub);
  response.status(StatusCodes.OK).json(data);
});
