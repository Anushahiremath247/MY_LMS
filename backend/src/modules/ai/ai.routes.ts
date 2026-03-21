import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { chat, quiz, summarize } from "./ai.controller.js";
import { aiChatSchema, aiQuizSchema, aiSummarySchema } from "./ai.schema.js";

export const aiRouter = Router();

aiRouter.post("/chat", validate(aiChatSchema), chat);
aiRouter.post("/summarize", validate(aiSummarySchema), summarize);
aiRouter.post("/quiz", validate(aiQuizSchema), quiz);

