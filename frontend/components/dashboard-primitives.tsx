"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Clock3, Sparkles } from "lucide-react";
import type { CourseListItem } from "@/types";
import { cn } from "@/lib/utils";
import { timeAgoLabel } from "@/lib/profile-utils";

type SurfaceProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

type StatCardProps = {
  label: string;
  value: number | string;
  meta?: string;
  accent?: "blue" | "amber" | "coral" | "violet" | "emerald";
};

type BarPoint = {
  label: string;
  value: number;
  color: string;
};

type DonutItem = {
  label: string;
  value: number;
  color: string;
};

type CourseTableRow = {
  id: string;
  title: string;
  category: string;
  progress: number;
  lastWatched: string;
  status: string;
  accessType: CourseListItem["accessType"];
};

const accentMap = {
  blue: "from-[#E7F0FF] to-white text-[#2463EB]",
  amber: "from-[#FFF0D8] to-white text-[#D48A28]",
  coral: "from-[#FFE6DF] to-white text-[#E86854]",
  violet: "from-[#EEE6FF] to-white text-[#7B56E8]",
  emerald: "from-[#E3FBF1] to-white text-[#14976B]"
} as const;

const accessTypeMap = {
  free: "bg-[#E5F2FF] text-[#2D68E6]",
  paid: "bg-[#FFF1E6] text-[#DC7C35]",
  subscription: "bg-[#EEE9FF] text-[#6B52E8]"
} as const;

const CountUpValue = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 700;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * progress));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
};

export const DashboardSurface = ({ children, className, ...props }: SurfaceProps) => (
  <m.div
    {...props}
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 240, damping: 24 }}
    className={cn(
      "rounded-[1.9rem] border border-[#ebe5dc] bg-[#fffdfa] shadow-[0_18px_42px_rgba(15,23,42,0.06)]",
      className
    )}
  >
    {children}
  </m.div>
);

export const DashboardStatCard = ({ label, value, meta, accent = "blue" }: StatCardProps) => {
  const isNumeric = typeof value === "number";
  const suffix = typeof value === "string" && value.endsWith("%") ? "%" : "";
  const numericValue = typeof value === "number" ? value : Number(value.replace("%", ""));

  return (
    <DashboardSurface className="overflow-hidden p-5">
      <div className={`rounded-[1.35rem] bg-gradient-to-br p-4 ${accentMap[accent]}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-current/70">{label}</p>
        <p className="mt-4 font-display text-[2rem] font-bold tracking-[-0.05em] text-current">
          {isNumeric || (suffix && Number.isFinite(numericValue)) ? (
            <CountUpValue value={Number.isFinite(numericValue) ? numericValue : 0} suffix={suffix} />
          ) : (
            value
          )}
        </p>
        {meta ? <p className="mt-2 text-sm text-slate-500">{meta}</p> : null}
      </div>
    </DashboardSurface>
  );
};

export const WeeklyLearningCard = ({
  title,
  subtitle,
  points
}: {
  title: string;
  subtitle: string;
  points: BarPoint[];
}) => (
  <DashboardSurface className="p-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF1E6] text-[#E28448]">
        <Sparkles className="h-4 w-4" />
      </span>
    </div>
    <div className="mt-6 flex items-end gap-3">
      {points.map((point, index) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-36 w-full items-end rounded-[1.4rem] bg-[#F5F2EC] p-2">
            <m.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(point.value, 8)}%` }}
              transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-[1rem]"
              style={{ background: point.color }}
            />
          </div>
          <span className="text-xs font-medium text-slate-400">{point.label}</span>
        </div>
      ))}
    </div>
  </DashboardSurface>
);

export const ProgressDonutCard = ({
  title,
  value,
  label,
  items
}: {
  title: string;
  value: number;
  label: string;
  items: DonutItem[];
}) => {
  const total = Math.max(items.reduce((sum, item) => sum + item.value, 0), 1);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <DashboardSurface className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{label}</p>
        </div>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#2C67EA]">
          <Clock3 className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-5 flex items-center gap-5">
        <div className="relative grid h-32 w-32 place-items-center">
          <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
            <circle cx="60" cy="60" r={radius} stroke="#EEF0F4" strokeWidth="16" fill="none" />
            {items.map((item, index) => {
              const strokeLength = (item.value / total) * circumference;
              const dashArray = `${strokeLength} ${circumference - strokeLength}`;
              const dashOffset = -accumulated;
              accumulated += strokeLength;

              return (
                <m.circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={item.color}
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.45 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
                />
              );
            })}
          </svg>
          <div className="absolute text-center">
            <p className="font-display text-4xl font-bold tracking-[-0.06em] text-slate-900">
              <CountUpValue value={value} suffix="%" />
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Completion</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardSurface>
  );
};

export const CourseProgressTable = ({
  title,
  subtitle,
  rows,
  emptyMessage
}: {
  title: string;
  subtitle: string;
  rows: CourseTableRow[];
  emptyMessage: string;
}) => (
  <DashboardSurface className="p-5">
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-900">{subtitle}</h3>
      </div>
      <span className="rounded-full bg-[#F5F2EC] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {rows.length} courses
      </span>
    </div>

    {rows.length ? (
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-[#EFE8DD] text-xs uppercase tracking-[0.18em] text-slate-400">
              <th className="pb-3 font-semibold">Course Name</th>
              <th className="pb-3 font-semibold">Category</th>
              <th className="pb-3 font-semibold">Progress</th>
              <th className="pb-3 font-semibold">Last Watched</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Access</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#F4EEE5] last:border-b-0">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-slate-900">{row.title}</p>
                </td>
                <td className="py-4 pr-4 text-sm text-slate-500">{row.category}</td>
                <td className="py-4 pr-4">
                  <div className="w-36">
                    <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F5]">
                      <m.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.progress}%` }}
                        transition={{ duration: 0.45 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#4E8CFF] to-[#7BCBFF]"
                      />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{row.progress}% complete</p>
                  </div>
                </td>
                <td className="py-4 pr-4 text-sm text-slate-500">{row.lastWatched}</td>
                <td className="py-4 pr-4 text-sm font-medium text-slate-700">{row.status}</td>
                <td className="py-4">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]", accessTypeMap[row.accessType])}>
                    {row.accessType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="mt-6 rounded-[1.5rem] bg-[#F6F2EB] px-5 py-6 text-sm text-slate-500">{emptyMessage}</div>
    )}
  </DashboardSurface>
);

export const MiniCourseList = ({
  title,
  items,
  emptyMessage
}: {
  title: string;
  items: Array<{ id: string; title: string; subtitle: string; meta: string; accent: string }>;
  emptyMessage: string;
}) => (
  <DashboardSurface className="p-5">
    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
    <div className="mt-5 space-y-3">
      {items.length ? (
        items.map((item) => (
          <div key={item.id} className="rounded-[1.35rem] border border-[#F0E7DA] bg-[#FCFAF6] p-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-3 w-3 rounded-full" style={{ background: item.accent }} />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.meta}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-[1.35rem] bg-[#F6F2EB] p-4 text-sm text-slate-500">{emptyMessage}</div>
      )}
    </div>
  </DashboardSurface>
);

export const buildCourseTableRows = (rows: CourseListItem[], lastWatchedMap?: Map<string, string>): CourseTableRow[] =>
  rows.map((course) => ({
    id: course.id,
    title: course.title,
    category: course.category,
    progress: course.progress ?? 0,
    lastWatched: lastWatchedMap?.get(course.id) ?? "Ready to start",
    status: (course.progress ?? 0) >= 90 ? "Completed" : (course.progress ?? 0) > 0 ? "In progress" : "Not started",
    accessType: course.accessType
  }));

export const createWeeklyBars = (values: number[]) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const palette = ["#F7B560", "#F27D72", "#F6C65B", "#E88AB8", "#70B4FF"];
  const max = Math.max(...values, 1);

  return labels.map((label, index) => ({
    label,
    value: Math.round((values[index] / max) * 100),
    color: `linear-gradient(180deg, ${palette[index]} 0%, ${palette[index]}CC 100%)`
  }));
};

export const createLastWatchedMap = (watchHistory: Array<{ courseId: string; watchedAt: string }>) =>
  new Map(
    watchHistory.map((entry) => [entry.courseId, timeAgoLabel(entry.watchedAt)])
  );

export const useStreak = (dates: string[]) =>
  useMemo(() => {
    if (!dates.length) {
      return 3;
    }

    const uniqueDays = Array.from(
      new Set(
        dates.map((value) => {
          const date = new Date(value);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
      )
    )
      .map((value) => new Date(value).getTime())
      .sort((left, right) => right - left);

    let streak = 1;

    for (let index = 1; index < uniqueDays.length; index += 1) {
      const diff = uniqueDays[index - 1] - uniqueDays[index];

      if (diff <= 24 * 60 * 60 * 1000 + 1000) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  }, [dates]);
