import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import type { Course } from "@/types";
import { ProgressBar } from "./ui/progress-bar";
import { Button } from "./ui/button";

export const CourseCard = ({ course }: { course: Course }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-glass">
    <div className="relative h-56 overflow-hidden">
      <Image
        src={course.thumbnail}
        alt={course.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
          {course.category}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-slate-950/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
          {course.rating}
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-sm font-medium text-white/80">{course.instructor}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-white">{course.title}</h3>
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <p className="mt-2 text-sm leading-6 text-slate-500">{course.shortDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Duration</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{course.duration}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Lessons</p>
          <p className="mt-2 text-sm font-semibold text-slate-700">{course.lessonsCount} in path</p>
        </div>
      </div>
      {typeof course.progress === "number" ? <ProgressBar value={course.progress} /> : null}
      <div className="mt-auto pt-2">
        <Button className="w-full" asChild>
          <Link href={course.isEnrolled ? `/learn/${course.id}` : `/courses/${course.slug}`}>
            {course.isEnrolled ? "Continue path" : "View details"}
          </Link>
        </Button>
      </div>
    </div>
  </article>
);
