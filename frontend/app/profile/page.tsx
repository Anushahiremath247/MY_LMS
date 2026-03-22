import { ProfileOverview } from "@/components/profile/profile-overview";
import { getCourses } from "@/lib/api";

export default async function ProfilePage() {
  const courses = await getCourses();

  return <ProfileOverview courses={courses} />;
}
