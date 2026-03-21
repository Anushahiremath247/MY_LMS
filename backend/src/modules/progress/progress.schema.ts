import { z } from "zod";

export const upsertProgressSchema = z.object({
  body: z.object({
    subjectId: z.string().min(1),
    videoId: z.string().min(1),
    lastPositionSeconds: z.number().min(0).default(0),
    isCompleted: z.boolean().default(false)
  })
});

