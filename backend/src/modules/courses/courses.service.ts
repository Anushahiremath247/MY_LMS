import crypto from "node:crypto";
import { CourseAccessType, PaymentStatus, type PaymentMethod, type SubscriptionBillingCycle } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { getCourseAccessSnapshot, getCoursePrimaryAction, getActiveSubscriptionForUser, canAccessCourse } from "./course-access.js";
import { getSubjectByIdentifier, listSubjects } from "../subjects/subjects.service.js";

const buildReference = (prefix: string) => `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

const createActivity = async (userId: string, action: string, description: string) => {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      description
    }
  });
};

export const getCoursesCatalog = async (options: {
  userId?: string;
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  accessType?: "free" | "paid" | "subscription";
}) => {
  const catalog = await listSubjects(options);

  if (!options.userId) {
    return {
      ...catalog,
      courses: catalog.courses.map((course) => ({
        ...course,
        purchased: false,
        hasActiveSubscription: false,
        canAccess: false,
        primaryAction: course.accessType === "free" ? "enroll" : course.accessType === "paid" ? "buy" : "subscribe"
      }))
    };
  }

  const [purchases, subscription] = await Promise.all([
    prisma.purchasedCourse.findMany({
      where: {
        userId: options.userId,
        subjectId: {
          in: catalog.courses.map((course) => course.id)
        }
      },
      select: {
        subjectId: true
      }
    }),
    getActiveSubscriptionForUser(options.userId)
  ]);

  const purchasedIds = new Set(purchases.map((item) => item.subjectId));
  const hasActiveSubscription = Boolean(subscription);

  return {
    ...catalog,
    courses: catalog.courses.map((course) => {
      const snapshot = {
        purchased: purchasedIds.has(course.id),
        enrolled: course.isEnrolled,
        hasActiveSubscription
      };

      return {
        ...course,
        purchased: snapshot.purchased,
        hasActiveSubscription,
        canAccess: canAccessCourse({ accessType: course.accessType as CourseAccessType }, snapshot),
        primaryAction: getCoursePrimaryAction({ accessType: course.accessType as CourseAccessType }, snapshot)
      };
    })
  };
};

export const getCourseByIdentifier = async (identifier: string, userId?: string) => {
  const course = await getSubjectByIdentifier(identifier, userId);
  const snapshot = await getCourseAccessSnapshot(userId, course.id);

  return {
    ...course,
    isEnrolled: snapshot.enrolled,
    purchased: snapshot.purchased,
    hasActiveSubscription: snapshot.hasActiveSubscription,
    canAccess: canAccessCourse(course, snapshot),
    primaryAction: getCoursePrimaryAction(course, snapshot)
  };
};

export const enrollInCourse = async (userId: string, identifier: string) => {
  const course = await getSubjectByIdentifier(identifier, userId);
  const snapshot = await getCourseAccessSnapshot(userId, course.id);

  if (course.accessType === CourseAccessType.paid && !snapshot.purchased) {
    throw new AppError("Purchase this course before enrolling.", StatusCodes.FORBIDDEN);
  }

  if (course.accessType === CourseAccessType.subscription && !snapshot.hasActiveSubscription) {
    throw new AppError("Activate a subscription to enroll in this course.", StatusCodes.FORBIDDEN);
  }

  await prisma.enrollment.upsert({
    where: {
      userId_subjectId: {
        userId,
        subjectId: course.id
      }
    },
    create: {
      userId,
      subjectId: course.id
    },
    update: {}
  });

  await createActivity(userId, "course.enrolled", `Enrolled in ${course.title}`);

  return {
    success: true,
    courseId: course.id,
    primaryAction: "start"
  };
};

export const buyCourse = async (
  userId: string,
  identifier: string,
  input: {
    method: PaymentMethod;
    simulateFailure?: boolean;
  }
) => {
  const course = await getSubjectByIdentifier(identifier, userId);

  if (course.accessType !== CourseAccessType.paid) {
    throw new AppError("Only paid courses can be purchased.", StatusCodes.BAD_REQUEST);
  }

  const existingPurchase = await prisma.purchasedCourse.findUnique({
    where: {
      userId_subjectId: {
        userId,
        subjectId: course.id
      }
    },
    include: {
      payment: true,
      order: true
    }
  });

  if (existingPurchase) {
    return {
      success: true,
      alreadyOwned: true,
      courseId: course.id,
      orderId: existingPurchase.orderId,
      paymentId: existingPurchase.paymentId
    };
  }

  const orderReference = buildReference("ORD");
  const paymentReference = buildReference("PAY");

  if (input.simulateFailure) {
    const failedOrder = await prisma.order.create({
      data: {
        userId,
        subjectId: course.id,
        amount: course.price,
        status: "failed",
        reference: orderReference,
        payments: {
          create: {
            userId,
            amount: course.price,
            status: PaymentStatus.failed,
            method: input.method,
            reference: paymentReference,
            type: "course_purchase"
          }
        }
      },
      include: {
        payments: true
      }
    });

    await createActivity(userId, "payment.failed", `Payment failed for ${course.title}`);

    return {
      success: false,
      status: "failed",
      orderId: failedOrder.id,
      paymentId: failedOrder.payments[0]?.id ?? null,
      message: "Payment failed. Please try again."
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        subjectId: course.id,
        amount: course.price,
        status: "paid",
        reference: orderReference
      }
    });

    const payment = await tx.payment.create({
      data: {
        userId,
        orderId: order.id,
        amount: course.price,
        status: PaymentStatus.succeeded,
        method: input.method,
        reference: paymentReference,
        type: "course_purchase"
      }
    });

    await tx.purchasedCourse.create({
      data: {
        userId,
        subjectId: course.id,
        orderId: order.id,
        paymentId: payment.id
      }
    });

    await tx.enrollment.upsert({
      where: {
        userId_subjectId: {
          userId,
          subjectId: course.id
        }
      },
      create: {
        userId,
        subjectId: course.id
      },
      update: {}
    });

    return {
      order,
      payment
    };
  });

  await createActivity(userId, "payment.succeeded", `Purchased ${course.title}`);

  return {
    success: true,
    status: "succeeded",
    courseId: course.id,
    orderId: result.order.id,
    paymentId: result.payment.id
  };
};

export const getSubscriptionPlans = async () =>
  prisma.subscriptionPlan.findMany({
    orderBy: [{ isRecommended: "desc" }, { priceMonthly: "asc" }]
  });

export const checkoutSubscription = async (
  userId: string,
  input: {
    planId: string;
    billingCycle: SubscriptionBillingCycle;
    method: PaymentMethod;
    simulateFailure?: boolean;
  }
) => {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: input.planId }
  });

  if (!plan) {
    throw new AppError("Subscription plan not found", StatusCodes.NOT_FOUND);
  }

  const amount = input.billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const orderReference = buildReference("SUB");
  const paymentReference = buildReference("PAY");

  if (input.simulateFailure) {
    const order = await prisma.order.create({
      data: {
        userId,
        subscriptionPlanId: plan.id,
        amount,
        status: "failed",
        reference: orderReference,
        payments: {
          create: {
            userId,
            amount,
            status: PaymentStatus.failed,
            method: input.method,
            reference: paymentReference,
            type: "subscription"
          }
        }
      }
    });

    await createActivity(userId, "subscription.failed", `Subscription payment failed for ${plan.name}`);

    return {
      success: false,
      status: "failed",
      orderId: order.id
    };
  }

  const durationDays = input.billingCycle === "yearly" ? 365 : 30;
  const subscriptionResult = await prisma.$transaction(async (tx) => {
    await tx.userSubscription.updateMany({
      where: {
        userId,
        status: "active"
      },
      data: {
        status: "canceled",
        canceledAt: new Date()
      }
    });

    const order = await tx.order.create({
      data: {
        userId,
        subscriptionPlanId: plan.id,
        amount,
        status: "paid",
        reference: orderReference
      }
    });

    const payment = await tx.payment.create({
      data: {
        userId,
        orderId: order.id,
        amount,
        status: PaymentStatus.succeeded,
        method: input.method,
        reference: paymentReference,
        type: "subscription"
      }
    });

    const subscription = await tx.userSubscription.create({
      data: {
        userId,
        planId: plan.id,
        paymentId: payment.id,
        billingCycle: input.billingCycle,
        status: "active",
        expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      }
    });

    return {
      order,
      payment,
      subscription
    };
  });

  await createActivity(userId, "subscription.activated", `Activated ${plan.name} subscription`);

  return {
    success: true,
    status: "succeeded",
    orderId: subscriptionResult.order.id,
    paymentId: subscriptionResult.payment.id,
    subscriptionId: subscriptionResult.subscription.id
  };
};
