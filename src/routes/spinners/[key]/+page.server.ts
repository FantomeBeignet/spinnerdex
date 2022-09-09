import { error } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import { TwitterApi } from "twitter-api-v2";
import { google } from "googleapis";

const prisma = new PrismaClient();
const twitterClient = new TwitterApi(process.env.TWITTER_TOKEN!);
const youtubeClient = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY!,
});

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { key: string } }) {
  const key = params.key;
  const spinner = await prisma.spinner
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
  var youtubeUsername = "Youtube link";
  var youtubeData = undefined;
  var youtubePfp = undefined;
  if (spinner?.youtube) {
    const linkType = spinner!.youtube?.split("/")[3];
    if (linkType === "channel") {
      const youtubeID = spinner!.youtube?.split("/")[4]!;
      youtubeData = await youtubeClient.channels.list({
        part: ["snippet"],
        id: [youtubeID],
      });
    } else {
      youtubeUsername = spinner!.youtube?.split("/")[4]!;
      youtubeData = await youtubeClient.channels.list({
        part: ["snippet"],
        forUsername: youtubeUsername,
      });
    }
    if (youtubeData?.data?.items) {
      youtubePfp = youtubeData.data.items[0]!.snippet!.thumbnails!.high!.url;
      youtubeUsername = youtubeData.data.items[0]!.snippet!.title!;
    }
  }
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
  if (youtubePfp && spinner?.twitter === "") {
    profilePicture = youtubePfp;
  }
  const data = {
    spinner: spinner!,
    profilePicture: profilePicture,
    youtubeUsername: youtubeUsername,
  };
  return data;
}
