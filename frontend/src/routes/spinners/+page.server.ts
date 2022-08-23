import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @type {import('./$types').PageLoad} */
export async function load() {
  const data = await prisma.spinner.findMany({
    orderBy: {
      key: "asc",
    },
  });
  await prisma.$disconnect();
  return data;
}
