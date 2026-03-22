import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/app-error.js";

type ListSubjectsOptions = {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  accessType?: "free" | "paid" | "subscription";
  enrolledOnly?: boolean;
};

type SubjectListResponse = {
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    instructor: string;
    duration: string;
    rating: number;
    category: string;
    level: string;
    accessType: string;
    price: number;
    listPrice: number;
    previewLessonsCount: number;
    subscriptionPlanCode: string | null;
    lessonsCount: number;
    progress: number;
    isEnrolled: boolean;
  }>;
  total: number;
  hasMore: boolean;
  nextPage: number | null;
  page: number;
  limit: number;
  categories: string[];
  summary: {
    totalCourses: number;
    enrolledCourses: number;
    totalLessons: number;
    freeCourses: number;
    paidCourses: number;
    subscriptionCourses: number;
  };
};

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;
const EMPTY_SUBJECT_ID = "__no-subject__";
const PUBLIC_CACHE_TTL_MS = 60_000;

const publicListCache = new Map<string, { expiresAt: number; value: SubjectListResponse }>();
let categoryCache: { expiresAt: number; value: string[] } | null = null;

const normalizePagination = (page = 1, limit = DEFAULT_LIMIT) => {
  const normalizedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const normalizedLimit = Number.isFinite(limit) ? Math.trunc(limit) : DEFAULT_LIMIT;

  return {
    page: Math.max(1, normalizedPage),
    limit: Math.min(MAX_LIMIT, Math.max(1, normalizedLimit))
  };
};

const buildSubjectWhere = ({
  category,
  accessType,
  search,
  userId,
  enrolledOnly
}: ListSubjectsOptions): Prisma.SubjectWhereInput => ({
  published: true,
  ...(category ? { category } : {}),
  ...(accessType ? { accessType } : {}),
  ...(search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDescription: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { instructor: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } }
        ]
      }
    : {}),
  ...(enrolledOnly
    ? userId
      ? { enrollments: { some: { userId } } }
      : { id: { equals: EMPTY_SUBJECT_ID } }
    : {})
});

const getPublicCacheKey = ({ page, limit, category, search, accessType }: ListSubjectsOptions) =>
  JSON.stringify({
    page,
    limit,
    category: category ?? "",
    search: search?.trim().toLowerCase() ?? "",
    accessType: accessType ?? ""
  });

const getSubjectCategories = async () => {
  if (categoryCache && categoryCache.expiresAt > Date.now()) {
    return categoryCache.value;
  }

  const categories = (
    await prisma.subject.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" }
    })
  ).map((item) => item.category);

  categoryCache = {
    value: categories,
    expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS
  };

  return categories;
};

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

export const listSubjects = async ({
  userId,
  page = 1,
  limit = DEFAULT_LIMIT,
  search,
  category,
  accessType,
  enrolledOnly
}: ListSubjectsOptions = {}) => {
  const normalizedSearch = search?.trim();
  const pagination = normalizePagination(page, limit);
  const where = buildSubjectWhere({
    userId,
    category,
    accessType,
    search: normalizedSearch,
    enrolledOnly
  });
  const shouldUsePublicCache = !userId;
  const publicCacheKey = shouldUsePublicCache
    ? getPublicCacheKey({
        page: pagination.page,
        limit: pagination.limit,
        category,
        search: normalizedSearch,
        accessType
      })
    : null;

  if (publicCacheKey) {
    const cachedEntry = publicListCache.get(publicCacheKey);

    if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
      return cachedEntry.value;
    }
  }

  const [categories, subjects, total, aggregate, freeCourses, paidCourses, subscriptionCourses] = await Promise.all([
    getSubjectCategories(),
    prisma.subject.findMany({
      where,
      orderBy: [{ createdAt: "asc" }, { title: "asc" }],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        shortDescription: true,
        thumbnail: true,
        instructor: true,
        duration: true,
        rating: true,
        category: true,
        level: true,
        accessType: true,
        price: true,
        listPrice: true,
        previewLessonsCount: true,
        subscriptionPlanCode: true,
        lessonsCount: true
      }
    }),
    prisma.subject.count({ where }),
    prisma.subject.aggregate({
      where,
      _sum: {
        lessonsCount: true
      }
    }),
    prisma.subject.count({ where: { ...where, accessType: "free" } }),
    prisma.subject.count({ where: { ...where, accessType: "paid" } }),
    prisma.subject.count({ where: { ...where, accessType: "subscription" } })
  ]);

  const subjectIds = subjects.map((subject) => subject.id);
  const [enrollments, completedProgressRows, enrolledCount] = await Promise.all([
    userId && subjectIds.length
      ? prisma.enrollment.findMany({
          where: {
            userId,
            subjectId: {
              in: subjectIds
            }
          },
          select: { subjectId: true }
        })
      : Promise.resolve([] as Array<{ subjectId: string }>),
    userId && subjectIds.length
      ? prisma.videoProgress.findMany({
          where: {
            userId,
            isCompleted: true,
            video: {
              section: {
                subjectId: {
                  in: subjectIds
                }
              }
            }
          },
          select: {
            video: {
              select: {
                section: {
                  select: {
                    subjectId: true
                  }
                }
              }
            }
          }
        })
      : Promise.resolve([] as Array<{ video: { section: { subjectId: string } } }>),
    userId
      ? prisma.subject.count({
          where: {
            ...where,
            enrollments: {
              some: { userId }
            }
          }
        })
      : Promise.resolve(0)
  ]);

  const enrolledSubjectIds = new Set(enrollments.map((enrollment) => enrollment.subjectId));
  const completedLessonsBySubject = completedProgressRows.reduce<Record<string, number>>((accumulator, item) => {
    const progressSubjectId = item.video.section.subjectId;
    accumulator[progressSubjectId] = (accumulator[progressSubjectId] ?? 0) + 1;
    return accumulator;
  }, {});

  const response: SubjectListResponse = {
    courses: subjects.map((subject) => {
      const completedLessons = completedLessonsBySubject[subject.id] ?? 0;
      const progress =
        subject.lessonsCount > 0 ? Math.round((completedLessons / subject.lessonsCount) * 100) : 0;

      return {
        ...subject,
        progress,
        isEnrolled: enrolledSubjectIds.has(subject.id)
      };
    }),
    total,
    hasMore: pagination.page * pagination.limit < total,
    nextPage: pagination.page * pagination.limit < total ? pagination.page + 1 : null,
    page: pagination.page,
    limit: pagination.limit,
    categories,
    summary: {
      totalCourses: total,
      enrolledCourses: enrolledCount,
      totalLessons: aggregate._sum.lessonsCount ?? 0,
      freeCourses,
      paidCourses,
      subscriptionCourses
    }
  };

  if (publicCacheKey) {
    publicListCache.set(publicCacheKey, {
      value: response,
      expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS
    });
  }

  return response;
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
