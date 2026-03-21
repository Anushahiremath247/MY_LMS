import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

type SidebarLessonItemProps = {
  lesson: Lesson;
  active?: boolean;
};

export const SidebarLessonItem = ({ lesson, active }: SidebarLessonItemProps) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-3xl border px-4 py-3 transition duration-300",
      active
        ? "border-primary/30 bg-primary/10 shadow-soft"
        : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white"
    )}
  >
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl",
        lesson.locked ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary"
      )}
    >
      {lesson.locked ? (
        <Lock className="h-4 w-4" />
      ) : lesson.completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <PlayCircle className="h-4 w-4" />
      )}
    </span>
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
      <p className="truncate text-xs text-slate-500">{lesson.description}</p>
    </div>
  </div>
);

