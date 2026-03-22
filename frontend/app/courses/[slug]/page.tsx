import Link from "next/link";
import { CheckCircle2, Clock3, Crown, Lock, PlayCircle, Star } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { CourseCommerceActions } from "@/components/course-commerce-actions";
import { Navbar } from "@/components/navbar";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { formatPrice } from "@/lib/course-access";
import { getCourseFallbackThumbnail } from "@/lib/image-fallbacks";
import { getCourse, getCoursesPage } from "@/lib/api";

export default async function CourseDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const course = await getCourse(params.slug);
  const related = await getCoursesPage({ page: 1, limit: 4, category: course.category });
  const relatedCourses = related.courses.filter((item) => item.id !== course.id).slice(0, 3);
  const learnItems = [
    "Follow a clean, structured lesson path with clear next steps.",
    "Use AI support to clarify concepts without leaving your study flow.",
    "Track your progress across lessons, purchases, and memberships.",
    "Build momentum with a focused, premium learning experience."
  ];
  const badgeLabel = course.accessType === "free" ? "Free course" : course.accessType === "paid" ? "Premium purchase" : "Subscription access";
  const lessonOrderIndex = new Map(
    course.sections.flatMap((section) => section.videos).map((lesson, index) => [lesson.id, index])
  );

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[2.75rem] border border-slate-200 bg-white shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
              <div className="relative h-[360px] overflow-hidden">
                <ImageWithFallback
                  src={course.thumbnail}
                  fallbackSrc={getCourseFallbackThumbnail(course.category)}
                  alt={course.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/10" />
                <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
                    <span className="rounded-full bg-white/15 px-3 py-1 font-semibold uppercase tracking-[0.18em] text-white">
                      {badgeLabel}
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1">{course.category}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">{course.level}</span>
                    <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
                      <Star className="h-4 w-4 fill-current" />
                      {course.rating}
                    </span>
                  </div>
                  <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold tracking-[-0.05em] text-white">
                    {course.title}
                  </h1>
                  <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">{course.description}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">What you will learn</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {learnItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
                <p className="text-sm text-white/60">Instructor</p>
                <p className="mt-2 text-xl font-semibold">{course.instructor}</p>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Duration</p>
                    <p className="mt-2 text-base font-semibold">{course.duration}</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/50">Lessons</p>
                    <p className="mt-2 text-base font-semibold">{course.lessonsCount} lessons</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Course curriculum</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Structured lessons with clear progress</h2>
                </div>
                {course.accessType === "subscription" ? <Crown className="h-8 w-8 text-primary" /> : null}
              </div>
              <div className="mt-6 space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{section.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{section.videos.length} lessons inside this section</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {section.videos.map((lesson, index) => {
                        const absoluteIndex = lessonOrderIndex.get(lesson.id) ?? index;
                        const previewBlocked =
                          course.accessType !== "free" &&
                          (course.previewLessonsCount ?? 0) > 0 &&
                          absoluteIndex + 1 > (course.previewLessonsCount ?? 0);

                        return (
                          <div key={lesson.id} className="flex flex-col gap-4 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                              <div className="relative h-20 w-32 overflow-hidden rounded-[1.1rem] border border-slate-200 bg-slate-100">
                                <ImageWithFallback
                                  src={lesson.thumbnailUrl ?? course.thumbnail}
                                  fallbackSrc={getCourseFallbackThumbnail(course.category)}
                                  alt={lesson.title}
                                  fill
                                  sizes="128px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-slate-900">{lesson.title}</p>
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    Lesson {absoluteIndex + 1}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs leading-6 text-slate-500">{lesson.description}</p>
                                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                                  {Math.max(6, Math.round(lesson.durationSeconds / 60))} min watch
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 md:self-stretch">
                              {previewBlocked ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  <Lock className="h-4 w-4" />
                                  Locked
                                </span>
                              ) : (
                                <Link
                                  href={`/learn/${course.id}?lesson=${lesson.id}`}
                                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  Watch lesson
                                </Link>
                              )}
                              {lesson.completed ? <CheckCircle2 className="h-4 w-4 text-primary" /> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Student reviews</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  "Clear structure and a much stronger learning flow than scattered tutorials.",
                  "Premium pacing, useful curriculum, and better motivation because the next step stays obvious."
                ].map((quote, index) => (
                  <div key={quote} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm leading-7 text-slate-600">{quote}</p>
                    <p className="mt-4 text-sm font-semibold text-slate-900">Learner review #{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            {relatedCourses.length ? (
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Related courses</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Continue your path with similar topics</h2>
                <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {relatedCourses.map((item) => (
                    <CourseCard key={item.id} course={item} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.2em] text-primary/75">Course access</p>
              <p className="mt-4 text-4xl font-bold tracking-[-0.05em] text-slate-900">
                {course.accessType === "free" ? "Free" : formatPrice(course.price)}
              </p>
              {course.listPrice && course.listPrice > course.price && course.price > 0 ? (
                <p className="mt-2 text-sm text-slate-400 line-through">{formatPrice(course.listPrice)}</p>
              ) : null}
              <div className="mt-6 grid gap-3">
                {[
                  { icon: Clock3, label: "Duration", value: course.duration },
                  { icon: PlayCircle, label: "Lessons", value: `${course.lessonsCount} lessons` },
                  { icon: Star, label: "Rating", value: `${course.rating} learner rating` }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[1.35rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <CourseCommerceActions course={course} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Included</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Structured video learning path</li>
                <li>Course progress tracking</li>
                <li>AI tutor lesson support</li>
                <li>Certificate-ready completion flow</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
