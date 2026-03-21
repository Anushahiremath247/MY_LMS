import axios from "axios";
import { env } from "../../config/env.js";

const hfHeaders = env.HUGGINGFACE_API_KEY
  ? {
      Authorization: `Bearer ${env.HUGGINGFACE_API_KEY}`
    }
  : {};

const fallbackResponse = (prompt: string) =>
  `AI fallback response: ${prompt.slice(0, 180)}${prompt.length > 180 ? "..." : ""}`;

export const callHuggingFace = async (model: string, inputs: string) => {
  if (!env.HUGGINGFACE_API_KEY) {
    return fallbackResponse(inputs);
  }

  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${model}`,
    { inputs },
    { headers: hfHeaders }
  );

  const data = response.data;

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }

  if (typeof data?.generated_text === "string") {
    return data.generated_text;
  }

  return fallbackResponse(inputs);
};

export const askTutor = async (input: { question: string; lessonTitle?: string; context?: string }) =>
  callHuggingFace(
    "google/flan-t5-large",
    `You are an LMS tutor. Lesson: ${input.lessonTitle ?? "General lesson"}.\nContext: ${
      input.context ?? "No extra context"
    }\nQuestion: ${input.question}\nAnswer clearly for a student.`
  );

export const summarizeLesson = async (content: string) =>
  callHuggingFace("facebook/bart-large-cnn", `Summarize this lesson clearly:\n${content}`);

export const generateQuiz = async (input: { content: string; difficulty: string }) =>
  callHuggingFace(
    "google/flan-t5-large",
    `Create 5 quiz questions with answers at ${input.difficulty} level from this lesson:\n${input.content}`
  );

