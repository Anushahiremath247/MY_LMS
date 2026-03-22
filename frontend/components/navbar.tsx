"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, LayoutDashboard, LogOut, Menu, Sparkles, UserRound, X } from "lucide-react";
import { resolveAvatarSrc } from "@/lib/image-fallbacks";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ui/image-with-fallback";
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
    navItems.forEach((item) => router.prefetch(item.href));
    router.prefetch("/login");
    router.prefetch("/register");
  }, [router]);

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
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-4 py-4 shadow-[0_14px_28px_rgba(15,23,42,0.07)] sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <nav className="hidden items-center md:flex">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`pressable flex h-14 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                        active
                          ? "min-w-[132px] gap-2.5 bg-primary text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]"
                          : "min-w-[56px] text-slate-500 hover:bg-white hover:text-slate-900"
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
                  <Link href="/profile" className="glass-panel pressable flex items-center gap-3 rounded-full px-3 py-2">
                    <ImageWithFallback
                      src={resolveAvatarSrc(user.avatar)}
                      fallbackSrc="/panda-logo.svg"
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full bg-slate-100"
                    />
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-primary/70">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="glass-panel pressable inline-flex h-12 w-12 items-center justify-center rounded-full text-ink transition"
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
              className="glass-panel pressable inline-flex h-12 w-12 items-center justify-center rounded-full text-ink md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileOpen ? (
            <div className="mt-4 space-y-4 md:hidden">
              <nav className="grid grid-cols-2 gap-2 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`pressable flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
                        active ? "bg-primary text-white" : "text-slate-600"
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
                    className="pressable flex items-center gap-3 rounded-[1.5rem] px-1"
                  >
                    <ImageWithFallback
                      src={resolveAvatarSrc(user.avatar)}
                      fallbackSrc="/panda-logo.svg"
                      alt={user.name}
                      width={48}
                      height={48}
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
