import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { TwitterApi } from "twitter-api-v2";

const prisma = new PrismaClient();
const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN!);

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { key: string } }) {
  const key = params.key;
  const spinner = await prisma.spinners
    .findFirst({
      where: {
        key: key,
      },
      select: {
        name: true,
        twitter: true,
        youtube: true,
        board: true,
      },
    })
    .catch((e) => {
      throw error(404, "Spinner not found");
    });
  const twitterUsername = spinner!.twitter?.split("/")[3];
  const twitterData = await twitterClient.v2.userByUsername(twitterUsername!, {
    "user.fields": "profile_image_url",
  });
  const data = {
    spinner: spinner!,
    profilePicture: twitterData.data.profile_image_url,
  };
  return data;
}
