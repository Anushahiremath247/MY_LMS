import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/request.js";
import { getVideoById } from "./videos.service.js";

export const getVideo = asyncHandler(async (request: Request, response: Response) => {
  const video = await getVideoById(getParam(request.params.videoId), request.user?.sub);
  response.status(StatusCodes.OK).json(video);
});
