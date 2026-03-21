import { Search } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { Navbar } from "@/components/navbar";
import { getCourses } from "@/lib/api";

const filters = ["All", "Programming", "Frontend", "Backend", "AI / ML"];

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Course library</p>
            <h1 className="mt-3 font-display text-5xl font-semibold">Subjects built for focused progress</h1>
          </div>
          <div className="glass-panel flex w-full max-w-md items-center gap-3 rounded-full px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Search courses, topics, instructors..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                filter === "All" ? "bg-primary text-white" : "glass-panel text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          {["1", "2", "3"].map((page) => (
            <button
              key={page}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                page === "1" ? "bg-primary text-white" : "glass-panel text-slate-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

