import { z } from "zod";

export const aiChatSchema = z.object({
  body: z.object({
    question: z.string().min(4),
    lessonTitle: z.string().optional(),
    context: z.string().optional()
  })
});

export const aiSummarySchema = z.object({
  body: z.object({
    content: z.string().min(20)
  })
});

export const aiQuizSchema = z.object({
  body: z.object({
    content: z.string().min(20),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner")
  })
});

