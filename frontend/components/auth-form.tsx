"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Chrome, Eye, EyeOff, Github } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, normalizeRedirectPath, registerUser, startSocialLogin } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "./ui/button";

const buildSchema = (mode: "login" | "register") =>
  z.object({
    name:
      mode === "register"
        ? z.string().min(2, "Please enter your full name")
        : z.string().optional(),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
  });

type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

const getAuthErrorMessage = (code: string | null) => {
  switch (code) {
    case "oauth_state_invalid":
      return "Your social sign-in session expired. Please try again.";
    case "oauth_callback_failed":
      return "We couldn't finish your social login. Please try again.";
    case "oauth_google_not_configured":
      return "Google login is not configured yet. Add the Google client credentials and try again.";
    case "oauth_github_not_configured":
      return "GitHub login is not configured yet. Add the GitHub client credentials and try again.";
    case "oauth_google_failed":
      return "Google login failed. Please try again.";
    case "oauth_github_failed":
      return "GitHub login failed. Please try again.";
    default:
      return null;
  }
};

export const AuthForm = ({ mode }: { mode: "login" | "register" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const redirectTo = normalizeRedirectPath(searchParams.get("next"));
  const queryError = getAuthErrorMessage(searchParams.get("error"));
  const authLinkSuffix = redirectTo !== "/dashboard" ? `?next=${encodeURIComponent(redirectTo)}` : "";
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(buildSchema(mode))
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const session =
        mode === "login"
          ? await loginUser({
              email: values.email,
              password: values.password
            })
          : await registerUser({
              name: values.name ?? "Lazy Learning Student",
              email: values.email,
              password: values.password
            });

      setSession(session);
      setIsLoading(false);
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      setServerError(error instanceof Error ? error.message : "Unable to sign you in right now");
    }
  });

  const handleSocialLogin = (provider: "google" | "github") => {
    setServerError(null);
    try {
      startSocialLogin(provider, redirectTo);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Social login is unavailable right now.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {mode === "register" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Full name</label>
          <input
            {...register("name")}
            placeholder="Aarav Sharma"
            className="glass-panel h-14 w-full rounded-[1.25rem] px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          {errors.name ? <p className="text-sm text-rose-500">{errors.name.message}</p> : null}
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Email</label>
        <input
          {...register("email")}
          placeholder="you@example.com"
          className="glass-panel h-14 w-full rounded-[1.25rem] px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
        {errors.email ? <p className="text-sm text-rose-500">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            className="glass-panel h-14 w-full rounded-[1.25rem] px-4 pr-12 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="button"
            className="pressable absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? <p className="text-sm text-rose-500">{errors.password.message}</p> : null}
      </div>
      {mode === "login" ? (
        <div className="flex items-center justify-between text-sm">
          <Link href={`/register${authLinkSuffix}`} className="text-primary">
            Create account
          </Link>
          <Link href="/forgot-password" className="text-slate-500">
            Forgot password?
          </Link>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href={`/login${authLinkSuffix}`} className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      )}
      <Button
        className="h-14 w-full rounded-[1.25rem]"
        type="submit"
        loading={isLoading}
        loadingLabel={mode === "login" ? "Signing in..." : "Creating account..."}
      >
        {mode === "login" ? "Login" : "Create account"}
      </Button>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="glass-panel pressable flex h-14 w-full items-center justify-center gap-2 rounded-[1.25rem] text-sm font-semibold text-slate-700"
        >
          <Chrome className="h-4 w-4" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("github")}
          className="glass-panel pressable flex h-14 w-full items-center justify-center gap-2 rounded-[1.25rem] text-sm font-semibold text-slate-700"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </button>
      </div>
      {serverError || queryError ? <p className="text-sm text-rose-500">{serverError || queryError}</p> : null}
    </form>
  );
};
