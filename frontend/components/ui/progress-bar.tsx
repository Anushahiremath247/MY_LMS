import { percentage } from "@/lib/utils";

export const ProgressBar = ({
  value,
  tone = "default"
}: {
  value: number;
  tone?: "default" | "light";
}) => (
  <div className="space-y-2">
    <div
      className={`overflow-hidden rounded-full p-1 ${
        tone === "light"
          ? "border border-white/45 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          : "border border-white/60 bg-primary/12 shadow-soft"
      }`}
    >
      <div
        className={`h-2.5 rounded-full transition-all duration-700 ${
          tone === "light"
            ? "bg-gradient-to-r from-white via-[#a7dbff] to-[#7dc8ff]"
            : "bg-gradient-to-r from-primary via-[#4e92ff] to-secondary"
        }`}
        style={{ width: percentage(value) }}
      />
    </div>
    <p className={`text-sm ${tone === "light" ? "text-white/78" : "text-primary/75"}`}>{value}% complete</p>
  </div>
);
