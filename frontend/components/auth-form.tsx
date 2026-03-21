"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, registerUser } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "./ui/button";
import { Loader } from "./ui/loader";

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

export const AuthForm = ({ mode }: { mode: "login" | "register" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
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
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      setServerError(error instanceof Error ? error.message : "Unable to sign you in right now");
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {mode === "register" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Full name</label>
          <input
            {...register("name")}
            placeholder="Aarav Sharma"
            className="h-14 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          {errors.name ? <p className="text-sm text-rose-500">{errors.name.message}</p> : null}
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600">Email</label>
        <input
          {...register("email")}
          placeholder="you@example.com"
          className="h-14 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
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
            className="h-14 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 pr-12 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? <p className="text-sm text-rose-500">{errors.password.message}</p> : null}
      </div>
      {mode === "login" ? (
        <div className="flex items-center justify-between text-sm">
          <Link href="/register" className="text-primary">
            Create account
          </Link>
          <Link href="/forgot-password" className="text-slate-500">
            Forgot password?
          </Link>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      )}
      <Button className="h-14 w-full rounded-[1.25rem]" type="submit">
        {isLoading ? <Loader /> : mode === "login" ? "Login" : "Create account"}
      </Button>
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center rounded-[1.25rem] border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5"
      >
        Continue with Google
      </button>
      {serverError ? <p className="text-sm text-rose-500">{serverError}</p> : null}
    </form>
  );
};
