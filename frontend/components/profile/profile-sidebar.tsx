"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Eye, LockKeyhole, PencilLine, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useProfileStore } from "@/store/profile-store";

const navItems = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/profile/edit", label: "Edit Profile", icon: PencilLine },
  { href: "/profile/security", label: "Security", icon: LockKeyhole },
  { href: "/profile/activity", label: "Activity", icon: ShieldCheck },
  { href: "/profile/settings#privacy", label: "Privacy", icon: Eye },
  { href: "/profile/settings#notifications", label: "Notifications", icon: Bell },
  { href: "/profile/settings#account", label: "Account Settings", icon: Settings }
];

export const ProfileSidebar = () => {
  const pathname = usePathname();
  const profile = useProfileStore((state) => state.profile);

  return (
    <aside className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-glass backdrop-blur-xl">
      <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile?.avatar}
          alt={profile?.fullName ?? "Profile avatar"}
          className="h-16 w-16 rounded-[1.5rem] bg-white/10 object-cover"
        />
        <p className="mt-4 font-display text-2xl font-semibold">{profile?.fullName ?? "Learner"}</p>
        <p className="mt-1 text-sm text-white/70">{profile?.role === "admin" ? "Administrator" : "Student"}</p>
      </div>
      <nav className="mt-5 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href.includes("#") && pathname === "/profile/settings");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-glass"
                  : "text-slate-600 hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
