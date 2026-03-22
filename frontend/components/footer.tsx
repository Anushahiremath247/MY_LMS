import Link from "next/link";

export const Footer = () => (
  <footer className="section-shell py-10">
    <div className="soft-strip flex flex-col gap-6 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-display text-lg font-semibold text-primary">Lazy Learning</p>
        <p className="text-sm text-slate-600">A premium AI-powered LMS for calm, structured learning.</p>
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-slate-600">
        <Link href="/courses" className="transition hover:text-ink">
          Courses
        </Link>
        <Link href="/resources" className="transition hover:text-ink">
          Resources
        </Link>
        <Link href="/dashboard" className="transition hover:text-ink">
          Dashboard
        </Link>
        <Link href="/login" className="transition hover:text-ink">
          Login
        </Link>
      </div>
    </div>
  </footer>
);
