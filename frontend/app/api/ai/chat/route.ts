import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const sanitizeMessages = (messages: unknown): ChatMessage[] => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message): message is { role: unknown; content: string } =>
        Boolean(message) &&
        typeof message === "object" &&
        "role" in message &&
        "content" in message &&
        typeof (message as { content?: unknown }).content === "string"
    )
    .map(
      (message): ChatMessage => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content.trim()
      })
    )
    .filter((message) => message.content.length > 0)
    .slice(-10);
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      courseTitle?: string;
      lessonTitle?: string;
      lessonDescription?: string;
      messages?: unknown;
    };

    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ message: "Please enter a question for the tutor." }, { status: 400 });
    }

    if (!openai) {
      return NextResponse.json(
        {
          message:
            "AI tutor is not configured yet. Add OPENAI_API_KEY to the frontend deployment environment."
        },
        { status: 503 }
      );
    }

    const messages = sanitizeMessages(body.messages);
    const transcript = messages
      .map((message) => `${message.role === "assistant" ? "Tutor" : "Student"}: ${message.content}`)
      .join("\n");

    const instructions = `
You are Lazy Learning AI Tutor, a premium in-product study assistant.
Behave like a polished ChatGPT-style tutor: accurate, warm, clear, and practical.
Help the student understand the lesson instead of only giving the final answer.
Use the lesson context when relevant.
When useful, break explanations into short steps or bullets.
If the student asks for code, give concise examples and explain them.
If the student seems confused, simplify first and then expand.
Avoid filler, avoid hallucinating unavailable lesson facts, and say when you are inferring.

Course: ${body.courseTitle ?? "Unknown course"}
Lesson: ${body.lessonTitle ?? "Unknown lesson"}
Lesson description: ${body.lessonDescription ?? "No lesson description provided"}
    `.trim();

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      reasoning: { effort: "low" },
      instructions,
      input: `${transcript ? `${transcript}\n` : ""}Student: ${question}`
    });

    return NextResponse.json({
      answer: response.output_text?.trim() || "I understood the question, but I could not generate a response."
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "The AI tutor could not process that request."
      },
      { status: 500 }
    );
  }
}
