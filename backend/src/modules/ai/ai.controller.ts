import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { askTutor, generateQuiz, summarizeLesson } from "./ai.service.js";

export const chat = asyncHandler(async (request: Request, response: Response) => {
  const answer = await askTutor(request.body);
  response.status(StatusCodes.OK).json({ answer });
});

export const summarize = asyncHandler(async (request: Request, response: Response) => {
  const summary = await summarizeLesson(request.body.content);
  response.status(StatusCodes.OK).json({ summary });
});

export const quiz = asyncHandler(async (request: Request, response: Response) => {
  const result = await generateQuiz(request.body);
  response.status(StatusCodes.OK).json({ result });
});

