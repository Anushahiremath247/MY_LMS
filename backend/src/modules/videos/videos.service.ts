import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";
import { canAccessCourse, getCourseAccessSnapshot } from "../courses/course-access.js";

export const getVideoById = async (videoId: string, userId?: string) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: {
          subject: {
            include: {
              sections: {
                orderBy: { orderIndex: "asc" },
                include: {
                  videos: {
                    orderBy: { orderIndex: "asc" }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!video) {
    throw new AppError("Video not found", StatusCodes.NOT_FOUND);
  }

  const orderedVideos = video.section.subject.sections.flatMap((section) => section.videos);
  const currentIndex = orderedVideos.findIndex((item) => item.id === videoId);
  const progress = userId
    ? await prisma.videoProgress.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId
          }
        }
      })
    : null;

  return {
    ...video,
    previousVideoId: currentIndex > 0 ? orderedVideos[currentIndex - 1].id : null,
    nextVideoId: orderedVideos[currentIndex + 1]?.id ?? null,
    progress
  };
};

export const getVideoAccess = async (videoId: string, userId?: string) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: {
          subject: {
            include: {
              sections: {
                orderBy: { orderIndex: "asc" },
                include: {
                  videos: {
                    orderBy: { orderIndex: "asc" }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!video) {
    throw new AppError("Video not found", StatusCodes.NOT_FOUND);
  }

  const orderedVideos = video.section.subject.sections.flatMap((section) => section.videos);
  const snapshot = await getCourseAccessSnapshot(userId, video.section.subject.id);
  const fullyAccessible = canAccessCourse(video.section.subject, snapshot);
  const previewAllowed =
    video.section.subject.accessType !== "free" &&
    orderedVideos.findIndex((item) => item.id === video.id) < video.section.subject.previewLessonsCount;

  return {
    videoId: video.id,
    subjectId: video.section.subject.id,
    access: fullyAccessible || previewAllowed ? "granted" : "locked",
    accessType: fullyAccessible
      ? "full"
      : previewAllowed
        ? "preview"
        : video.section.subject.accessType === "subscription"
          ? "subscription_locked"
          : video.section.subject.accessType === "paid"
            ? "paid"
            : "free",
    requiresPurchase: video.section.subject.accessType === "paid" && !snapshot.purchased,
    requiresSubscription:
      video.section.subject.accessType === "subscription" && !snapshot.hasActiveSubscription,
    enrolled: snapshot.enrolled
  };
};
