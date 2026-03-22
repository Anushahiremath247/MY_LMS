import Link from "next/link";
import { ArrowUpRight, BrainCircuit, Flame, Trophy } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { Navbar } from "@/components/navbar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getCourses } from "@/lib/api";

export default async function DashboardPage() {
  const courses = await getCourses();
  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const averageCompletion = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress ?? 0), 0) / enrolledCourses.length)
    : 0;
  const completedLessons = enrolledCourses.reduce(
    (sum, course) => sum + Math.round(((course.progress ?? 0) / 100) * course.lessonsCount),
    0
  );
  const continueCourse = enrolledCourses
    .filter((course) => typeof course.progress === "number")
    .sort((left, right) => (right.progress ?? 0) - (left.progress ?? 0))[0];

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="bubble-card px-8 py-8">
            <DashboardWelcome />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={continueCourse ? `/learn/${continueCourse.id}` : "/courses"}
                className="bubble-bar inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                {continueCourse ? "Continue learning" : "Explore courses"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resources"
                className="glass-panel inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
              >
                Open resource vault
              </Link>
            </div>
          </div>
          <div className="bubble-panel min-h-[360px] overflow-visible p-8 text-white">
            <div className="relative z-10">
              <p className="text-sm text-white/78">Overall completion</p>
              <p className="mt-2 font-display text-5xl font-bold">{averageCompletion}%</p>
            </div>
            <div className="relative z-10 mt-6">
              <ProgressBar value={averageCompletion} tone="light" />
            </div>
            <div className="glass-orb relative z-10 mt-8 rounded-[2rem] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/72">Focused next step</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {continueCourse?.title ?? "Choose a fresh course path"}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/82">
                Keep your momentum by returning to the course with the strongest active progress.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { label: "Courses enrolled", value: String(enrolledCourses.length).padStart(2, "0"), icon: BrainCircuit },
            { label: "Lessons completed", value: String(completedLessons).padStart(2, "0"), icon: Trophy },
            { label: "Learning streak", value: "12 days", icon: Flame }
          ].map((stat) => (
            <div key={stat.label} className="bubble-card px-6 py-6">
              <div className="relative z-10 flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <span className="bubble-bar flex h-11 w-11 items-center justify-center rounded-2xl text-white">
                  <stat.icon className="h-5 w-5" />
                </span>
              </div>
              <p className="relative z-10 mt-3 font-display text-4xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <h2 className="bubble-title text-3xl">Enrolled courses</h2>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explore more
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  );
}
