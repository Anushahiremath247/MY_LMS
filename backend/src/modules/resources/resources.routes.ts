import { Router } from "express";
import { getResources } from "./resources.controller.js";

export const resourcesRouter = Router();

resourcesRouter.get("/", getResources);

