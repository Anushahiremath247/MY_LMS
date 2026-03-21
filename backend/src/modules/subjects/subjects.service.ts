import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";

const buildVideoOrderMap = async (subjectId: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
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
  });

  if (!subject) {
    throw new AppError("Subject not found", StatusCodes.NOT_FOUND);
  }

  const orderedVideos = subject.sections.flatMap((section) => section.videos);

  return { subject, orderedVideos };
};

export const listSubjects = async (userId?: string) => {
  const subjects = await prisma.subject.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      sections: {
        include: { videos: true }
      },
      enrollments: userId ? { where: { userId } } : false
    }
  });

  const progressMap = userId
    ? await prisma.videoProgress.findMany({
        where: { userId }
      })
    : [];

  return subjects.map((subject) => {
    const totalVideos = subject.sections.reduce((sum, section) => sum + section.videos.length, 0);
    const completedVideoIds = new Set(
      progressMap.filter((item) => item.isCompleted).map((item) => item.videoId)
    );
    const completedCount = subject.sections
      .flatMap((section) => section.videos)
      .filter((video) => completedVideoIds.has(video.id)).length;
    const progress = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

    return {
      ...subject,
      progress,
      isEnrolled: Boolean(userId && Array.isArray(subject.enrollments) && subject.enrollments.length)
    };
  });
};

export const getSubjectByIdentifier = async (identifier: string, userId?: string) => {
  const subject = await prisma.subject.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }]
    },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          videos: {
            orderBy: { orderIndex: "asc" }
          }
        }
      },
      enrollments: userId ? { where: { userId } } : false
    }
  });

  if (!subject) {
    throw new AppError("Subject not found", StatusCodes.NOT_FOUND);
  }

  return subject;
};

export const getSubjectTree = async (subjectId: string, userId?: string) => {
  const { subject, orderedVideos } = await buildVideoOrderMap(subjectId);
  const completedVideoIds = userId
    ? new Set(
        (
          await prisma.videoProgress.findMany({
            where: { userId, isCompleted: true }
          })
        ).map((item) => item.videoId)
      )
    : new Set<string>();

  return {
    ...subject,
    sections: subject.sections.map((section) => ({
      ...section,
      videos: section.videos.map((video) => {
        const videoIndex = orderedVideos.findIndex((item) => item.id === video.id);
        const previousVideo = videoIndex > 0 ? orderedVideos[videoIndex - 1] : null;
        const locked = previousVideo ? !completedVideoIds.has(previousVideo.id) : false;

        return {
          ...video,
          locked,
          completed: completedVideoIds.has(video.id),
          previousVideoId: previousVideo?.id ?? null,
          nextVideoId: orderedVideos[videoIndex + 1]?.id ?? null
        };
      })
    }))
  };
};

export const enrollInSubject = async (userId: string, subjectId: string) => {
  await prisma.enrollment.upsert({
    where: {
      userId_subjectId: {
        userId,
        subjectId
      }
    },
    create: { userId, subjectId },
    update: {}
  });

  return { success: true };
};

export const getFirstVideo = async (subjectId: string) => {
  const tree = await getSubjectTree(subjectId);
  const firstVideo = tree.sections.flatMap((section) => section.videos)[0];

  if (!firstVideo) {
    throw new AppError("No videos found for subject", StatusCodes.NOT_FOUND);
  }

  return firstVideo;
};

