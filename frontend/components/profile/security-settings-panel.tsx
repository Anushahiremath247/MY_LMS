"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm the new password")
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"]
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export const SecuritySettingsPanel = () => {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const changePasswordTimestamp = useProfileStore((state) => state.changePasswordTimestamp);
  const resetSessions = useProfileStore((state) => state.resetSessions);
  const addActivity = useProfileStore((state) => state.addActivity);
  const clearAuth = useAuthStore((state) => state.clearSession);
  const pushToast = useToastStore((state) => state.pushToast);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema)
  });

  if (!profile) {
    return null;
  }

  const onSubmit = handleSubmit(async () => {
    changePasswordTimestamp();
    addActivity({
      title: "Password changed",
      description: "Your account password was updated successfully.",
      type: "security"
    });
    pushToast({
      title: "Password updated",
      description: "Your security details were updated.",
      tone: "success"
    });
    reset();
  });

  const handleLogoutAll = () => {
    resetSessions();
    clearAuth();
    setLogoutModalOpen(false);
    pushToast({
      title: "Logged out everywhere",
      description: "You have been signed out on all sessions.",
      tone: "success"
    });
    router.push("/login");
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="bubble-card px-8 py-8">
          <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Password</p>
          <h1 className="bubble-title relative z-10 mt-3 text-3xl">Security and session controls</h1>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Current password</label>
              <input
                type="password"
                {...register("currentPassword")}
                className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              {errors.currentPassword ? <p className="mt-2 text-sm text-rose-500">{errors.currentPassword.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">New password</label>
              <input
                type="password"
                {...register("newPassword")}
                className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              {errors.newPassword ? <p className="mt-2 text-sm text-rose-500">{errors.newPassword.message}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Confirm new password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="h-12 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-500">{errors.confirmPassword.message}</p> : null}
            </div>
            <Button type="submit" className="mt-2" disabled={isSubmitting}>
              Save new password
            </Button>
          </form>
        </section>

        <section className="bubble-card px-8 py-8">
          <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-primary/75">Sessions</p>
          <div className="mt-6 space-y-4">
            {profile.sessions.map((session) => (
              <div key={session.id} className="glass-panel rounded-[1.5rem] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{session.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{session.location}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {session.current ? "Current" : "Active"}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Last active {new Date(session.lastActiveAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setLogoutModalOpen(true)}>
              Logout all devices
            </Button>
            <p className="text-sm text-slate-500">
              Last password update: {new Date(profile.passwordUpdatedAt).toLocaleDateString()}
            </p>
          </div>
        </section>
      </div>

      <Modal open={logoutModalOpen} title="Logout all devices?" onClose={() => setLogoutModalOpen(false)}>
        <p className="text-sm leading-7 text-slate-500">
          This will revoke every active session and require you to log in again.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setLogoutModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogoutAll}>Confirm logout</Button>
        </div>
      </Modal>
    </>
  );
};
