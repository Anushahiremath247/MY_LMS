import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient, type CourseAccessType } from "@prisma/client";

type CourseSeed = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  accessType: CourseAccessType;
  price: number;
  listPrice: number;
  previewLessonsCount: number;
  instructor: string;
  duration: string;
  rating: number;
  videoPool: string;
  videoOffset: number;
  videoCount: number;
  sectionTitles: string[];
  subscriptionPlanCode?: string;
};

type VideoSeed = {
  pool: string;
  title: string;
  description: string;
  youtubeUrl: string;
};

type SeedCourseCatalog = Awaited<ReturnType<typeof buildSeedCourseCatalog>>;

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDataDir = path.resolve(currentDir, "..", "..", "frontend", "data");

const extractYoutubeId = (youtubeUrl: string) => {
  try {
    const url = new URL(youtubeUrl);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }

    const watchId = url.searchParams.get("v");
    if (watchId) {
      return watchId;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const shortsIndex = segments.findIndex((segment) => segment === "shorts");
    if (shortsIndex >= 0) {
      return segments[shortsIndex + 1] ?? "";
    }

    return segments[segments.length - 1] ?? "";
  } catch {
    return youtubeUrl;
  }
};

const buildEmbedUrl = (youtubeId: string) => `https://www.youtube.com/embed/${youtubeId}`;
const buildThumbnailUrl = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
const getCourseFallbackThumbnail = (category: string) =>
  (
    {
      Python: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      Java: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      SQL: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      "Web Development":
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      React: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
      "Node.js": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80"
    } as Record<string, string>
  )[category] ?? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

const groupVideosByPool = (videos: VideoSeed[]) =>
  videos.reduce<Record<string, VideoSeed[]>>((accumulator, video) => {
    accumulator[video.pool] ??= [];
    accumulator[video.pool].push(video);
    return accumulator;
  }, {});

const readJsonFile = async <T>(filename: string) => {
  const contents = await fs.readFile(path.join(frontendDataDir, filename), "utf8");
  return JSON.parse(contents) as T;
};

export const loadCourseSeedJson = async () => {
  const [courseSeeds, videoSeeds] = await Promise.all([
    readJsonFile<CourseSeed[]>("seed_courses.json"),
    readJsonFile<VideoSeed[]>("seed_videos.json")
  ]);

  return {
    courseSeeds,
    videoSeeds
  };
};

export const buildSeedCourseCatalog = async () => {
  const { courseSeeds, videoSeeds } = await loadCourseSeedJson();
  const videosByPool = groupVideosByPool(videoSeeds);

  return courseSeeds.map((courseSeed) => {
    const pool = videosByPool[courseSeed.videoPool] ?? [];
    const lessonsPerSection = Math.ceil(courseSeed.videoCount / courseSeed.sectionTitles.length);

    const selectedVideos = Array.from({ length: courseSeed.videoCount }, (_, index) => {
      const source = pool[(courseSeed.videoOffset + index) % pool.length];
      const youtubeId = extractYoutubeId(source.youtubeUrl);
      return {
        title: source.title,
        description: source.description,
        youtubeId,
        youtubeUrl: source.youtubeUrl,
        embedUrl: buildEmbedUrl(youtubeId),
        thumbnailUrl: buildThumbnailUrl(youtubeId),
        durationSeconds: 780 + (index + 1) * 75,
        orderIndex: index + 1
      };
    });

    return {
      ...courseSeed,
      lessonsCount: selectedVideos.length,
      thumbnail: getCourseFallbackThumbnail(courseSeed.category),
      sections: courseSeed.sectionTitles.map((sectionTitle, sectionIndex) => ({
        title: sectionTitle,
        orderIndex: sectionIndex + 1,
        videos: selectedVideos
          .slice(sectionIndex * lessonsPerSection, (sectionIndex + 1) * lessonsPerSection)
          .map((video, lessonIndex) => ({
            ...video,
            orderIndex: lessonIndex + 1,
            isPreview:
              courseSeed.accessType === "free" ? false : video.orderIndex <= courseSeed.previewLessonsCount
          }))
      }))
    };
  });
};

export const syncCourseCatalog = async (prisma: PrismaClient) => {
  const catalog = await buildSeedCourseCatalog();

  for (const course of catalog) {
    const subject = await prisma.subject.upsert({
      where: { slug: course.slug },
      update: {
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        duration: course.duration,
        rating: course.rating,
        category: course.category,
        level: course.level,
        accessType: course.accessType,
        price: course.price,
        listPrice: course.listPrice,
        previewLessonsCount: course.previewLessonsCount,
        subscriptionPlanCode: course.subscriptionPlanCode ?? null,
        lessonsCount: course.lessonsCount,
        published: true
      },
      create: {
        slug: course.slug,
        title: course.title,
        shortDescription: course.shortDescription,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        duration: course.duration,
        rating: course.rating,
        category: course.category,
        level: course.level,
        accessType: course.accessType,
        price: course.price,
        listPrice: course.listPrice,
        previewLessonsCount: course.previewLessonsCount,
        subscriptionPlanCode: course.subscriptionPlanCode ?? null,
        lessonsCount: course.lessonsCount,
        published: true
      }
    });

    await prisma.section.deleteMany({
      where: {
        subjectId: subject.id
      }
    });

    await prisma.subject.update({
      where: { id: subject.id },
      data: {
        sections: {
          create: course.sections.map((section) => ({
            title: section.title,
            orderIndex: section.orderIndex,
            videos: {
              create: section.videos.map((video) => ({
                title: video.title,
                description: video.description,
                youtubeId: video.youtubeId,
                youtubeUrl: video.youtubeUrl,
                embedUrl: video.embedUrl,
                thumbnailUrl: video.thumbnailUrl,
                durationSeconds: video.durationSeconds,
                orderIndex: video.orderIndex,
                isPreview: video.isPreview
              }))
            }
          }))
        }
      }
    });
  }

  return {
    courses: catalog.length,
    videos: catalog.reduce((sum, course) => sum + course.lessonsCount, 0)
  };
};
