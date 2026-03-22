import { AuthGuard } from "@/components/auth-guard";
import { LearningWorkspace } from "@/components/learning-workspace";
import { getCourseTree } from "@/lib/api";

export default async function LearnPage({
  params,
  searchParams
}: {
  params: { subjectId: string };
  searchParams?: { lesson?: string };
}) {
  const course = await getCourseTree(params.subjectId);

  return (
    <AuthGuard>
      <LearningWorkspace course={course} initialLessonId={searchParams?.lesson} />
    </AuthGuard>
  );
}
