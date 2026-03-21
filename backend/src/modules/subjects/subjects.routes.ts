import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { firstVideo, getSubject, getSubjects, getTree } from "./subjects.controller.js";

export const subjectsRouter = Router();

subjectsRouter.get("/", getSubjects);
subjectsRouter.get("/:id", getSubject);
subjectsRouter.get("/:id/tree", getTree);
subjectsRouter.get("/:id/first-video", firstVideo);

export const enrollmentRouter = Router();

enrollmentRouter.post("/", requireAuth, (request, response, next) => {
  return import("./subjects.controller.js")
    .then(({ enroll }) => enroll(request, response, next))
    .catch(next);
});

