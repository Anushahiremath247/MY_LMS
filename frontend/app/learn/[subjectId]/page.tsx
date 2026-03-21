import Link from "next/link";
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AIChatPanel } from "@/components/ai-chat-panel";
import { Logo } from "@/components/logo";
import { SidebarLessonItem } from "@/components/sidebar-lesson-item";
import { ProgressBar } from "@/components/ui/progress-bar";
import { VideoPlayer } from "@/components/video-player";
import { getCourseTree } from "@/lib/api";

export default async function LearnPage({
  params
}: {
  params: { subjectId: string };
}) {
  const course = await getCourseTree(params.subjectId);
  const firstSection = course.sections[0];
  const currentLesson = firstSection?.videos[0];
  const lessons = course.sections.flatMap((section) => section.videos);
  const completion = Math.round(
    (lessons.filter((lesson) => lesson.completed).length / Math.max(lessons.length, 1)) * 100
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:inline-flex">
              Learning Workspace
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm text-slate-500">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
          </nav>
        </div>
      </header>

      <section className="section-shell py-8">
        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="glass-panel rounded-4xl p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Course progress</p>
                <p className="font-display text-2xl font-semibold">{course.title}</p>
              </div>
              <button className="rounded-full bg-slate-100 p-2 text-slate-500">
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <ProgressBar value={completion} />
            <div className="mt-6 space-y-5">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{section.title}</p>
                    <PanelLeftOpen className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="space-y-3">
                    {section.videos.map((lesson) => (
                      <SidebarLessonItem
                        key={lesson.id}
                        lesson={lesson}
                        active={lesson.id === currentLesson?.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {currentLesson ? <VideoPlayer youtubeId={currentLesson.youtubeId} title={currentLesson.title} /> : null}
            <div className="glass-panel rounded-4xl p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Now playing</p>
              <h1 className="mt-3 font-display text-4xl font-semibold">{currentLesson?.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-500">{currentLesson?.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-soft">
                  <ChevronLeft className="h-4 w-4" />
                  Previous Lesson
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glass">
                  Next Lesson
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AIChatPanel
        courseTitle={course.title}
        lessonTitle={currentLesson?.title}
        lessonDescription={currentLesson?.description}
      />
    </main>
  );
}
