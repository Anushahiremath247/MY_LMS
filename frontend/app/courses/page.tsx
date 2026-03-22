import { CourseBrowser } from "@/components/course-browser";
import { Navbar } from "@/components/navbar";
import { getCoursesPage } from "@/lib/api";

export default async function CoursesPage() {
  const initialCatalog = await getCoursesPage({ page: 1, limit: 12 });

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <CourseBrowser initialCatalog={initialCatalog} />
      </section>
    </main>
  );
}
