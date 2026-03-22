import { prisma } from "../../lib/prisma.js";

export const getUserEnrollments = async (userId: string) =>
  prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: "desc" },
    include: {
      subject: {
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnail: true,
          accessType: true,
          price: true,
          category: true,
          duration: true,
          lessonsCount: true,
          level: true
        }
      }
    }
  });

export const getUserPurchases = async (userId: string) =>
  prisma.purchasedCourse.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subject: {
        select: {
          id: true,
          slug: true,
          title: true,
          thumbnail: true,
          category: true,
          level: true,
          duration: true,
          lessonsCount: true
        }
      },
      payment: true
    }
  });

export const getUserSubscription = async (userId: string) =>
  prisma.userSubscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      plan: true,
      payment: true
    }
  });

export const getUserPaymentHistory = async (userId: string) =>
  prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        include: {
          subject: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          },
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      }
    }
  });
