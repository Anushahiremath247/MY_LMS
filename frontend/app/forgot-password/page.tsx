import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link so you can continue learning."
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            placeholder="you@example.com"
            className="glass-panel h-14 w-full rounded-[1.25rem] px-4 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <Button className="h-14 w-full rounded-[1.25rem]">Send reset link</Button>
        <Link href="/login" className="block text-center text-sm font-semibold text-primary">
          Back to login
        </Link>
      </form>
    </AuthShell>
  );
}
