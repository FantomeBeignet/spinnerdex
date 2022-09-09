import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @type {import('./$types').PageLoad} */
export async function load() {
  const data = await prisma.spinner.findMany({
    orderBy: {
      key: "asc",
    },
    select: {
      key: true,
      name: true,
      board: true,
    }
  });
  await prisma.$disconnect();
  return data;
}
