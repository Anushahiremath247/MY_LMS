import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { listResources } from "./resources.service.js";

export const getResources = asyncHandler(async (request: Request, response: Response) => {
  const resources = await listResources({
    category: typeof request.query.category === "string" ? request.query.category : undefined,
    search: typeof request.query.search === "string" ? request.query.search : undefined
  });

  response.setHeader("Cache-Control", "public, max-age=120, s-maxage=120, stale-while-revalidate=600");
  response.status(StatusCodes.OK).json(resources);
});
