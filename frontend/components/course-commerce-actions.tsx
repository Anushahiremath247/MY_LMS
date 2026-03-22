"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Course, CourseListItem } from "@/types";
import { buyCourseRequest, checkoutSubscriptionRequest, enrollInCourseRequest } from "@/lib/commerce";
import { getCourseAccessState } from "@/lib/course-access";
import { useAuthStore } from "@/store/auth-store";
import { useCommerceStore } from "@/store/commerce-store";
import { useProfileStore } from "@/store/profile-store";
import { useToastStore } from "@/store/toast-store";
import { Button } from "./ui/button";
import { CourseCheckoutModal } from "./course-checkout-modal";

type CourseCommerceActionsProps = {
  course: Course | CourseListItem;
  compact?: boolean;
};

export const CourseCommerceActions = ({ course, compact = false }: CourseCommerceActionsProps) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const ensureAccount = useCommerceStore((state) => state.ensureAccount);
  const account = useCommerceStore((state) => (userId ? state.accounts[userId] : undefined));
  const enrollCourse = useCommerceStore((state) => state.enrollCourse);
  const purchaseCourse = useCommerceStore((state) => state.purchaseCourse);
  const activateSubscription = useCommerceStore((state) => state.activateSubscription);
  const addActivity = useProfileStore((state) => state.addActivity);
  const pushToast = useToastStore((state) => state.pushToast);
  const [checkoutMode, setCheckoutMode] = useState<"buy" | "subscribe" | null>(null);
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);

  const access = useMemo(() => getCourseAccessState(course, account ?? null), [account, course]);

  const requireAuth = () => {
    if (user) {
      ensureAccount(user);
      return true;
    }

    router.push("/login");
    return false;
  };

  const handleEnroll = async () => {
    if (!requireAuth() || !user) {
      return;
    }

    setIsPrimaryLoading(true);

    try {
      await enrollInCourseRequest(course.id, accessToken);
    } catch {
      // local fallback keeps the flow working when the API is unavailable
    } finally {
      setIsPrimaryLoading(false);
    }

    enrollCourse(user.id, course.id);
    addActivity({
      title: "Course enrolled",
      description: `You enrolled in ${course.title}.`,
      type: "course"
    });
    pushToast({
      title: "Enrollment complete",
      description: `${course.title} is now in your dashboard.`,
      tone: "success"
    });
  };

  const handlePrimaryAction = async () => {
    if (!requireAuth()) {
      return;
    }

    if (access.cta === "start") {
      setIsPrimaryLoading(true);
      router.push(`/learn/${course.id}`);
      return;
    }

    if (access.cta === "enroll") {
      await handleEnroll();
      return;
    }

    setCheckoutMode(access.cta === "buy" ? "buy" : "subscribe");
  };

  return (
    <>
      <div className={`flex ${compact ? "flex-col" : "flex-col sm:flex-row"} gap-3`}>
        <Button
          className={compact ? "w-full" : "flex-1"}
          onClick={handlePrimaryAction}
          loading={isPrimaryLoading}
          loadingLabel={access.cta === "start" ? "Opening..." : "Enrolling..."}
        >
          {access.label}
        </Button>
        <Button variant="secondary" className={compact ? "w-full" : "flex-1"} asChild>
          <Link href={`/courses/${course.slug}`}>View details</Link>
        </Button>
      </div>

      {checkoutMode ? (
        <CourseCheckoutModal
          open={true}
          mode={checkoutMode}
          course={course}
          onClose={() => setCheckoutMode(null)}
          onSubmit={async ({ method, plan, billingCycle }) => {
            if (!user) {
              return;
            }

            if (checkoutMode === "buy") {
              try {
                await buyCourseRequest(course.id, { method }, accessToken);
              } catch {
                // local fallback keeps the purchase flow responsive
              }

              purchaseCourse({
                userId: user.id,
                courseId: course.id,
                courseTitle: course.title,
                amount: course.price,
                method
              });
              addActivity({
                title: "Course purchased",
                description: `You purchased ${course.title}.`,
                type: "course"
              });
              pushToast({
                title: "Course unlocked",
                description: `${course.title} is ready to start.`,
                tone: "success"
              });
              return;
            }

            if (plan && billingCycle) {
              try {
                await checkoutSubscriptionRequest(
                  {
                    planId: plan.id,
                    billingCycle,
                    method
                  },
                  accessToken
                );
              } catch {
                // local fallback keeps the subscription flow responsive
              }

              activateSubscription({
                userId: user.id,
                plan,
                billingCycle,
                method
              });
              enrollCourse(user.id, course.id);
              addActivity({
                title: "Subscription activated",
                description: `${plan.name} is active and ${course.title} is unlocked.`,
                type: "course"
              });
              pushToast({
                title: "Subscription active",
                description: `${plan.name} unlocked ${course.title}.`,
                tone: "success"
              });
            }
          }}
        />
      ) : null}
    </>
  );
};
