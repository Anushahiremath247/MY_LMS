import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import type { Course } from "@/types";
import { ProgressBar } from "./ui/progress-bar";
import { Button } from "./ui/button";

export const CourseCard = ({ course }: { course: Course }) => (
  <article className="bubble-card group flex h-full flex-col transition duration-300 hover:-translate-y-2">
    <div className="relative mx-4 mt-4 h-56 overflow-hidden rounded-[2rem]">
      <Image
        src={course.thumbnail}
        alt={course.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f3fa0]/55 via-[#0f3fa0]/8 to-transparent" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/78 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {course.category}
        </span>
        <span className="glass-orb flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          {course.rating}
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-sm font-medium text-white/80">{course.instructor}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-white">{course.title}</h3>
      </div>
    </div>
    <div className="relative z-10 flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
      <div>
        <p className="mt-2 text-sm leading-6 text-slate-500">{course.shortDescription}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-panel rounded-[1.5rem] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-primary/55">Duration</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 className="h-4 w-4 text-primary" />
            <span>{course.duration}</span>
          </div>
        </div>
        <div className="glass-panel rounded-[1.5rem] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-primary/55">Lessons</p>
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
