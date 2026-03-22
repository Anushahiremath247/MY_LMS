"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AIChatPanelProps = {
  courseTitle?: string;
  lessonTitle?: string;
  lessonDescription?: string;
};

export const AIChatPanel = ({
  courseTitle,
  lessonTitle,
  lessonDescription
}: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `I am ready to help with ${lessonTitle ?? "this lesson"}. Ask me to explain a concept, summarize it, or quiz you.`
    }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const nextUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim()
    };

    const historyForRequest = [...messages, nextUserMessage];

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: nextUserMessage.content,
          courseTitle,
          lessonTitle,
          lessonDescription,
          messages: historyForRequest
        })
      });

      const payload = (await response.json()) as { answer?: string; message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "The tutor could not answer right now.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload.answer || "I understood the question, but I do not have a useful answer yet."
        }
      ]);
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "The tutor could not answer right now.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: message
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden w-[360px] xl:block">
      {isOpen ? (
        <div className="bubble-card animate-slide-in px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bubble-bar flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">AI Tutor</p>
                <p className="text-xs text-primary/70">Lesson-aware guidance</p>
              </div>
            </div>
            <button className="text-xs text-slate-500" onClick={() => setIsOpen(false)}>
              Hide
            </button>
          </div>
          <div ref={containerRef} className="mb-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "glass-panel text-slate-700"
                    : "bubble-bar ml-auto text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isTyping ? (
              <div className="glass-panel flex items-center gap-2 rounded-3xl px-4 py-3 text-sm text-slate-500">
                <Sparkles className="h-4 w-4 text-primary" />
                Typing...
              </div>
            ) : null}
          </div>
          {error ? <p className="mb-3 text-xs text-rose-500">{error}</p> : null}
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask about this lesson..."
              className="glass-panel h-12 flex-1 rounded-full px-4 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            <Button className="h-12 w-12 rounded-full px-0" onClick={() => void sendMessage()} disabled={isTyping}>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button className="ml-auto flex rounded-full" onClick={() => setIsOpen(true)}>
          Open AI Tutor
        </Button>
      )}
    </div>
  );
};
