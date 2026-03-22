import { ProfileActivityView } from "@/components/profile/profile-activity-view";
import { getCourses } from "@/lib/api";

export default async function ProfileActivityPage() {
  const courses = await getCourses();

  return <ProfileActivityView courses={courses} />;
}
