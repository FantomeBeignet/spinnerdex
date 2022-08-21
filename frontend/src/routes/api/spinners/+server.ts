import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */

const prisma = new PrismaClient();

export async function GET() {
  const spinners = await prisma.spinners.findMany({});
  await prisma.$disconnect();
  return new Response(JSON.stringify(spinners), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
