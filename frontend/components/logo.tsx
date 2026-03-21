import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-3">
    <span className="glass-panel flex h-11 w-11 items-center justify-center rounded-2xl">
      <Image src="/panda-logo.svg" alt="Lazy Learning logo" width={30} height={30} />
    </span>
    <div>
      <p className="font-display text-lg font-semibold tracking-tight text-ink">Lazy Learning</p>
      <p className="text-xs text-slate-500">Calm learning, serious progress</p>
    </div>
  </Link>
);
