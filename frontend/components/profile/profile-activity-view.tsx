"use client";

import type { CourseListItem } from "@/types";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { useProfileStore } from "@/store/profile-store";
import { ActivityList } from "./activity-list";
import { CourseCard } from "../course-card";

export const ProfileActivityView = ({ courses }: { courses: CourseListItem[] }) => {
  const profile = useProfileStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const account = useCommerceStore((state) => (user ? state.accounts[user.id] : undefined));

  if (!profile) {
    return null;
  }

  const recentlyViewed = courses.filter((course) =>
    account?.watchHistory.some((item) => item.courseId === course.id)
  );

  return (
    <div className="space-y-6">
      <ActivityList items={profile.activity} />
      <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Recently viewed courses</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {recentlyViewed.length ? (
            recentlyViewed.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <p className="text-sm text-slate-500">Your recently watched courses will appear here after you open the learning workspace.</p>
          )}
        </div>
      </div>
    </div>
  );
};
