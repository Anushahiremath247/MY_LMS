import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { DashboardWelcome } from "@/components/dashboard-welcome";
import { Navbar } from "@/components/navbar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getCourses } from "@/lib/api";

export default async function DashboardPage() {
  const courses = await getCourses();
  const enrolledCourses = courses.filter((course) => course.isEnrolled);

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-4xl p-8">
            <DashboardWelcome />
          </div>
          <div className="glass-panel rounded-4xl p-8">
            <p className="text-sm text-slate-500">Overall completion</p>
            <p className="mt-2 font-display text-5xl font-semibold">68%</p>
            <div className="mt-6">
              <ProgressBar value={68} />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { label: "Courses enrolled", value: "08" },
            { label: "Lessons completed", value: "47" },
            { label: "Learning streak", value: "12 days" }
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-4xl p-6">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="font-display text-3xl font-semibold">Enrolled courses</h2>
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
