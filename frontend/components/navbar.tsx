"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { logoutUser } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/courses", label: "Courses" },
  { href: "/resources", label: "Resources" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" }
];

export const Navbar = () => {
  const router = useRouter();
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {mounted && user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-soft"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="h-9 w-9 rounded-full bg-slate-100"
                  />
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-ink">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 transition hover:text-ink"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600">
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-soft md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mt-4 rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-glass md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-200 pt-4">
              {mounted && user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full bg-slate-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </Link>
                  <Button variant="secondary" className="w-full justify-center" onClick={handleLogout}>
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
          </div>
        ) : null}
      </div>
    </header>
  );
};
