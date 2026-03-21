import { LearningWorkspace } from "@/components/learning-workspace";
import { getCourseTree } from "@/lib/api";

export default async function LearnPage({
  params
}: {
  params: { subjectId: string };
}) {
  const course = await getCourseTree(params.subjectId);

  return <LearningWorkspace course={course} />;
}
