"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, OctagonAlert, X } from "lucide-react";
import { useToastStore } from "@/store/toast-store";

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-slate-200 bg-white text-slate-700"
} as const;

const toneIcons = {
  success: CheckCircle2,
  error: OctagonAlert,
  info: Info
} as const;

export const ToastRegion = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        dismissToast(toast.id);
      }, 2800)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [dismissToast, toasts]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const tone = toast.tone ?? "info";
        const Icon = toneIcons[tone];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-[1.75rem] border p-4 shadow-glass backdrop-blur-xl ${toneClasses[tone]}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
              </div>
              <button type="button" onClick={() => dismissToast(toast.id)} className="opacity-60 transition hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
