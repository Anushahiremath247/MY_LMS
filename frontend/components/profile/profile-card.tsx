"use client";

import { Mail, UserRound } from "lucide-react";
import type { Course } from "@/types";
import { resolveAvatarSrc } from "@/lib/image-fallbacks";
import { calculateProfileCompletion, timeAgoLabel } from "@/lib/profile-utils";
import { useProfileStore } from "@/store/profile-store";
import { ImageWithFallback } from "../ui/image-with-fallback";
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
        <ImageWithFallback
          src={resolveAvatarSrc(profile.avatar)}
          fallbackSrc="/panda-logo.svg"
          alt={profile.fullName}
          width={96}
          height={96}
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Enrolled Courses", value: enrolledCourses.length, valueClassName: "text-4xl" },
            { label: "Progress Summary", value: `${averageProgress}%`, valueClassName: "text-4xl" },
            { label: "Certificates", value: certificates, valueClassName: "text-4xl" },
            { label: "Last Login", value: timeAgoLabel(profile.lastLoginAt), valueClassName: "text-3xl" }
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className={`mt-3 font-display font-bold tracking-[-0.04em] text-primary ${stat.valueClassName}`}>
                {stat.value}
              </p>
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
