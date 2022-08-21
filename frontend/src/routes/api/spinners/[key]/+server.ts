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

export async function POST({
  params,
  request,
}: {
  params: { key: string };
  request: Request;
}) {
  const key = params.key;
  const body = await request.formData();
  const name = body.get("name")?.toString() ?? "";
  const twitter = body.get("twitter")?.toString() ?? "";
  const youtube = body.get("youtube")?.toString() ?? "";
  const board = body.get("board")?.toString() ?? "";
  if (name === "" || board == "") {
    throw error(400, "Missing parameters");
  }
  const spinner = await prisma.spinners
    .create({
      data: {
        key: key,
        name: name,
        twitter: twitter,
        youtube: youtube,
        board: board,
      },
    })
    .catch((e) => {
      throw error(500, e.message);
    });
  await prisma.$disconnect();
  return new Response(JSON.stringify(spinner), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
