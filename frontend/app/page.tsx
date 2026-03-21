import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartSpline, CheckCircle2, Sparkles, Video } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/lib/api";
import { resources, testimonials } from "@/lib/demo-data";

const features = [
  {
    title: "Structured video learning",
    description: "Move lesson by lesson with a clear roadmap instead of scattered tabs.",
    icon: Video
  },
  {
    title: "AI tutor assistant",
    description: "Ask for summaries, clarification, or bite-sized guidance while you learn.",
    icon: BrainCircuit
  },
  {
    title: "Progress tracking",
    description: "Stay motivated with visible milestones and percentage-based course completion.",
    icon: ChartSpline
  },
  {
    title: "Smart recommendations",
    description: "Discover what to study next based on your current path and learning goals.",
    icon: Sparkles
  }
];

const productFlow = [
  {
    title: "Discover",
    copy: "Find a clean course path instead of collecting dozens of random tabs."
  },
  {
    title: "Learn",
    copy: "Watch the lesson, ask the AI tutor, and move through one clear next step."
  },
  {
    title: "Progress",
    copy: "Track completion, keep your streak alive, and return exactly where you left off."
  }
];

export default async function HomePage() {
  const courses = await getCourses();
  const enrolledCount = courses.filter((course) => course.isEnrolled).length;
  const totalLessons = courses.reduce((sum, course) => sum + course.lessonsCount, 0);

  return (
    <main>
      <Navbar />
      <section className="section-shell py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              AI-guided courses, calm interface, sharper momentum
            </span>
            <div className="space-y-5">
              <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-7xl text-balance">
                AI Powered Learning Platform
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-500">
                Learn through structured videos, a lesson-aware AI tutor, visible progress tracking, and curated paths designed to feel clean, professional, and easy to finish.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Focused lesson flow with fewer distractions",
                "AI tutor that stays inside the study experience",
                "Modern dashboard built for steady momentum"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-white/70 bg-white/75 px-4 py-4 shadow-soft backdrop-blur">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-secondary" />
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-glass backdrop-blur-xl sm:p-8">
            <div className="absolute inset-x-10 top-0 h-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative grid gap-4">
              <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
                <p className="text-sm text-white/65">Today&apos;s learning pulse</p>
                <p className="mt-2 font-display text-4xl font-semibold">73% focus score</p>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
                  Students move faster when the interface stays quiet and the next action stays obvious.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Curated resources", value: `${resources.length}+` },
                { label: "Active paths", value: String(courses.length).padStart(2, "0") },
                { label: "Enrolled learners", value: `${enrolledCount * 320}+` },
                { label: "Structured lessons", value: `${totalLessons}+` }
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] bg-white p-6 shadow-soft animate-float-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 font-display text-4xl font-semibold text-ink">{item.value}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-8 sm:py-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-panel rounded-4xl p-6 transition duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="mb-10 grid gap-6 rounded-[2.5rem] border border-white/70 bg-white/78 p-8 shadow-glass backdrop-blur-xl lg:grid-cols-3">
          {productFlow.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] bg-white p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{item.title}</p>
              <p className="mt-4 text-base leading-8 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Popular courses</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Structured paths students keep finishing</h2>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur-xl [&>p:nth-of-type(2)]:hidden"
            >
              <p className="text-base leading-8 text-slate-600">{`"${testimonial.quote}"`}</p>
              <p className="text-base leading-8 text-slate-600">“{testimonial.quote}”</p>
              <div className="mt-8">
                <p className="font-semibold text-ink">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
