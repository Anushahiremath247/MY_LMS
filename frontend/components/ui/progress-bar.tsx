import { percentage } from "@/lib/utils";

export const ProgressBar = ({ value }: { value: number }) => (
  <div className="space-y-2">
    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary via-sky-400 to-secondary transition-all duration-700"
        style={{ width: percentage(value) }}
      />
    </div>
    <p className="text-sm text-slate-500">{value}% complete</p>
  </div>
);

