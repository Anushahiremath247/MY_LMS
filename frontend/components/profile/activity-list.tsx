"use client";

import { BookMarked, Clock3, LockKeyhole, UserRoundCog } from "lucide-react";
import type { ActivityItem } from "@/types";
import { timeAgoLabel } from "@/lib/profile-utils";

const iconMap = {
  course: BookMarked,
  security: LockKeyhole,
  profile: UserRoundCog,
  system: Clock3
} as const;

export const ActivityList = ({ items }: { items: ActivityItem[] }) => (
  <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur-xl">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Recent activity</p>
    <div className="mt-6 space-y-4">
      {items.length ? (
        items.map((item) => {
          const Icon = iconMap[item.type];

          return (
            <div key={item.id} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  {timeAgoLabel(item.timestamp)}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No recent activity yet. Start exploring a course to populate your history.
        </div>
      )}
    </div>
  </div>
);
