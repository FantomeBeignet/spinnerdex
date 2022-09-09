import { error, type RequestEvent } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET(event: RequestEvent) {
  const board = event.url.searchParams.get("board")?.toString() ?? undefined;
  const spinners = await prisma.spinner.findMany({
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
