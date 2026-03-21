import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/request.js";
import { getSubjectProgress, getVideoProgress, upsertProgress } from "./progress.service.js";

export const createProgress = asyncHandler(async (request: Request, response: Response) => {
  const progress = await upsertProgress({
    ...request.body,
    userId: request.user!.sub
  });

  response.status(StatusCodes.CREATED).json(progress);
});

export const getProgress = asyncHandler(async (request: Request, response: Response) => {
  const progress = await getSubjectProgress(request.user!.sub, getParam(request.params.subjectId));
  response.status(StatusCodes.OK).json(progress);
});

export const getProgressByVideo = asyncHandler(async (request: Request, response: Response) => {
  const progress = await getVideoProgress(request.user!.sub, getParam(request.params.videoId));
  response.status(StatusCodes.OK).json(progress);
});
