"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, LayoutDashboard, LogOut, Menu, Sparkles, UserRound, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { logoutUser } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/resources", label: "Resources", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logoutUser(accessToken);
    clearSession();
    setMobileOpen(false);
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40">
      <div className="section-shell py-5">
        <div className="bubble-card px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <nav className="hidden items-center md:flex">
              <div className="bubble-bar flex items-center gap-2 px-2 py-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex h-14 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                        active
                          ? "glass-orb min-w-[132px] gap-2.5 text-white"
                          : "min-w-[56px] text-sky-100/88 hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={active ? "inline" : "sr-only"}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              {mounted && user ? (
                <>
                  <Link href="/profile" className="glass-panel flex items-center gap-3 rounded-full px-3 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full bg-slate-100"
                    />
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-primary/70">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-ink transition hover:-translate-y-0.5"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-ink">
                    Sign in
                  </Link>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="glass-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-ink md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-4 space-y-4 md:hidden">
              <nav className="bubble-bar grid grid-cols-2 gap-2 p-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                        active ? "glass-orb text-white" : "text-sky-100/88"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              {mounted && user ? (
                <div className="glass-panel rounded-[2rem] p-4">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-[1.5rem] px-1"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="h-12 w-12 rounded-full bg-slate-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-primary/70">{user.email}</p>
                    </div>
                  </Link>
                  <Button variant="secondary" className="mt-4 w-full justify-center" onClick={handleLogout}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
