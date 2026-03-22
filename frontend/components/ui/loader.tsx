import { cn } from "@/lib/utils";

type LoaderProps = {
  label?: string;
  tone?: "default" | "light";
  className?: string;
};

export const Loader = ({ label = "Loading", tone = "default", className }: LoaderProps) => (
  <div
    className={cn(
      "flex items-center gap-2 text-sm",
      tone === "light" ? "text-white/90" : "text-slate-500",
      className
    )}
  >
    <span className={cn("h-2.5 w-2.5 animate-pulse-soft rounded-full", tone === "light" ? "bg-white" : "bg-primary")} />
    <span>{label}</span>
  </div>
);
