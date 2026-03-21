import { CourseBrowser } from "@/components/course-browser";
import { Navbar } from "@/components/navbar";
import { getCourses } from "@/lib/api";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <CourseBrowser courses={courses} />
      </section>
    </main>
  );
}
