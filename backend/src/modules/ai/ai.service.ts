import OpenAI from "openai";
import { env } from "../../config/env.js";

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

const requireOpenAI = () => {
  if (!openai) {
    throw new Error("OPENAI_API_KEY is missing. Configure it before using the AI tutor.");
  }

  return openai;
};

const createResponse = async ({
  instructions,
  input
}: {
  instructions: string;
  input: string;
}) => {
  const client = requireOpenAI();
  const response = await client.responses.create({
    model: env.OPENAI_MODEL,
    reasoning: { effort: "low" },
    instructions,
    input
  });

  return response.output_text?.trim() || "The AI tutor did not return any text.";
};

export const askTutor = async (input: {
  question: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  context?: string;
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
}) => {
  const transcript = (input.messages ?? [])
    .slice(-10)
    .map((message) => `${message.role === "assistant" ? "Tutor" : "Student"}: ${message.content}`)
    .join("\n");

  return createResponse({
    instructions: `
You are Lazy Learning AI Tutor, a premium in-product study assistant.
Behave like a polished ChatGPT-style tutor: accurate, warm, clear, and practical.
Help the student understand the lesson instead of only giving the final answer.
Use the lesson context when relevant.
When useful, break explanations into short steps or bullets.
If the student asks for code, give concise examples and explain them.
If the student seems confused, simplify first and then expand.
Avoid filler, avoid hallucinating unavailable lesson facts, and say when you are inferring.

Course: ${input.courseTitle ?? "Unknown course"}
Lesson: ${input.lessonTitle ?? "Unknown lesson"}
Lesson description: ${input.lessonDescription ?? input.context ?? "No lesson description provided"}
    `.trim(),
    input: `${transcript ? `${transcript}\n` : ""}Student: ${input.question}`
  });
};

export const summarizeLesson = async (content: string) =>
  createResponse({
    instructions:
      "You are a study assistant. Summarize the lesson clearly with the main ideas, a short explanation, and practical takeaways.",
    input: content
  });

export const generateQuiz = async (input: { content: string; difficulty: string }) =>
  createResponse({
    instructions: `Create 5 quiz questions with answers at ${input.difficulty} level from this lesson. Make them clear and useful for learning.`,
    input: input.content
  });
