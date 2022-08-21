import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */

const prisma = new PrismaClient();

export async function GET({ params }: { params: { key: string } }) {
  const key = params.key;
  const spinner = await prisma.spinners.findFirst({
    where: {
      key: key,
    },
    select: {
      name: true,
      twitter: true,
      youtube: true,
      board: true,
    },
  });
  if (spinner === null) {
    throw error(404, "Spinner not found");
  }
  await prisma.$disconnect();
  return new Response(JSON.stringify(spinner), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
