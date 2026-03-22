"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeRedirectPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingSession = useAuthStore((state) => state.isCheckingSession);

  useEffect(() => {
    if (!hasHydrated || isCheckingSession || user) {
      return;
    }

    const query = searchParams.toString();
    const redirectTo = normalizeRedirectPath(`${pathname}${query ? `?${query}` : ""}`);
    router.replace(`/login?next=${encodeURIComponent(redirectTo)}`);
  }, [hasHydrated, isCheckingSession, pathname, router, searchParams, user]);

  if (!hasHydrated || isCheckingSession || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,#fffdf8_0%,#f5f7fb_100%)] px-6">
        <div className="bubble-card max-w-md px-8 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">Secure access</p>
          <h1 className="bubble-title mt-4 text-3xl">Checking your session</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            We&apos;re verifying your login before opening this area.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};
