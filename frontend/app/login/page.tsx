import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up right where you left off with your next lesson, progress, and AI tutor support."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}

