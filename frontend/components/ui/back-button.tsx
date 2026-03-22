"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  fallbackHref?: string;
  label?: string;
};

export const BackButton = ({
  fallbackHref = "/dashboard",
  label = "Back"
}: BackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
};
