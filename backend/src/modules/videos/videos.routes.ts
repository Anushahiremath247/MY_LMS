import { Router } from "express";
import { getVideo } from "./videos.controller.js";

export const videosRouter = Router();

videosRouter.get("/:videoId", getVideo);

