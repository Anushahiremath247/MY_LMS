import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";

export const upsertProgress = async (input: {
  userId: string;
  subjectId: string;
  videoId: string;
  lastPositionSeconds: number;
  isCompleted: boolean;
}) => {
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId },
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
  const currentIndex = orderedVideos.findIndex((video) => video.id === input.videoId);

  if (currentIndex === -1) {
    throw new AppError("Video not found in subject", StatusCodes.NOT_FOUND);
  }

  const previousVideo = currentIndex > 0 ? orderedVideos[currentIndex - 1] : null;

  if (previousVideo) {
    const previousProgress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId: input.userId,
          videoId: previousVideo.id
        }
      }
    });

    if (!previousProgress?.isCompleted) {
      throw new AppError("Complete the previous lesson first", StatusCodes.BAD_REQUEST);
    }
  }

  return prisma.videoProgress.upsert({
    where: {
      userId_videoId: {
        userId: input.userId,
        videoId: input.videoId
      }
    },
    create: {
      userId: input.userId,
      videoId: input.videoId,
      lastPositionSeconds: input.lastPositionSeconds,
      isCompleted: input.isCompleted,
      completedAt: input.isCompleted ? new Date() : null
    },
    update: {
      lastPositionSeconds: input.lastPositionSeconds,
      isCompleted: input.isCompleted,
      completedAt: input.isCompleted ? new Date() : null
    }
  });
};

export const getSubjectProgress = async (userId: string, subjectId: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sections: {
        include: { videos: true }
      }
    }
  });

  if (!subject) {
    throw new AppError("Subject not found", StatusCodes.NOT_FOUND);
  }

  const videoIds = subject.sections.flatMap((section) => section.videos.map((video) => video.id));
  const progress = await prisma.videoProgress.findMany({
    where: { userId, videoId: { in: videoIds } }
  });
  const completed = progress.filter((item) => item.isCompleted).length;

  return {
    subjectId,
    completedLessons: completed,
    totalLessons: videoIds.length,
    completionPercentage: videoIds.length ? Math.round((completed / videoIds.length) * 100) : 0,
    items: progress
  };
};

export const getVideoProgress = async (userId: string, videoId: string) => {
  const progress = await prisma.videoProgress.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId
      }
    }
  });

  return progress ?? {
    videoId,
    lastPositionSeconds: 0,
    isCompleted: false
  };
};
