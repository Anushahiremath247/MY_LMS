import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";

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

