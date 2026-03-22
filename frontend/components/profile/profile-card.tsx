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
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="bubble-card px-8 py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={profile.fullName}
          className="glass-panel h-24 w-24 rounded-[1.75rem] bg-slate-100 object-cover"
        />
        <div className="mt-5 flex items-center gap-2 text-primary">
          <UserRound className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">{profile.role}</span>
        </div>
        <h1 className="bubble-title mt-3 text-4xl">{profile.fullName}</h1>
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
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: "Enrolled Courses", value: enrolledCourses.length, icon: BookCopy, valueClassName: "text-[2.8rem] sm:text-5xl" },
            { label: "Progress Summary", value: `${averageProgress}%`, icon: Sparkles, valueClassName: "text-[2.8rem] sm:text-5xl" },
            { label: "Certificates", value: certificates, icon: Award, valueClassName: "text-[2.8rem] sm:text-5xl" },
            { label: "Last Login", value: timeAgoLabel(profile.lastLoginAt), icon: UserRound, valueClassName: "text-[2.2rem] sm:text-[2.8rem]" }
          ].map((stat) => (
            <div key={stat.label} className="bubble-card min-h-[190px] px-6 py-6">
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <p className="max-w-[12rem] text-base leading-7 text-slate-500 sm:text-lg">
                    {stat.label}
                  </p>
                  <span className="bubble-bar flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white">
                    <stat.icon className="h-4 w-4" />
                  </span>
                </div>
                <p
                  className={`mt-auto font-display font-bold leading-[0.9] tracking-[-0.05em] text-primary ${stat.valueClassName}`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bubble-card px-8 py-8">
          <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Learning summary</p>
          <h2 className="bubble-title relative z-10 mt-3 text-3xl">A cleaner view of your progress</h2>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500">
            You are tracking well across your active paths. Keep your momentum by revisiting the course with the highest current completion and pushing one lesson further.
          </p>
        </div>
      </div>
    </div>
  );
};
