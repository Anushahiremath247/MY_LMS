"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Course, Lesson } from "@/types";
import { AIChatPanel } from "./ai-chat-panel";
import { Logo } from "./logo";
import { SidebarLessonItem } from "./sidebar-lesson-item";
import { Button } from "./ui/button";
import { ProgressBar } from "./ui/progress-bar";
import { VideoPlayer } from "./video-player";

type LessonEntry = Lesson & {
  sectionId: string;
  sectionTitle: string;
};

const flattenLessons = (course: Course): LessonEntry[] =>
  course.sections.flatMap((section) =>
    section.videos.map((lesson) => ({
      ...lesson,
      sectionId: section.id,
      sectionTitle: section.title
    }))
  );

export const LearningWorkspace = ({ course }: { course: Course }) => {
  const allLessons = useMemo(() => flattenLessons(course), [course]);
  const [currentLessonId, setCurrentLessonId] = useState(allLessons.find((lesson) => !lesson.locked)?.id ?? allLessons[0]?.id ?? "");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(course.sections.map((section, index) => [section.id, index < 2]))
  );

  const currentLesson = allLessons.find((lesson) => lesson.id === currentLessonId) ?? allLessons[0];
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === currentLesson?.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 ? allLessons[currentIndex + 1] ?? null : null;
  const completion = Math.round(
    (allLessons.filter((lesson) => lesson.completed).length / Math.max(allLessons.length, 1)) * 100
  );

  if (!currentLesson) {
    return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 bg-surface/75 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <Logo />
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 transition hover:text-ink">
              Back to dashboard
            </Link>
          </div>
        </header>
        <section className="section-shell py-16">
          <div className="bubble-card px-10 py-10 text-center">
            <h1 className="font-display text-4xl font-semibold text-ink">No lessons available yet</h1>
            <p className="mt-4 text-base leading-8 text-slate-500">
              This course outline is still being prepared. Check the course library for another active path in the meantime.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild>
                <Link href="/courses">Return to courses</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 bg-surface/75 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 lg:inline-flex">
              Learning workspace
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm text-slate-500">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft transition hover:text-ink">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/profile" className="hidden rounded-full bg-white px-4 py-2 shadow-soft transition hover:text-ink sm:inline-flex">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <section className="section-shell py-8">
        <div className={`grid gap-6 ${sidebarCollapsed ? "xl:grid-cols-[92px_1fr]" : "xl:grid-cols-[340px_1fr]"}`}>
          <aside className="bubble-card px-5 py-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              {sidebarCollapsed ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {completion}%
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-500">Course progress</p>
                  <p className="font-display text-2xl font-semibold text-ink">{course.title}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((value) => !value)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-ink"
              >
                {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            {!sidebarCollapsed ? (
              <>
                <ProgressBar value={completion} />
                <p className="mt-3 text-sm text-slate-500">
                  <span className="font-semibold text-ink">{completion}%</span> completed across {allLessons.length} lessons
                </p>
                <div className="mt-6 space-y-5">
                  {course.sections.map((section) => (
                    <div key={section.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSections((current) => ({
                            ...current,
                            [section.id]: !current[section.id]
                          }))
                        }
                        className="mb-3 flex w-full items-center justify-between text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-ink">{section.title}</p>
                          <p className="text-xs text-slate-500">{section.videos.length} lessons</p>
                        </div>
                        <PanelLeftOpen
                          className={`h-4 w-4 text-slate-400 transition ${openSections[section.id] ? "rotate-90" : ""}`}
                        />
                      </button>
                      {openSections[section.id] ? (
                        <div className="space-y-3">
                          {section.videos.map((lesson) => (
                            <SidebarLessonItem
                              key={lesson.id}
                              lesson={lesson}
                              active={lesson.id === currentLesson.id}
                              onSelect={() => {
                                if (!lesson.locked) {
                                  setCurrentLessonId(lesson.id);
                                }
                              }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 space-y-3">
                {allLessons.map((lesson) => (
                  <SidebarLessonItem
                    key={lesson.id}
                    lesson={lesson}
                    active={lesson.id === currentLesson.id}
                    compact
                    onSelect={() => {
                      if (!lesson.locked) {
                        setCurrentLessonId(lesson.id);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </aside>

          <div className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <VideoPlayer youtubeId={currentLesson.youtubeId} title={currentLesson.title} />
              <div className="bubble-card px-6 py-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Current lesson</p>
                <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{currentLesson.title}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-500">{currentLesson.description}</p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Section</p>
                    <p className="mt-2 font-semibold text-ink">{currentLesson.sectionTitle}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</p>
                    <p className="mt-2 font-semibold text-ink">
                      {currentLesson.completed ? "Completed" : currentLesson.locked ? "Locked" : "In progress"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Course completion</p>
                    <p className="mt-2 font-semibold text-ink">{completion}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bubble-card px-8 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">Now playing</p>
                  <h2 className="mt-3 font-display text-4xl font-semibold text-ink">{currentLesson.title}</h2>
                </div>
                <div className="min-w-[220px]">
                  <ProgressBar value={completion} />
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">{currentLesson.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="secondary"
                  onClick={() => previousLesson && !previousLesson.locked && setCurrentLessonId(previousLesson.id)}
                  disabled={!previousLesson || previousLesson.locked}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
                <Button onClick={() => nextLesson && !nextLesson.locked && setCurrentLessonId(nextLesson.id)} disabled={!nextLesson || nextLesson.locked}>
                  Next Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AIChatPanel
        courseTitle={course.title}
        lessonTitle={currentLesson.title}
        lessonDescription={currentLesson.description}
      />
    </main>
  );
};
