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
  const subjects = await listSubjects(request.user?.sub);
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
