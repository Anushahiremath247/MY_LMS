"use client";

import { Award, BookCopy, Mail, Sparkles, UserRound } from "lucide-react";
import type { Course } from "@/types";
import { calculateProfileCompletion, timeAgoLabel } from "@/lib/profile-utils";
import { useProfileStore } from "@/store/profile-store";
import { ProgressBar } from "../ui/progress-bar";

export const ProfileCard = ({ courses }: { courses: Course[] }) => {
  const profile = useProfileStore((state) => state.profile);

  if (!profile) {
    return null;
  }

  const enrolledCourses = courses.filter((course) => course.isEnrolled);
  const completion = calculateProfileCompletion(profile);
  const averageProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress ?? 0), 0) / enrolledCourses.length)
    : 0;
  const certificates = enrolledCourses.filter((course) => (course.progress ?? 0) >= 70).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-glass backdrop-blur-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.fullName}
          className="h-24 w-24 rounded-[1.75rem] bg-slate-100 object-cover"
        />
        <div className="mt-5 flex items-center gap-2 text-primary">
          <UserRound className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">{profile.role}</span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{profile.fullName}</h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Mail className="h-4 w-4" />
          {profile.email}
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-500">{profile.bio}</p>
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Profile completion</span>
            <span className="font-semibold text-ink">{completion}%</span>
          </div>
          <ProgressBar value={completion} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {skill}
            </span>
          ))}
        </div>
      </aside>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Enrolled Courses", value: enrolledCourses.length, icon: BookCopy },
            { label: "Progress Summary", value: `${averageProgress}%`, icon: Sparkles },
            { label: "Certificates", value: certificates, icon: Award },
            { label: "Last Login", value: timeAgoLabel(profile.lastLoginAt), icon: UserRound }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Learning summary</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink">A cleaner view of your progress</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
            You are tracking well across your active paths. Keep your momentum by revisiting the course with the highest current completion and pushing one lesson further.
          </p>
        </div>
      </div>
    </div>
  );
};
