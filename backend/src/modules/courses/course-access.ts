import { CourseAccessType, type Subject } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export type CourseAccessSnapshot = {
  purchased: boolean;
  enrolled: boolean;
  hasActiveSubscription: boolean;
};

export const getActiveSubscriptionForUser = async (userId: string) =>
  prisma.userSubscription.findFirst({
    where: {
      userId,
      status: "active",
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      expiresAt: "desc"
    },
    include: {
      plan: true
    }
  });

export const getCourseAccessSnapshot = async (userId: string | undefined, subjectId: string): Promise<CourseAccessSnapshot> => {
  if (!userId) {
    return {
      purchased: false,
      enrolled: false,
      hasActiveSubscription: false
    };
  }

  const [purchase, enrollment, subscription] = await Promise.all([
    prisma.purchasedCourse.findUnique({
      where: {
        userId_subjectId: {
          userId,
          subjectId
        }
      }
    }),
    prisma.enrollment.findUnique({
      where: {
        userId_subjectId: {
          userId,
          subjectId
        }
      }
    }),
    getActiveSubscriptionForUser(userId)
  ]);

  return {
    purchased: Boolean(purchase),
    enrolled: Boolean(enrollment),
    hasActiveSubscription: Boolean(subscription)
  };
};

export const canAccessCourse = (course: Pick<Subject, "accessType">, snapshot: CourseAccessSnapshot) => {
  if (course.accessType === CourseAccessType.free) {
    return snapshot.enrolled;
  }

  if (course.accessType === CourseAccessType.paid) {
    return snapshot.purchased || snapshot.enrolled;
  }

  return snapshot.hasActiveSubscription || snapshot.enrolled;
};

export const getCoursePrimaryAction = (course: Pick<Subject, "accessType">, snapshot: CourseAccessSnapshot) => {
  if (course.accessType === CourseAccessType.free) {
    return snapshot.enrolled ? "start" : "enroll";
  }

  if (course.accessType === CourseAccessType.paid) {
    return snapshot.purchased || snapshot.enrolled ? "start" : "buy";
  }

  return snapshot.hasActiveSubscription || snapshot.enrolled ? "start" : "subscribe";
};
