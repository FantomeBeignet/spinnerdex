import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */

const prisma = new PrismaClient();

export async function GET({ params }: { params: { board: string } }) {
  const board = params.board.toUpperCase();
  const spinners = await prisma.spinners.findMany({
    where: {
      board: board,
    },
    orderBy: {
      key: "asc",
    },
  });
  await prisma.$disconnect();
  if (spinners.length == 0) {
    throw error(404, "No spinner not found");
  }
  return new Response(JSON.stringify(spinners), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
