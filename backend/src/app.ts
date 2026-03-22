import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { aiRouter } from "./modules/ai/ai.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { accountRouter, profileRouter } from "./modules/profile/profile.routes.js";
import { progressRouter } from "./modules/progress/progress.routes.js";
import { resourcesRouter } from "./modules/resources/resources.routes.js";
import { enrollmentRouter, subjectsRouter } from "./modules/subjects/subjects.routes.js";
import { videosRouter } from "./modules/videos/videos.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/account", accountRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/enroll", enrollmentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/ai", aiRouter);
app.use("/api/videos", videosRouter);

app.use(errorMiddleware);
