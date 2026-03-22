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
    <div className="relative hidden overflow-hidden p-10 lg:block">
      <div className="relative flex h-full flex-col justify-center gap-12">
        <div className="self-start">
          <Logo size="hero" />
        </div>
        <div className="bubble-card mx-auto max-w-xl px-8 py-8 text-center">
          <p className="relative z-10 mb-4 text-sm uppercase tracking-[0.3em] text-primary/75">Continue your learning journey</p>
          <h1 className="bubble-title relative z-10 text-5xl leading-tight text-balance">
            A focused learning space built for deep work and real momentum.
          </h1>
          <p className="relative z-10 mt-6 text-base leading-7 text-slate-600">
            Structured lessons, AI guidance, clean progress tracking, and a premium study flow inspired by modern learning products.
          </p>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 sm:p-10">
      <div className="bubble-card w-full max-w-xl px-8 py-8 sm:px-10 sm:py-10">
        <div className="mb-8">
          <Logo size="compact" />
          <h2 className="bubble-title mt-3 text-4xl">{title}</h2>
          <p className="mt-3 text-base text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);
