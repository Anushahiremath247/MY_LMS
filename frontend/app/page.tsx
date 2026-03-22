import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChartSpline,
  CheckCircle2,
  Sparkles,
  UserRound,
  Video
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/lib/api";
import { resources, testimonials } from "@/lib/demo-data";

const features = [
  {
    title: "Structured video learning",
    description: "Move lesson by lesson with one clean next step instead of scattered open tabs.",
    icon: Video
  },
  {
    title: "AI tutor assistant",
    description: "Ask for summaries, explanations, and follow-up help without leaving the lesson flow.",
    icon: BrainCircuit
  },
  {
    title: "Progress tracking",
    description: "See completion clearly with lightweight stats, progress bars, and steady momentum cues.",
    icon: ChartSpline
  },
  {
    title: "Smart recommendations",
    description: "Surface the best next course, topic, or resource from your current learning path.",
    icon: Sparkles
  }
];

const quickActions = [
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: ChartSpline },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export default async function HomePage() {
  const courses = await getCourses();
  const enrolledCount = courses.filter((course) => course.isEnrolled).length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessonsCount, 0);

  return (
    <main>
      <Navbar />

      <section className="section-shell py-10 sm:py-14">
        <div className="bubble-card px-6 py-10 sm:px-10 sm:py-14">
          <div className="relative z-10">
            <p className="hero-kicker">How to learn with</p>
            <h1 className="bubble-title mt-4 text-center text-5xl sm:text-7xl lg:text-[5.75rem]">
              AI Powered Learning Platform
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-8 text-slate-600 sm:text-lg">
              Lazy Learning turns courses, progress, AI guidance, and resources into one calm bubble-style
              workspace that feels easy to navigate and hard to abandon.
            </p>

            <div className="mt-10 flex justify-center">
              <div className="bubble-bar flex flex-wrap items-center justify-center gap-3 p-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={`inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      index === 0 ? "glass-orb text-white" : "text-sky-100/90 hover:text-white"
                    }`}
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="soft-strip flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">Lazy Learning</p>
                  <p className="mt-1 text-sm font-medium text-ink">Guided paths, AI tutor, and clean progress.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/55">Study assets</p>
                  <p className="mt-1 text-sm font-medium text-ink">{resources.length}+ curated links</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {[
                  { label: "Courses", value: courses.length },
                  { label: "Enrolled", value: enrolledCount },
                  { label: "Lessons", value: totalLessons }
                ].map((stat) => (
                  <div key={stat.label} className="bubble-card px-5 py-5 text-center">
                    <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.22em] text-ink/55">
                      {stat.label}
                    </p>
                    <p className="relative z-10 mt-3 font-display text-4xl font-bold text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              {Array.from({ length: 7 }, (_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full ${index === 0 ? "bg-white shadow-soft" : "bg-white/55"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 sm:py-10">
        <div className="grid gap-5 xl:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="bubble-card px-6 py-7">
              <div className="relative z-10">
                <div className="bubble-bar inline-flex h-14 w-14 items-center justify-center">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold text-primary">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <div className="bubble-card px-6 py-8 sm:px-8 sm:py-10">
          <div className="relative z-10">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">Popular Courses</p>
                <h2 className="bubble-title mt-3 text-4xl sm:text-5xl">Most loved learning paths</h2>
              </div>
              <Button variant="secondary" asChild>
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-4 sm:py-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bubble-card px-6 py-7">
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/75">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Student voice
                </div>
                <p className="text-base leading-8 text-slate-700">{`"${testimonial.quote}"`}</p>
                <div className="mt-8">
                  <p className="font-display text-xl font-bold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
