import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type TutorRequestBody = {
  question?: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  messages?: unknown;
};

type FallbackTopic = {
  terms: string[];
  summary: string;
  example?: string;
};

const fallbackTopics: FallbackTopic[] = [
  {
    terms: ["python"],
    summary:
      "Python is a high-level, general-purpose programming language known for readable syntax and fast development. It is widely used for web apps, automation, data science, and AI.",
    example: `name = "Lazy Learning"\nprint(f"Hello, {name}")`
  },
  {
    terms: ["javascript", "js"],
    summary:
      "JavaScript is the programming language of the web. It adds interactivity to websites and also powers full-stack apps through platforms like Node.js.",
    example: 'const learner = "Anusha";\nconsole.log(`Welcome, ${learner}`);'
  },
  {
    terms: ["react"],
    summary:
      "React is a UI library for building component-based interfaces. It helps you create reusable pieces of UI and update the screen efficiently when data changes.",
    example: `export function Welcome() {\n  return <h1>Hello, learner!</h1>;\n}`
  },
  {
    terms: ["next.js", "nextjs", "next"],
    summary:
      "Next.js is a React framework that adds routing, server rendering, API routes, and production-ready performance features for full-stack web apps.",
    example: `export default function Page() {\n  return <main>Lazy Learning</main>;\n}`
  },
  {
    terms: ["node", "node.js", "nodejs"],
    summary:
      "Node.js lets JavaScript run outside the browser. It is commonly used to build APIs, backend services, scripts, and real-time applications.",
    example: `import express from "express";\nconst app = express();\napp.get("/", (_req, res) => res.send("API ready"));`
  },
  {
    terms: ["sql", "postgres", "postgresql", "database"],
    summary:
      "SQL is used to store, query, and update structured data in relational databases such as PostgreSQL. It helps you work with tables, rows, filters, and relationships.",
    example: `SELECT title, instructor\nFROM subjects\nWHERE is_published = true;`
  },
  {
    terms: ["api", "rest api"],
    summary:
      "An API is a structured way for one system to talk to another. In web apps, a REST API usually exposes endpoints that send and receive JSON over HTTP.",
    example: `fetch("/api/subjects")\n  .then((response) => response.json())\n  .then((data) => console.log(data));`
  },
  {
    terms: ["tailwind", "tailwind css"],
    summary:
      "Tailwind CSS is a utility-first styling framework. Instead of writing custom CSS for every component, you compose classes directly in your markup.",
    example: `<button className="rounded-full bg-blue-600 px-4 py-2 text-white">Enroll</button>`
  },
  {
    terms: ["ai", "machine learning", "ml"],
    summary:
      "Artificial intelligence focuses on systems that can perform tasks requiring pattern recognition or decision-making. Machine learning is a branch of AI where models learn from data.",
    example:
      "A simple example is a recommendation system that suggests courses based on what a learner has already completed."
  }
];

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const huggingFaceToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || "";
const huggingFace = huggingFaceToken
  ? new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: huggingFaceToken
    })
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

const splitIntoBullets = (text: string) =>
  text
    .split(/[.!?]\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => `- ${part.replace(/[.!?]+$/, "")}.`);

const getFallbackTopic = (text: string) =>
  fallbackTopics.find((topic) => topic.terms.some((term) => text.includes(term)));

const buildSummary = (body: TutorRequestBody) => {
  const title = body.lessonTitle ?? "this lesson";
  const bullets = body.lessonDescription
    ? splitIntoBullets(body.lessonDescription)
    : [
        `- ${title} introduces the main concept and where it fits in the course.`,
        "- Focus on the key terms, the workflow, and one small hands-on example.",
        "- After that, try explaining the idea in your own words to lock it in."
      ];

  return [`Quick summary of ${title}:`, ...bullets].join("\n");
};

const buildQuiz = (body: TutorRequestBody, topic?: FallbackTopic) => {
  const title = body.lessonTitle ?? "this lesson";
  const topicLabel = topic?.terms[0] ?? title;

  return [
    `Quick quiz on ${topicLabel}:`,
    "1. What problem does it solve?",
    "2. What is one real-world use case?",
    "3. Can you explain the main idea in one or two lines?",
    `If you want, I can also grade your answers for ${title}.`
  ].join("\n");
};

const buildContextAnswer = (body: TutorRequestBody) => {
  const title = body.lessonTitle ?? "this lesson";
  const course = body.courseTitle ?? "your course";
  const bullets = body.lessonDescription
    ? splitIntoBullets(body.lessonDescription)
    : [
        `- Start with the main goal of ${title}.`,
        "- Identify the most important term or concept.",
        "- Walk through one simple example before moving on."
      ];

  return [
    `Here is a clear way to think about ${title} in ${course}:`,
    ...bullets,
    "If you want, ask me for a simpler explanation, an example, or a short quiz."
  ].join("\n");
};

const buildFallbackAnswer = (body: TutorRequestBody, transcript: string) => {
  const question = body.question?.trim() ?? "";
  const lowered = `${question}\n${body.lessonTitle ?? ""}\n${body.lessonDescription ?? ""}\n${transcript}`.toLowerCase();
  const topic = getFallbackTopic(lowered);

  if (/(quiz|test me|practice questions?)/i.test(question)) {
    return buildQuiz(body, topic);
  }

  if (/(summari[sz]e|summary|recap|key points?)/i.test(question)) {
    return buildSummary(body);
  }

  if (topic) {
    const sections = [topic.summary];

    if (/(define|what is|explain)/i.test(question)) {
      sections.push("In simple terms: it helps you build useful software faster and more clearly.");
    }

    if (/(example|code|sample|show me)/i.test(question) && topic.example) {
      sections.push(`Example:\n${topic.example}`);
    } else if (topic.example && /python|javascript|react|next|node|sql|api|tailwind/i.test(question)) {
      sections.push(`Quick example:\n${topic.example}`);
    }

    sections.push("If you want, I can also break it into steps, compare it with another concept, or quiz you on it.");
    return sections.join("\n\n");
  }

  return buildContextAnswer(body);
};

export async function POST(request: Request) {
  let body: TutorRequestBody = {};

  try {
    body = (await request.json()) as TutorRequestBody;

    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ message: "Please enter a question for the tutor." }, { status: 400 });
    }

    const messages = sanitizeMessages(body.messages);
    const transcript = messages
      .map((message) => `${message.role === "assistant" ? "Tutor" : "Student"}: ${message.content}`)
      .join("\n");
    const fallbackAnswer = buildFallbackAnswer(body, transcript);

    if (!huggingFace && !openai) {
      return NextResponse.json({ answer: fallbackAnswer });
    }

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

    if (huggingFace) {
      const completion = await huggingFace.chat.completions.create({
        model: process.env.HUGGINGFACE_MODEL ?? "katanemo/Arch-Router-1.5B:hf-inference",
        messages: [
          {
            role: "system",
            content: instructions
          },
          ...messages,
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.4
      });

      return NextResponse.json({
        answer:
          completion.choices[0]?.message?.content?.trim() ||
          fallbackAnswer
      });
    }

    const response = await openai!.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      reasoning: { effort: "low" },
      instructions,
      input: `${transcript ? `${transcript}\n` : ""}Student: ${question}`
    });

    return NextResponse.json({
      answer: response.output_text?.trim() || fallbackAnswer
    });
  } catch (error) {
    console.error("AI tutor fallback engaged:", error);

    const fallbackAnswer = buildFallbackAnswer(body, "");

    return NextResponse.json({ answer: fallbackAnswer });
  }
}
