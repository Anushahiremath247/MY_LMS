"use client";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export const ToggleSwitch = ({ checked, onChange, label, description }: ToggleSwitchProps) => (
  <div className="glass-panel flex items-start justify-between gap-4 rounded-[1.5rem] p-4">
    <div>
      <p className="font-medium text-ink">{label}</p>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative mt-1 inline-flex h-7 w-12 shrink-0 rounded-full transition ${
        checked ? "bubble-bar bg-primary" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  </div>
);
