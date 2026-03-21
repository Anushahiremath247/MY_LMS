import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your workspace and start learning with structured courses, guided flow, and calm focus."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}

