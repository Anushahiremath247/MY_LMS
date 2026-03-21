import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import type { Course } from "@/types";
import { ProgressBar } from "./ui/progress-bar";
import { Button } from "./ui/button";

export const CourseCard = ({ course }: { course: Course }) => (
  <article className="glass-panel group flex h-full flex-col overflow-hidden rounded-4xl transition duration-300 hover:-translate-y-2 hover:shadow-soft">
    <div className="relative h-52 overflow-hidden">
      <Image
        src={course.thumbnail}
        alt={course.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {course.category}
        </span>
        <span className="flex items-center gap-1 text-sm text-slate-500">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {course.rating}
        </span>
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold text-ink">{course.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{course.shortDescription}</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Clock3 className="h-4 w-4" />
        <span>{course.duration}</span>
        <span>{course.lessonsCount} lessons</span>
      </div>
      <p className="text-sm font-medium text-slate-600">{course.instructor}</p>
      {typeof course.progress === "number" ? <ProgressBar value={course.progress} /> : null}
      <div className="mt-auto pt-2">
        <Button className="w-full" asChild>
          <Link href={`/courses/${course.slug}`}>{course.isEnrolled ? "Continue" : "Enroll now"}</Link>
        </Button>
      </div>
    </div>
  </article>
);
