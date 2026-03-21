import { Navbar } from "@/components/navbar";
import { ProfileSummary } from "@/components/profile-summary";
import { getCourses } from "@/lib/api";

export default async function ProfilePage() {
  const courses = await getCourses();

  return (
    <main>
      <Navbar />
      <section className="section-shell py-16">
        <ProfileSummary courses={courses} />
      </section>
    </main>
  );
}
