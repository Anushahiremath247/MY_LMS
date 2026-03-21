import Link from "next/link";
import { CheckCircle2, ChevronDown, Lock, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { getCourse } from "@/lib/api";

export default async function CourseDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const course = await getCourse(params.slug);

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <div className="glass-panel rounded-4xl p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{course.category}</span>
                <span>{course.instructor}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {course.rating}
                </span>
              </div>
              <h1 className="mt-5 font-display text-5xl font-semibold text-balance">{course.title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">{course.description}</p>
            </div>

            <div className="glass-panel rounded-4xl p-8">
              <h2 className="font-display text-3xl font-semibold">What you will learn</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  "Build strong fundamentals through structured videos",
                  "Use the AI tutor for summaries and explanation",
                  "Track progress with lesson-by-lesson completion",
                  "Move through a curriculum designed for momentum"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-secondary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-4xl p-8">
              <h2 className="font-display text-3xl font-semibold">Course Curriculum</h2>
              <div className="mt-6 space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-ink">{section.title}</h3>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {section.videos.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-ink">{lesson.title}</p>
                            <p className="text-xs text-slate-500">{lesson.description}</p>
                          </div>
                          {lesson.locked ? (
                            <Lock className="h-4 w-4 text-slate-400" />
                          ) : lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-secondary" />
                          ) : (
                            <span className="text-xs font-semibold text-primary">Open</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="glass-panel h-fit rounded-4xl p-6">
            <p className="text-sm text-slate-500">{course.duration}</p>
            <p className="mt-2 text-3xl font-display font-semibold">{course.lessonsCount} lesson path</p>
            <Button className="mt-6 w-full" asChild>
              <Link href={`/learn/${course.id}`}>Start learning</Link>
            </Button>
          </aside>
        </div>
      </section>
    </main>
  );
}
