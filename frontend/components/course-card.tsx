"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { memo, useMemo } from "react";
import { Clock3, PlayCircle, Star } from "lucide-react";
import type { Course, CourseListItem } from "@/types";
import { formatPrice, getCourseAccessState } from "@/lib/course-access";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { CourseCommerceActions } from "./course-commerce-actions";
import { ProgressBar } from "./ui/progress-bar";

export const CourseCard = memo(({ course }: { course: CourseListItem | Course }) => (
  <CourseCardInner course={course} />
));

const CourseCardInner = ({ course }: { course: CourseListItem | Course }) => {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const account = useCommerceStore((state) => (userId ? state.accounts[userId] : undefined));
  const access = useMemo(() => getCourseAccessState(course, account ?? null), [account, course]);
  const badgeLabel = course.accessType === "free" ? "Free" : course.accessType === "paid" ? "Premium" : "Subscription";

  return (
    <m.article
      initial={false}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.7 }}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition-[box-shadow,border-color] duration-200 hover:border-slate-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-900/12 to-transparent" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
            {course.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {badgeLabel}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white">
              <Star className="h-3.5 w-3.5 fill-white text-white" />
              {course.rating}
            </span>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 text-white/85">
            <PlayCircle className="h-4 w-4" />
            <p className="text-sm font-medium">{course.instructor}</p>
          </div>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">{course.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 px-6 pb-6 pt-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <span>{course.level}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{course.lessonsCount} lessons</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{course.shortDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Duration</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>{course.duration}</span>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Price</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              {course.accessType === "free" ? "Free access" : formatPrice(course.price)}
            </p>
          </div>
        </div>
        {typeof course.progress === "number" ? <ProgressBar value={course.progress} /> : null}
        <div className="mt-auto space-y-3 pt-2">
          <CourseCommerceActions course={course} compact />
          <p className="text-xs font-medium text-slate-500">
            {access.canAccess
              ? "Unlocked and ready in your dashboard."
              : course.accessType === "paid"
                ? "Buy once for lifetime access."
                : course.accessType === "subscription"
                  ? "Included with an active membership."
                  : "Free enrollment adds it to your dashboard."}
          </p>
        </div>
      </div>
    </m.article>
  );
};

CourseCard.displayName = "CourseCard";
