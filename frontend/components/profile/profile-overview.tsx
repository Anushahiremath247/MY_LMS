"use client";

import type { Course } from "@/types";
import { useProfileStore } from "@/store/profile-store";
import { ActivityList } from "./activity-list";
import { ProfileCard } from "./profile-card";
import { CourseCard } from "../course-card";

export const ProfileOverview = ({ courses }: { courses: Course[] }) => {
  const profile = useProfileStore((state) => state.profile);
  const enrolledCourses = courses.filter((course) => course.isEnrolled);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProfileCard courses={courses} />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ActivityList items={profile.activity.slice(0, 4)} />
        <div className="bubble-card px-8 py-8">
          <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Recent courses</p>
          <div className="mt-6 grid gap-5">
            {enrolledCourses.slice(0, 2).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
