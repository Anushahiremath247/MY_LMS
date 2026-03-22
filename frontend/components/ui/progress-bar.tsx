import { percentage } from "@/lib/utils";

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="space-y-2">
    <div className="overflow-hidden rounded-full border border-white/60 bg-primary/12 p-1 shadow-soft">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-primary via-[#4e92ff] to-secondary transition-all duration-700"
        style={{ width: percentage(value) }}
      />
    </div>
    <p className="text-sm text-primary/75">{value}% complete</p>
  </div>
);
