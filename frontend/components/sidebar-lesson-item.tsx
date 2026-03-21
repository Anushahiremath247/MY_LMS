import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/types";

type SidebarLessonItemProps = {
  lesson: Lesson;
  active?: boolean;
  compact?: boolean;
  onSelect?: () => void;
};

export const SidebarLessonItem = ({ lesson, active, compact, onSelect }: SidebarLessonItemProps) => (
  <button
    type="button"
    onClick={onSelect}
    disabled={lesson.locked}
    className={cn(
      "flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition duration-300",
      active
        ? "border-primary/30 bg-primary/10 shadow-soft"
        : "border-transparent bg-white/70 hover:border-slate-200 hover:bg-white",
      lesson.locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"
    )}
  >
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
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
    {!compact ? (
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
        <p className="truncate text-xs text-slate-500">{lesson.description}</p>
      </div>
    ) : null}
  </button>
);
