import { prisma } from "../../src/lib/prisma.js";

export async function cleanDatabase() {
  const tablenames = await prisma.$queryRawUnsafe<
    { tablename: string }[]
  >(`
    SELECT tablename FROM pg_tables
    WHERE schemaname='public'
  `);

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
      );
    }
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}
