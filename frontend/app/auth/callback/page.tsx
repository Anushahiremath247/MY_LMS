"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { normalizeRedirectPath } from "@/lib/auth";
import type { AuthUser } from "@/types";
import { useAuthStore } from "@/store/auth-store";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
    const params = new URLSearchParams(hash);
    const accessToken = params.get("accessToken");
    const redirectTo = normalizeRedirectPath(params.get("redirectTo"));
    const encodedUser = params.get("user");

    if (!accessToken || !encodedUser) {
      router.replace(`/login?error=oauth_callback_failed&next=${encodeURIComponent(redirectTo)}`);
      return;
    }

    try {
      const user = JSON.parse(encodedUser) as AuthUser;
      setSession({ accessToken, user });
      router.replace(redirectTo);
      router.refresh();
    } catch {
      router.replace(`/login?error=oauth_callback_failed&next=${encodeURIComponent(redirectTo)}`);
    }
  }, [router, setSession]);

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,#fffdf8_0%,#f5f7fb_100%)] px-6">
      <div className="bubble-card max-w-md px-8 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">Social login</p>
        <h1 className="bubble-title mt-4 text-3xl">Finishing sign-in</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Your account is being verified and prepared for the dashboard.
        </p>
      </div>
    </main>
  );
}
