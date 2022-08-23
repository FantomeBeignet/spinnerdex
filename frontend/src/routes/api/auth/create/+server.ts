import type { RequestEvent } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

/** @type {import('./$types').RequestHandler} */
export async function POST(event: RequestEvent) {
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
  const contributorId = crypto.randomBytes(8).toString("base64");
  const contributorKey = crypto.randomUUID();
  const contributorKeyHash = await bcrypt.hash(contributorKey, 10);
  const prisma = new PrismaClient();
  await prisma.contributor
    .create({
      data: {
        id: contributorId,
        name: contributorName,
        keyHash: contributorKeyHash,
      },
    })
    .catch((e) => {
      throw error(500, e.message);
    });
  await prisma.$disconnect();
  const apiKey = Buffer.from(`${contributorId}:${contributorKey}`).toString(
    "base64"
  );
  return new Response(JSON.stringify(apiKey), {
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}
