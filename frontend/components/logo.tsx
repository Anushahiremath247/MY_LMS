import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  size?: "compact" | "default" | "hero";
  className?: string;
};

const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
  compact: "w-[170px] sm:w-[190px]",
  default: "w-[190px] sm:w-[230px]",
  hero: "w-[240px] sm:w-[320px]"
};

export const Logo = ({ size = "default", className = "" }: LogoProps) => (
  <Link href="/" className={`inline-flex items-center ${className}`.trim()} aria-label="Lazy Learning home">
    <Image
      src="/lazy-learning-logo.svg"
      alt="Lazy Learning"
      width={1240}
      height={360}
      priority
      className={`h-auto ${sizeClasses[size]}`}
    />
  </Link>
);
