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
  <div className="bubble-card px-8 py-8">
    <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Recent activity</p>
    <div className="mt-6 space-y-4">
      {items.length ? (
        items.map((item) => {
          const Icon = iconMap[item.type];

          return (
            <div key={item.id} className="glass-panel relative z-10 flex gap-4 rounded-[1.5rem] p-4">
              <span className="bubble-bar flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white">
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
        <div className="glass-panel relative z-10 rounded-[1.5rem] p-6 text-sm text-slate-500">
          No recent activity yet. Start exploring a course to populate your history.
        </div>
      )}
    </div>
  </div>
);
