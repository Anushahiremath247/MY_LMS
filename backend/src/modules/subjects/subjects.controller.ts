import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/request.js";
import {
  enrollInSubject,
  getFirstVideo,
  getSubjectByIdentifier,
  getSubjectTree,
  listSubjects
} from "./subjects.service.js";

export const getSubjects = asyncHandler(async (request: Request, response: Response) => {
  const page = Number(request.query.page ?? 1);
  const limit = Number(request.query.limit ?? 12);
  const category = typeof request.query.category === "string" ? request.query.category : undefined;
  const search = typeof request.query.search === "string" ? request.query.search : undefined;
  const enrolledOnly = request.query.enrolledOnly === "true";
  const subjects = await listSubjects({
    userId: request.user?.sub,
    page,
    limit,
    category,
    search,
    enrolledOnly
  });

  if (!request.user?.sub) {
    response.setHeader("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
  }

  response.status(StatusCodes.OK).json(subjects);
});

export const getSubject = asyncHandler(async (request: Request, response: Response) => {
  const subject = await getSubjectByIdentifier(getParam(request.params.id), request.user?.sub);
  response.status(StatusCodes.OK).json(subject);
});

export const getTree = asyncHandler(async (request: Request, response: Response) => {
  const tree = await getSubjectTree(getParam(request.params.id), request.user?.sub);
  response.status(StatusCodes.OK).json(tree);
});

export const enroll = asyncHandler(async (request: Request, response: Response) => {
  const result = await enrollInSubject(request.user!.sub, request.body.subjectId);
  response.status(StatusCodes.CREATED).json(result);
});

export const firstVideo = asyncHandler(async (request: Request, response: Response) => {
  const video = await getFirstVideo(getParam(request.params.id));
  response.status(StatusCodes.OK).json(video);
});
