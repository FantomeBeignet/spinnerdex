import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export async function auth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  let id;
  let key;
  if (authHeader !== null) {
    const [type, value] = authHeader.split(" ");
    if (type === "Basic") {
      [id, key] = Buffer.from(value, "base64").toString().split(":");
    }
  } else if (new URL(request.url).searchParams.has("api_key")) {
    const apiKey = new URL(request.url).searchParams.get("api_key")!.toString();
    [id, key] = Buffer.from(apiKey, "base64").toString().split(":");
  } else {
    return { code: 401, message: "Unauthorized" };
  }
  const prisma = new PrismaClient();
  const contributor = await prisma.contributor.findFirst({
    where: {
      id: id,
    },
    select: {
      keyHash: true,
      role: true,
    },
  });
  if (contributor === null) {
    return { code: 401, message: "Unauthorized" };
  }
  const compare = await bcrypt.compare(key as string, contributor.keyHash);
  if (!compare) {
    return { code: 403, message: "Forbidden" };
  }
  await prisma.$disconnect();
  return { code: 200, message: "OK", userId: id, role: contributor.role };
}
