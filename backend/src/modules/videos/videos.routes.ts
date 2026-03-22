import { Router } from "express";
import { getVideo, getVideoAccessController } from "./videos.controller.js";

export const videosRouter = Router();

videosRouter.get("/:videoId/access", getVideoAccessController);
videosRouter.get("/:videoId", getVideo);
