"use client";

import { useState } from "react";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "I can explain this lesson, recap key ideas, or turn it into quiz questions."
  }
];

export const AIChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const nextUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Here’s the quick version: focus on the main concept, then try to restate it in your own words before moving to the next lesson."
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden w-[360px] xl:block">
      {isOpen ? (
        <div className="glass-panel rounded-4xl p-4 animate-slide-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">AI Tutor</p>
                <p className="text-xs text-slate-500">Lesson-aware guidance</p>
              </div>
            </div>
            <button className="text-xs text-slate-500" onClick={() => setIsOpen(false)}>
              Hide
            </button>
          </div>
          <div className="mb-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                  message.role === "assistant"
                    ? "bg-white text-slate-700 shadow-soft"
                    : "ml-auto bg-primary text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isTyping ? (
              <div className="flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm text-slate-500 shadow-soft">
                <Sparkles className="h-4 w-4 text-primary" />
                Typing...
              </div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about this lesson..."
              className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            <Button className="h-12 w-12 rounded-full px-0" onClick={sendMessage}>
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

