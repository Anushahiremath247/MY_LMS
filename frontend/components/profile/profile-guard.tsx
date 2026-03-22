"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "../ui/button";

export const ProfileGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const profileHydrated = useProfileStore((state) => state.hasHydrated);
  const ensureProfile = useProfileStore((state) => state.ensureProfile);

  useEffect(() => {
    if (user) {
      ensureProfile(user);
    }
  }, [ensureProfile, user]);

  if (!authHydrated || !profileHydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[2rem] bg-white/70 p-6 shadow-soft">
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-white/70 p-8 shadow-soft">
          <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-4 h-40 animate-pulse rounded-[1.75rem] bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bubble-card px-8 py-8">
        <h1 className="bubble-title text-4xl">Sign in to manage your profile</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
          Profile details, security settings, and learning history are protected. Sign in to continue.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
