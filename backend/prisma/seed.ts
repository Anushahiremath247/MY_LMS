import { PrismaClient, type Difficulty, type ResourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const exactVideoLinks = [
  "https://www.youtube.com/watch?v=rfscVS0vtbw",
  "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
  "https://www.youtube.com/watch?v=JJmcL1N2KQs",
  "https://www.youtube.com/watch?v=Z1RJmh_OqeA",
  "https://www.youtube.com/watch?v=F5mRW0jo-U4",
  "https://www.youtube.com/watch?v=ua-CiDNNj30",
  "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
  "https://www.youtube.com/watch?v=HXV3zeQKqGY",
  "https://www.youtube.com/watch?v=GoXwIVyNvX0",
  "https://www.youtube.com/watch?v=eIrMbAQSU34"
];

const searchLinks = [
  ["Frontend", "https://www.youtube.com/results?search_query=react+js+full+course"],
  ["Frontend", "https://www.youtube.com/results?search_query=next+js+full+course"],
  ["Backend", "https://www.youtube.com/results?search_query=node+js+full+course"],
  ["Backend", "https://www.youtube.com/results?search_query=express+js+tutorial"],
  ["Backend", "https://www.youtube.com/results?search_query=mongodb+full+course"],
  ["Backend", "https://www.youtube.com/results?search_query=sql+full+course"],
  ["Backend", "https://www.youtube.com/results?search_query=postgresql+tutorial"],
  ["Frontend", "https://www.youtube.com/results?search_query=tailwind+css+full+course"],
  ["Frontend", "https://www.youtube.com/results?search_query=typescript+full+course"],
  ["Frontend", "https://www.youtube.com/results?search_query=javascript+full+course"],
  ["Cloud", "https://www.youtube.com/results?search_query=aws+cloud+full+course"],
  ["Cloud", "https://www.youtube.com/results?search_query=devops+full+course"],
  ["Cloud", "https://www.youtube.com/results?search_query=docker+full+course"],
  ["Cloud", "https://www.youtube.com/results?search_query=kubernetes+course"],
  ["Cloud", "https://www.youtube.com/results?search_query=git+github+full+course"],
  ["AI / ML", "https://www.youtube.com/results?search_query=ai+full+course"],
  ["AI / ML", "https://www.youtube.com/results?search_query=machine+learning+projects"],
  ["AI / ML", "https://www.youtube.com/results?search_query=deep+learning+projects"],
  ["AI / ML", "https://www.youtube.com/results?search_query=langchain+tutorial"],
  ["Mobile Dev", "https://www.youtube.com/results?search_query=flutter+full+course"],
  ["Mobile Dev", "https://www.youtube.com/results?search_query=react+native+course"],
  ["Security", "https://www.youtube.com/results?search_query=cyber+security+full+course"],
  ["Security", "https://www.youtube.com/results?search_query=ethical+hacking+course"],
  ["DSA", "https://www.youtube.com/results?search_query=dsa+full+course"],
  ["DSA", "https://www.youtube.com/results?search_query=data+structures+algorithms"],
  ["UI/UX", "https://www.youtube.com/results?search_query=figma+full+course"],
  ["UI/UX", "https://www.youtube.com/results?search_query=ui+ux+design+course"],
  ["Game Dev", "https://www.youtube.com/results?search_query=unity+game+development"],
  ["Game Dev", "https://www.youtube.com/results?search_query=unreal+engine+course"]
] as const;

const subjects = [
  {
    slug: "python-mastery",
    title: "Python Mastery Blueprint",
    shortDescription: "Build strong Python fundamentals with structured video lessons.",
    description:
      "A clear beginner-to-intermediate path covering Python syntax, problem solving, and project-thinking with a calm modern learning flow.",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    instructor: "Dr. Mira Lawson",
    duration: "14h 30m",
    rating: 4.9,
    category: "Programming",
    lessonsCount: 5,
    sections: [
      {
        title: "Python Basics",
        orderIndex: 1,
        videos: [
          ["Introduction", "Understand the Python ecosystem and setup.", "rfscVS0vtbw"],
          ["Variables", "Learn how state and assignment work.", "_uQrJ0TkZlc"],
          ["Data Types", "Work with lists, strings, numbers, and dictionaries.", "JJmcL1N2KQs"]
        ]
      },
      {
        title: "Problem Solving",
        orderIndex: 2,
        videos: [
          ["Conditionals and Loops", "Control flow and iteration essentials.", "Z1RJmh_OqeA"],
          ["Functions", "Write reusable blocks and cleaner logic.", "F5mRW0jo-U4"]
        ]
      }
    ]
  },
  {
    slug: "next-launchpad",
    title: "Next.js Launchpad",
    shortDescription: "Ship modern web apps with App Router, layouts, and server thinking.",
    description:
      "A polished path through Next.js 14 fundamentals, routing patterns, server rendering, and frontend architecture.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    instructor: "Jordan Pike",
    duration: "10h 10m",
    rating: 4.8,
    category: "Frontend",
    lessonsCount: 3,
    sections: [
      {
        title: "App Router Foundations",
        orderIndex: 1,
        videos: [
          ["Layouts and Routing", "Understand nested layouts and route groups.", "ua-CiDNNj30"],
          ["Data Fetching", "Blend server data with a clean UI architecture.", "GwIo3gDZCVQ"],
          ["Styling with Tailwind", "Build a polished design system fast.", "HXV3zeQKqGY"]
        ]
      }
    ]
  },
  {
    slug: "backend-systems",
    title: "Backend Systems Track",
    shortDescription: "Learn APIs, services, databases, and scalable backend structure.",
    description:
      "Explore service design, database thinking, API ergonomics, and practical backend architecture for product teams.",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    instructor: "Nadia Cruz",
    duration: "9h 45m",
    rating: 4.7,
    category: "Backend",
    lessonsCount: 2,
    sections: [
      {
        title: "Service Architecture",
        orderIndex: 1,
        videos: [
          ["Intro to Backend Thinking", "Learn the shape of scalable backend design.", "GoXwIVyNvX0"],
          ["SQL and Data Models", "Turn product ideas into clean relational models.", "eIrMbAQSU34"]
        ]
      }
    ]
  }
];

const parseYoutubeId = (url: string) => new URL(url).searchParams.get("v") ?? url;

const generatedResourceBuckets = [
  { category: "Frontend", queries: ["react project build", "next js dashboard", "tailwind css portfolio", "typescript interview prep"] },
  { category: "Backend", queries: ["express api tutorial", "node authentication project", "postgres schema design", "prisma crash course"] },
  { category: "AI / ML", queries: ["llm app tutorial", "rag system tutorial", "prompt engineering crash course", "mlops beginner guide"] },
  { category: "Cloud", queries: ["aws deployment tutorial", "docker compose full course", "kubernetes roadmap", "ci cd pipeline project"] },
  { category: "Mobile Dev", queries: ["flutter ui build", "react native app full tutorial", "expo routing guide", "mobile state management"] },
  { category: "Security", queries: ["web security basics", "jwt authentication guide", "ethical hacking roadmap", "owasp top 10 explained"] },
  { category: "DSA", queries: ["leetcode patterns", "graphs tutorial", "dynamic programming full course", "system design interview"] },
  { category: "UI/UX", queries: ["figma case study", "design systems tutorial", "mobile ux principles", "ui audit walkthrough"] },
  { category: "Game Dev", queries: ["unity 2d platformer", "unreal blueprint tutorial", "game dev roadmap", "shader basics tutorial"] }
];

const buildGeneratedResources = () => {
  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];
  const items: Array<{
    title: string;
    category: string;
    youtubeUrl: string;
    type: ResourceType;
    difficulty: Difficulty;
  }> = [];

  generatedResourceBuckets.forEach((bucket, bucketIndex) => {
    bucket.queries.forEach((query, queryIndex) => {
      for (let series = 1; series <= 6; series += 1) {
        items.push({
          title: `${bucket.category} Resource Pack ${series}: ${query}`,
          category: bucket.category,
          youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} ${series}`)}`,
          type: "search",
          difficulty: difficulties[(bucketIndex + queryIndex + series) % difficulties.length]
        });
      }
    });
  });

  return items;
};

async function main() {
  await prisma.videoProgress.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.video.deleteMany();
  await prisma.section.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.user.deleteMany();

  const demoUser = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav@example.com",
      passwordHash: await bcrypt.hash("password123", 10),
      avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=LazyLearning"
    }
  });

  for (const subject of subjects) {
    await prisma.subject.create({
      data: {
        slug: subject.slug,
        title: subject.title,
        shortDescription: subject.shortDescription,
        description: subject.description,
        thumbnail: subject.thumbnail,
        instructor: subject.instructor,
        duration: subject.duration,
        rating: subject.rating,
        category: subject.category,
        lessonsCount: subject.lessonsCount,
        sections: {
          create: subject.sections.map((section) => ({
            title: section.title,
            orderIndex: section.orderIndex,
            videos: {
              create: section.videos.map(([title, description, youtubeId], index) => ({
                title,
                description,
                youtubeId,
                durationSeconds: 900 + index * 120,
                orderIndex: index + 1
              }))
            }
          }))
        }
      }
    });
  }

  const allSubjects = await prisma.subject.findMany({
    include: {
      sections: {
        include: {
          videos: true
        }
      }
    }
  });

  for (const subject of allSubjects.slice(0, 2)) {
    await prisma.enrollment.create({
      data: {
        userId: demoUser.id,
        subjectId: subject.id
      }
    });

    const firstTwoVideos = subject.sections.flatMap((section) => section.videos).slice(0, 2);
    for (const video of firstTwoVideos) {
      await prisma.videoProgress.create({
        data: {
          userId: demoUser.id,
          videoId: video.id,
          isCompleted: true,
          completedAt: new Date(),
          lastPositionSeconds: video.durationSeconds
        }
      });
    }
  }

  const mandatoryResources = [
    ...exactVideoLinks.map((url, index) => ({
      title: `Featured Video Resource ${index + 1}`,
      category: index < 5 ? "Programming" : "Full Stack",
      youtubeUrl: url,
      type: "video" as ResourceType,
      difficulty: (index < 4 ? "beginner" : index < 7 ? "intermediate" : "advanced") as Difficulty
    })),
    ...searchLinks.map(([category, url], index) => ({
      title: `${category} Search Resource ${index + 1}`,
      category,
      youtubeUrl: url,
      type: "search" as ResourceType,
      difficulty: (index % 3 === 0 ? "beginner" : index % 3 === 1 ? "intermediate" : "advanced") as Difficulty
    }))
  ];

  const expandedResources = buildGeneratedResources();

  await prisma.learningResource.createMany({
    data: [...mandatoryResources, ...expandedResources],
    skipDuplicates: true
  });

  const totalResources = await prisma.learningResource.count();

  console.log(
    JSON.stringify(
      {
        seeded: true,
        subjects: allSubjects.length,
        exactVideoLinks: exactVideoLinks.map(parseYoutubeId),
        totalResources
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
