import { CourseCardSkeleton } from "@/components/course-card-skeleton";

export default function GlobalLoading() {
  return (
    <main>
      <section className="section-shell py-10 sm:py-14">
        <div className="animate-pulse rounded-[2.5rem] border border-slate-200 bg-white px-6 py-10 shadow-[0_14px_32px_rgba(15,23,42,0.07)] sm:px-10 sm:py-14">
          <div className="mx-auto h-5 w-48 rounded-full bg-slate-100" />
          <div className="mx-auto mt-6 h-16 w-full max-w-3xl rounded-[2rem] bg-slate-100" />
          <div className="mx-auto mt-5 h-5 w-full max-w-2xl rounded-full bg-slate-100" />
          <div className="mx-auto mt-3 h-5 w-2/3 rounded-full bg-slate-100" />
        </div>
      </section>
      <section className="section-shell pb-16">
        <div className="content-auto grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
