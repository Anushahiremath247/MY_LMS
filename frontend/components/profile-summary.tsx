"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { CourseCard } from "./course-card";
import { Button } from "./ui/button";

export const ProfileSummary = ({ courses }: { courses: Course[] }) => {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  const enrolledCourses = useMemo(() => courses.filter((course) => course.isEnrolled), [courses]);
  const lessonsCompleted = useMemo(
    () =>
      enrolledCourses.reduce((total, course) => {
        const lessonEstimate = course.progress ? Math.round((course.lessonsCount * course.progress) / 100) : 0;
        return total + lessonEstimate;
      }, 0),
    [enrolledCourses]
  );
  const completionRate = useMemo(() => {
    if (!enrolledCourses.length) return 0;
    return Math.round(
      enrolledCourses.reduce((total, course) => total + (course.progress ?? 0), 0) / enrolledCourses.length
    );
  }, [enrolledCourses]);

  if (!mounted) {
    return <div className="glass-panel rounded-4xl p-8 text-sm text-slate-500">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="glass-panel rounded-4xl p-8">
        <h1 className="font-display text-3xl font-semibold">Sign in to view your profile</h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
          Your profile, enrolled courses, and progress will appear here once you log in or create an account.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <aside className="glass-panel rounded-4xl p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
          alt="Profile avatar"
          width={92}
          height={92}
          className="h-[92px] w-[92px] rounded-[2rem] bg-slate-100 object-cover"
        />
        <h1 className="mt-5 font-display text-3xl font-semibold">{user.name}</h1>
        <p className="mt-2 text-sm text-slate-500">{user.email}</p>
        <div className="mt-8 grid gap-4">
          {[
            { label: "Courses enrolled", value: String(enrolledCourses.length).padStart(2, "0") },
            { label: "Lessons completed", value: String(lessonsCompleted).padStart(2, "0") },
            { label: "Completion rate", value: `${completionRate}%` }
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-4 shadow-soft">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </aside>
      <div>
        <h2 className="font-display text-4xl font-semibold">Recent Courses</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {enrolledCourses.slice(0, 2).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};
