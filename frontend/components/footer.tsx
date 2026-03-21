import Link from "next/link";

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="section-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-display text-lg font-semibold">Lazy Learning</p>
        <p className="text-sm text-slate-500">A premium AI-powered LMS for calm, structured learning.</p>
      </div>
      <div className="flex gap-6 text-sm text-slate-500">
        <Link href="/courses">Courses</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  </footer>
);
