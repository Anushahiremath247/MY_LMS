import type { ActiveSubscription, Course, CourseAccessState, PurchasedCourse } from "@/types";

type CommerceAccountLike = {
  enrolledCourseIds: string[];
  purchasedCourses: PurchasedCourse[];
  activeSubscription: ActiveSubscription | null;
};

export const formatPrice = (value: number) =>
  value === 0
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(value);

export const getCourseAccessState = (
  course: Pick<Course, "id" | "accessType" | "isEnrolled" | "purchased" | "hasActiveSubscription" | "canAccess">,
  account?: CommerceAccountLike | null
): CourseAccessState => {
  const enrolled = Boolean(course.isEnrolled || account?.enrolledCourseIds.includes(course.id));
  const purchased = Boolean(course.purchased || account?.purchasedCourses.some((purchase) => purchase.courseId === course.id));
  const subscribed = Boolean(
    course.hasActiveSubscription || (account?.activeSubscription && account.activeSubscription.status === "active")
  );

  if (course.accessType === "free") {
    return {
      enrolled,
      purchased,
      subscribed,
      canAccess: course.canAccess ?? enrolled,
      cta: enrolled ? "start" : "enroll",
      label: enrolled ? "Start Learning" : "Enroll Free"
    };
  }

  if (course.accessType === "paid") {
    const canAccess = course.canAccess ?? (purchased || enrolled);
    return {
      enrolled,
      purchased,
      subscribed,
      canAccess,
      cta: canAccess ? "start" : "buy",
      label: canAccess ? "Start Learning" : "Buy Now"
    };
  }

  const canAccess = course.canAccess ?? (subscribed || enrolled);
  return {
    enrolled,
    purchased,
    subscribed,
    canAccess,
    cta: canAccess ? "start" : "subscribe",
    label: canAccess ? "Start Learning" : "Subscribe to Access"
  };
};
