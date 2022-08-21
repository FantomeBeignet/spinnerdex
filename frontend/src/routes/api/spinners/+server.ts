import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */

const prisma = new PrismaClient();

export async function GET({ url }: { url: URL }) {
  const board = url.searchParams.get("board")?.toString() ?? undefined;
  const spinners = await prisma.spinners.findMany({
    where: {
      board: board,
    },
    orderBy: {
      key: "asc",
    },
  });
  await prisma.$disconnect();
  if (spinners.length === 0) {
    throw error(404, "No spinner found");
  }
  return new Response(JSON.stringify(spinners), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
