import { PrismaClient } from "@prisma/client";
import { syncCourseCatalog } from "./course-seed-utils.js";

const prisma = new PrismaClient();

async function main() {
  const result = await syncCourseCatalog(prisma);
  console.log(JSON.stringify({ imported: true, ...result }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
