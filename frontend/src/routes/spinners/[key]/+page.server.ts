import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { TwitterApi } from "twitter-api-v2";
import { npm_lifecycle_event } from "$env/static/private";

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
  let profilePicture = "/Spinnerdex.png";
  if (spinner?.twitter != "") {
    const twitterUsername = spinner!.twitter?.split("/")[3];
    const twitterData = await twitterClient.v2.userByUsername(
      twitterUsername!,
      {
        "user.fields": "profile_image_url",
      }
    );
    profilePicture = twitterData.data.profile_image_url!;
  }
  const data = {
    spinner: spinner!,
    profilePicture: profilePicture,
  };
  return data;
}
