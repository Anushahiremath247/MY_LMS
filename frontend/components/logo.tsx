import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: "compact" | "default" | "hero";
  className?: string;
};

const iconWrapClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  compact: "h-12 w-12 rounded-[1.35rem]",
  default: "h-14 w-14 rounded-[1.55rem]",
  hero: "h-20 w-20 rounded-[1.9rem]"
};

const iconClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  compact: "h-8 w-8",
  default: "h-10 w-10",
  hero: "h-14 w-14"
};

const titleClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  compact: "text-lg",
  default: "text-xl",
  hero: "text-3xl"
};

const subtitleClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  compact: "text-[8px] sm:text-[9px]",
  default: "text-[8px] sm:text-[9px]",
  hero: "text-[10px] sm:text-[11px]"
};

export const Logo = ({ size = "default", className = "" }: LogoProps) => (
  <Link href="/" className={`inline-flex min-w-0 items-center gap-3 ${className}`.trim()} aria-label="Lazy Learning home">
    <span className={`glass-panel flex items-center justify-center ${iconWrapClasses[size]}`}>
      <Image src="/panda-logo.svg" alt="Lazy Learning" width={80} height={80} className={iconClasses[size]} priority />
    </span>
    <span className="flex min-w-0 flex-col">
      <span className={`font-display font-bold leading-none tracking-[-0.04em] text-ink ${titleClasses[size]}`}>
        Lazy Learning
      </span>
      <span
        className={`mt-1 whitespace-nowrap font-medium uppercase tracking-[0.12em] text-primary/80 ${subtitleClasses[size]}`}
      >
        CALM LEARNING, SERIOUS PROGRESS
      </span>
    </span>
  </Link>
);
