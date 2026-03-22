"use client";

export const CourseCardSkeleton = () => (
  <div className="h-full animate-pulse overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <div className="h-56 rounded-[1.6rem] bg-slate-100" />
    <div className="space-y-4 px-2 pb-2 pt-5">
      <div className="h-5 w-20 rounded-full bg-slate-100" />
      <div className="space-y-3">
        <div className="h-8 w-4/5 rounded-full bg-slate-100" />
        <div className="h-4 w-full rounded-full bg-slate-100" />
        <div className="h-4 w-3/4 rounded-full bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 rounded-[1.5rem] bg-slate-100" />
        <div className="h-20 rounded-[1.5rem] bg-slate-100" />
      </div>
      <div className="h-3 rounded-full bg-slate-100" />
      <div className="h-12 rounded-full bg-slate-100" />
    </div>
  </div>
);
