"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logoutUser(accessToken);
    clearSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};
