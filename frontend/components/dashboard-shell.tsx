"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings2,
  Sparkles,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import { logoutUser } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "./ui/button";

type ShellSection = "dashboard" | "courses" | "learning" | "saved" | "certificates" | "subscription" | "profile" | "settings";

type DashboardShellProps = {
  children: React.ReactNode;
  section: ShellSection;
  heading: string;
  subheading: string;
};

const navItems = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", href: "/courses", label: "Courses", icon: BookOpen },
  { id: "learning", href: "/dashboard#learning", label: "My Learning", icon: GraduationCap },
  { id: "saved", href: "/profile#saved", label: "Saved", icon: Bookmark },
  { id: "certificates", href: "/profile#certificates", label: "Certificates", icon: Award },
  { id: "subscription", href: "/profile#subscription", label: "Subscription", icon: WalletCards },
  { id: "profile", href: "/profile", label: "Profile", icon: UserRound },
  { id: "settings", href: "/profile/settings", label: "Settings", icon: Settings2 }
] as const;

export const DashboardShell = ({ children, section, heading, subheading }: DashboardShellProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useProfileStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    navItems.forEach((item) => router.prefetch(item.href.split("#")[0] || item.href));
  }, [router]);

  const handleLogout = async () => {
    await logoutUser(accessToken);
    clearSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <main className="section-shell py-5 sm:py-7">
      <div className="rounded-[2.8rem] border border-white/70 bg-gradient-to-br from-[#F5F0E7] via-[#F7F5F0] to-[#EEF2F6] p-3 shadow-[0_40px_90px_rgba(15,23,42,0.10)]">
        <div className="grid gap-3 lg:grid-cols-[104px_minmax(0,1fr)]">
          <aside className="hidden min-h-[820px] rounded-[2.3rem] bg-[#161616] px-3 py-4 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex justify-center">
                <div className="grid h-16 w-16 place-items-center rounded-[1.5rem] bg-white/9 ring-1 ring-white/10">
                  <Image src="/panda-logo.svg" alt="Lazy Learning" width={38} height={38} className="h-10 w-10" priority />
                </div>
              </div>
              <nav className="mt-8 flex flex-col items-center gap-2">
                {navItems.map((item) => {
                  const active = section === item.id || pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={item.label}
                      className={cn(
                        "pressable flex h-12 w-12 items-center justify-center rounded-2xl text-white/58",
                        active ? "bg-[#2F75FF] text-white shadow-[0_14px_30px_rgba(47,117,255,0.35)]" : "bg-white/5 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3">
              <Link href="/profile" className="flex justify-center">
                <Image
                  src={profile?.avatar || user?.avatar || "/panda-logo.svg"}
                  alt={profile?.fullName || user?.name || "Learner"}
                  width={44}
                  height={44}
                  className="pressable h-11 w-11 rounded-full border border-white/12 bg-white/10 object-cover"
                />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="pressable flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/58 hover:bg-white/10 hover:text-white"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </aside>

          <div className="min-w-0 rounded-[2.3rem] bg-[#FFFCF8] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:p-6 lg:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen((value) => !value)}
                  className="pressable grid h-12 w-12 place-items-center rounded-2xl border border-[#ECE6DC] bg-white text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] lg:hidden"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{heading}</p>
                  <h1 className="mt-1 truncate text-2xl font-semibold tracking-[-0.04em] text-slate-900">{subheading}</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <label className="flex h-12 min-w-[240px] items-center gap-3 rounded-[1.4rem] border border-[#ECE6DC] bg-white px-4 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    placeholder="Search courses, lessons, resources"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
                {[Bell, Settings2].map((Icon, index) => (
                  <button
                    key={index}
                    type="button"
                    className="pressable grid h-12 w-12 place-items-center rounded-2xl border border-[#ECE6DC] bg-white text-slate-600 shadow-[0_10px_20px_rgba(15,23,42,0.05)]"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
                <Link href="/profile" className="pressable flex items-center gap-3 rounded-[1.5rem] border border-[#ECE6DC] bg-white px-3 py-2 shadow-[0_10px_20px_rgba(15,23,42,0.05)]">
                  <Image
                    src={profile?.avatar || user?.avatar || "/panda-logo.svg"}
                    alt={profile?.fullName || user?.name || "Learner"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="hidden text-left xl:block">
                    <p className="text-sm font-semibold text-slate-900">{profile?.fullName || user?.name || "Learner"}</p>
                    <p className="text-xs text-slate-400">{profile?.role === "admin" ? "Admin" : "Student"}</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
              <Logo size="compact" />
              <Button variant="secondary" className="rounded-[1rem] px-4 py-2.5" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {mobileOpen ? (
              <div className="mt-4 grid grid-cols-2 gap-2 rounded-[1.65rem] border border-[#ECE6DC] bg-[#F6F1EA] p-2 lg:hidden">
                {navItems.map((item) => {
                  const active = section === item.id || pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "pressable flex items-center gap-2 rounded-[1.15rem] px-3 py-3 text-sm font-medium",
                        active ? "bg-[#2F75FF] text-white shadow-[0_12px_24px_rgba(47,117,255,0.28)]" : "bg-white text-slate-600"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
};
