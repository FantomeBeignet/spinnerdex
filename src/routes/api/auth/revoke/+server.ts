import { error } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */

import type { RequestEvent } from "@sveltejs/kit";

export async function PATCH(event: RequestEvent) {
  const authRes = await auth(event.request);
  if (authRes.code !== 200) {
    throw error(authRes.code, authRes.message);
  }
  const { role } = authRes;
  if (role !== "ADMIN") {
    throw error(403, "Forbidden");
  }
  const body = await event.request.formData();
  const contributorName = body.get("name")?.toString() ?? "";
  if (contributorName === "") {
    throw error(400, "Missing parameters");
  }
  const prisma = new PrismaClient();
  await prisma.contributor
    .update({
      where: {
        name: contributorName,
      },
      data: {
        role: "BANNED",
      },
    })
    .catch((e) => {
      throw error(500, e.message);
    });
  await prisma.$disconnect();
  return new Response(null, { status: 204 });
}
