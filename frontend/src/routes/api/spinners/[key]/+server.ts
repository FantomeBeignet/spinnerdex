import { error, type RequestEvent } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { auth } from "$lib/auth";

/** @type {import('./$types').RequestHandler} */

const prisma = new PrismaClient();

export async function GET({ params }: { params: { key: string } }) {
  const key = params.key;
  const spinner = await prisma.spinner.findFirst({
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

export async function POST(event: RequestEvent) {
  const authRes = await auth(event.request);
  if (authRes.code !== 200) {
    throw error(authRes.code, authRes.message);
  }
  const { userId, role } = authRes;
  if (role === "BANNED") {
    throw error(403, "Forbidden");
  }
  const key = event.params.key;
  const json = await event.request.json();
  const name = json.name ?? "";
  const twitter = json.twitter ?? "";
  const youtube = json.youtube ?? "";
  const board = json.board ?? "";
  if (name === "" || board == "") {
    throw error(400, "Missing parameters");
  }
  const spinner = await prisma.spinner
    .create({
      data: {
        key: key!,
        name: name,
        twitter: twitter,
        youtube: youtube,
        board: board,
        updaterId: userId!,
      },
    })
    .catch((e) => {
      throw error(500, e.message);
    });
  await prisma.$disconnect();
  return new Response("OK", { status: 201 });
}

export async function PATCH(event: RequestEvent) {
  const authRes = await auth(event.request);
  if (authRes.code !== 200) {
    throw error(authRes.code, authRes.message);
  }
  const { userId, role } = authRes;
  if (role === "BANNED") {
    throw error(403, "Forbidden");
  }
  const key = event.params.key;
  const json = await event.request.json();
  const twitter = json.twitter ?? undefined;
  const youtube = json.youtube ?? undefined;
  const board = json.board ?? undefined;
  const spinner = await prisma.spinner
    .update({
      where: {
        key: key,
      },
      data: {
        twitter: twitter,
        youtube: youtube,
        board: board,
        updaterId: userId!,
      },
    })
    .catch((e) => {
      throw error(500, e.message);
    });
  await prisma.$disconnect();
  return new Response(null, { status: 204 });
}
