"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export const DashboardWelcome = () => {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Dashboard</p>
      <h1 className="mt-3 font-display text-5xl font-semibold">
        {mounted && user ? `Welcome back, ${user.name}` : "Continue where your momentum is strongest"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
        Resume active courses, watch your completion rise, and jump straight back into the next lesson.
      </p>
    </>
  );
};
