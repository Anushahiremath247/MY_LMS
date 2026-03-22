"use client";

import type { Course } from "@/types";
import { useProfileStore } from "@/store/profile-store";
import { ActivityList } from "./activity-list";
import { CourseCard } from "../course-card";

export const ProfileActivityView = ({ courses }: { courses: Course[] }) => {
  const profile = useProfileStore((state) => state.profile);
  const activeCourses = courses.filter((course) => course.isEnrolled).slice(0, 3);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ActivityList items={profile.activity} />
      <div className="bubble-card px-8 py-8">
        <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Recently viewed courses</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {activeCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};
