import { prisma } from "../../lib/prisma.js";

export const listResources = async (query: { category?: string; search?: string }) => {
  return prisma.learningResource.findMany({
    where: {
      category: query.category || undefined,
      OR: query.search
        ? [
            {
              title: {
                contains: query.search,
                mode: "insensitive"
              }
            },
            {
              category: {
                contains: query.search,
                mode: "insensitive"
              }
            }
          ]
        : undefined
    },
    orderBy: [{ category: "asc" }, { title: "asc" }]
  });
};

