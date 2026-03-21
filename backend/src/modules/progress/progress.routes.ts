import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { createProgress, getProgress, getProgressByVideo } from "./progress.controller.js";
import { upsertProgressSchema } from "./progress.schema.js";

export const progressRouter = Router();

progressRouter.post("/", requireAuth, validate(upsertProgressSchema), createProgress);
progressRouter.get("/videos/:videoId", requireAuth, getProgressByVideo);
progressRouter.get("/:subjectId", requireAuth, getProgress);
