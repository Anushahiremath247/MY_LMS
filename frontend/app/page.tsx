import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChartSpline,
  CheckCircle2,
  Crown,
  Sparkles,
  UserRound,
  Video
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CourseCard } from "@/components/course-card";
import { SubscriptionPlansSection } from "@/components/subscription-plans-section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getCourseCatalogSummary, getCoursesPage, getSubscriptionPlans } from "@/lib/api";
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
  const [freeCatalog, premiumCatalog, subscriptionCatalog, courseSummary, plans] = await Promise.all([
    getCoursesPage({ page: 1, limit: 3, accessType: "free" }),
    getCoursesPage({ page: 1, limit: 3, accessType: "paid" }),
    getCoursesPage({ page: 1, limit: 3, accessType: "subscription" }),
    getCourseCatalogSummary(),
    getSubscriptionPlans()
  ]);

  return (
    <main>
      <Navbar />

      <section className="section-shell py-10 sm:py-14">
        <Reveal className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white px-8 py-10 shadow-[0_24px_55px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4" />
              Calm learning, serious progress
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-7xl">
              A premium learning system for free, paid, and subscription paths.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Browse professional courses, unlock premium tracks, manage your membership, and move through
              structured lessons with AI support and cleaner focus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/courses">
                  Explore courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Courses", value: courseSummary.totalCourses },
                { label: "Free paths", value: courseSummary.freeCourses },
                { label: "Premium catalog", value: courseSummary.paidCourses + courseSummary.subscriptionCourses }
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="bubble-card px-6 py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Access types</p>
              <div className="mt-5 space-y-4">
                {[
                  { icon: Bookmark, title: "Free courses", text: "Enroll instantly and begin learning right away." },
                  { icon: Crown, title: "Premium courses", text: "Buy once to unlock full-depth masterclasses." },
                  { icon: Sparkles, title: "Subscription catalog", text: "Activate membership for curated premium tracks." }
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.35rem] border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bubble-card px-6 py-7">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Quick access</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-white">
                <p className="text-sm text-white/65">Study assets</p>
                <p className="mt-2 text-3xl font-bold">{resources.length}+</p>
                <p className="mt-2 text-sm text-white/70">Curated YouTube resources and structured lessons ready to browse.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell py-8 sm:py-10">
        <Reveal className="grid gap-5 xl:grid-cols-4" delay={0.04}>
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
        </Reveal>
      </section>

      <section className="section-shell py-12 sm:py-16">
        <Reveal className="space-y-14" delay={0.06}>
          <div>
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">Free courses</p>
                <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-slate-950">Start learning without friction</h2>
              </div>
              <Button variant="secondary" asChild>
                <Link href="/courses">Browse catalog</Link>
              </Button>
            </div>
            <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {freeCatalog.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">Premium courses</p>
                <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-slate-950">Go deeper with purchase-ready masterclasses</h2>
              </div>
            </div>
            <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {premiumCatalog.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">Subscription library</p>
                <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-slate-950">Membership-only courses for continuous growth</h2>
              </div>
            </div>
            <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {subscriptionCatalog.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell py-6 sm:py-10">
        <Reveal delay={0.08}>
          <SubscriptionPlansSection plans={plans} />
        </Reveal>
      </section>

      <section className="section-shell py-4 sm:py-8">
        <Reveal className="grid gap-5 lg:grid-cols-3" delay={0.1}>
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
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
