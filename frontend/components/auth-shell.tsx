import Image from "next/image";
import { Logo } from "./logo";

export const AuthShell = ({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-sky-500 to-secondary p-10 lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="self-start rounded-[2rem] border border-white/30 bg-white/12 p-4 shadow-glass backdrop-blur-xl">
          <Logo size="hero" />
        </div>
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-white/30 bg-white/12 p-8 text-white backdrop-blur-xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/80">Continue your learning journey</p>
          <h1 className="font-display text-5xl font-semibold leading-tight text-balance">
            A focused learning space built for deep work and real momentum.
          </h1>
          <p className="mt-6 text-base leading-7 text-white/80">
            Structured lessons, AI guidance, clean progress tracking, and a premium study flow inspired by modern learning products.
          </p>
        </div>
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-[2.5rem] border border-white/30 bg-white/18 shadow-glass backdrop-blur-md">
          <Image src="/panda-logo.svg" alt="Lazy Learning panda" width={120} height={120} />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 sm:p-10">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-8 sm:p-10">
        <div className="mb-8">
          <Logo size="compact" />
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-base text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);
