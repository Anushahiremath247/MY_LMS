"use client";

import Link from "next/link";
import { ArrowUpRight, BookCopy, Crown, PlayCircle, ReceiptText } from "lucide-react";
import type { CourseListItem } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { CourseCard } from "./course-card";
import { DashboardWelcome } from "./dashboard-welcome";
import { Reveal } from "./ui/reveal";
import { ProgressBar } from "./ui/progress-bar";

export const DashboardExperience = ({ courses }: { courses: CourseListItem[] }) => {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const account = useCommerceStore((state) => (userId ? state.accounts[userId] : undefined));
  const enrolledCourses = courses.filter((course) => account?.enrolledCourseIds.includes(course.id));
  const purchasedCourses = courses.filter((course) =>
    account?.purchasedCourses.some((purchase) => purchase.courseId === course.id)
  );
  const freeCourses = courses.filter((course) => course.accessType === "free").slice(0, 3);
  const premiumCourses = courses.filter((course) => course.accessType !== "free").slice(0, 3);
  const continueCourse =
    enrolledCourses
      .filter((course) => typeof course.progress === "number")
      .sort((left, right) => (right.progress ?? 0) - (left.progress ?? 0))[0] ?? enrolledCourses[0];
  const progressAverage = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress ?? 0), 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="space-y-10">
      <Reveal className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white px-8 py-8 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
          <DashboardWelcome />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={continueCourse ? `/learn/${continueCourse.id}` : "/courses"}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5"
            >
              {continueCourse ? "Continue learning" : "Explore courses"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
            >
              View profile
            </Link>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-slate-950 px-8 py-8 text-white shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
          <p className="text-sm uppercase tracking-[0.24em] text-white/65">Progress summary</p>
          <p className="mt-3 text-5xl font-bold tracking-[-0.05em]">{progressAverage}%</p>
          <div className="mt-6">
            <ProgressBar value={progressAverage} tone="light" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Enrolled", value: enrolledCourses.length, icon: BookCopy },
              { label: "Purchased", value: purchasedCourses.length, icon: ReceiptText },
              { label: "Membership", value: account?.activeSubscription ? "Active" : "Off", icon: Crown }
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4">
                <stat.icon className="h-4 w-4 text-white/70" />
                <p className="mt-4 text-sm text-white/65">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="grid gap-6 lg:grid-cols-[1fr_340px]" delay={0.03}>
        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Continue learning</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                {continueCourse?.title ?? "Choose your next course"}
              </h2>
            </div>
            <PlayCircle className="h-10 w-10 text-primary" />
          </div>
          <p className="mt-3 text-base leading-8 text-slate-500">
            {continueCourse
              ? continueCourse.shortDescription
              : "Start with a free course, then unlock premium and subscription tracks as you build momentum."}
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Active subscription</p>
          {account?.activeSubscription ? (
            <>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{account.activeSubscription.planName}</h3>
              <p className="mt-2 text-sm text-slate-500">
                Renews until {new Date(account.activeSubscription.expiresAt).toLocaleDateString()}
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">No active plan</h3>
              <p className="mt-2 text-sm text-slate-500">Upgrade to unlock subscription-only courses and premium learning tools.</p>
            </>
          )}
        </div>
      </Reveal>

      {enrolledCourses.length ? (
        <Reveal delay={0.04}>
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Your courses</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Enrolled and in progress</h2>
              </div>
              <Link href="/courses" className="text-sm font-semibold text-primary">
                Browse more
              </Link>
            </div>
            <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {enrolledCourses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal className="space-y-0" delay={0.05}>
        <section>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Recommendations</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Free starts and premium upgrades</h2>
          </div>
          <div className="grid gap-10 xl:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Free courses</h3>
              <div className="content-auto grid gap-6">
                {freeCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Premium picks</h3>
              <div className="content-auto grid gap-6">
                {premiumCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
};
