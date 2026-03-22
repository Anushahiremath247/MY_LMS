"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, PencilLine, Settings2, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/profile", label: "Overview", icon: UserRound },
  { href: "/profile/edit", label: "Edit", icon: PencilLine },
  { href: "/profile/security", label: "Security", icon: ShieldCheck },
  { href: "/profile/activity", label: "Activity", icon: Activity },
  { href: "/profile/settings", label: "Settings", icon: Settings2 }
] as const;

export const ProfileSectionTabs = () => {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-[1.6rem] border border-[#ECE6DC] bg-[#F6F1EA] p-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href !== "/profile" && pathname.startsWith(`${tab.href}/`));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "pressable inline-flex items-center gap-2 rounded-[1.2rem] px-4 py-3 text-sm font-medium whitespace-nowrap",
                active ? "bg-white text-slate-900 shadow-[0_10px_20px_rgba(15,23,42,0.06)]" : "text-slate-500"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
