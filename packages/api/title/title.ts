import querystring from "querystring";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import replaceSpecialCharacters from "replace-special-characters";
import { z } from "zod";

// shared
import { type TitleFileNameMetadata, getTitleFileNameMetadata, videoFileNameSchema } from "@subtis/shared";

// db
import { titlesRowSchema } from "@subtis/db/schemas";

// internals
import { youTubeSchema } from "../shared/schemas";
import { getSupabaseClient } from "../shared/supabase";
import type { AppVariables } from "../shared/types";
import { OFFICIAL_SUBTIS_CHANNELS } from "./constants";
import { YOUTUBE_SEARCH_URL, getYoutubeApiKey } from "./youtube";

// schemas
const teaserSchema = titlesRowSchema.pick({ teaser: true });

// core
export const title = new Hono<{ Variables: AppVariables }>().get(
  "/teaser/:fileName",
  zValidator("param", z.object({ fileName: z.string() })),
  async (context) => {
    const { fileName } = context.req.valid("param");

    const videoFileName = videoFileNameSchema.safeParse(fileName);
    if (!videoFileName.success) {
      context.status(415);
      return context.json({ message: videoFileName.error.issues[0].message });
    }

    let titleFileNameMetadata: TitleFileNameMetadata | null = null;
    try {
      titleFileNameMetadata = getTitleFileNameMetadata({ titleFileName: videoFileName.data });
    } catch (error) {
      context.status(415);
      return context.json({ message: "File name is not supported" });
    }

    const { name, year } = titleFileNameMetadata;

    const { data: titleData } = await getSupabaseClient(context)
      .from("Titles")
      .select("teaser")
      .or(`title_name_without_special_chars.ilike.%${name}%`)
      .match({ year })
      .single();

    const { success, data } = teaserSchema.safeParse(titleData);

    if (success) {
      return context.json({
        name,
        year,
        url: data.teaser,
      });
    }

    const query = `${name} ${year} teaser`;

    const params = {
      q: query,
      maxResults: 12,
      part: "snippet",
      key: getYoutubeApiKey(context),
    };

    const queryParams = querystring.stringify(params);

    const youtubeResponse = await fetch(`${YOUTUBE_SEARCH_URL}?${queryParams}`);
    const youtubeData = await youtubeResponse.json();

    const parsedData = youTubeSchema.safeParse(youtubeData);

    if (!parsedData.success) {
      context.status(404);
      return context.json({ message: "No teaser found" });
    }
    const filteredTeasers = parsedData.data.items.filter((item) => {
      const youtubeTitle = replaceSpecialCharacters(item.snippet.title.toLowerCase()).replaceAll(":", "");
      return (
        youtubeTitle.includes(name.toLowerCase()) &&
        (youtubeTitle.includes("teaser") || youtubeTitle.includes("trailer"))
      );
    });

    if (filteredTeasers.length === 0) {
      context.status(404);
      return context.json({ message: "No teaser found" });
    }

    const curatedYouTubeTeaser = filteredTeasers.find((item) => {
      return OFFICIAL_SUBTIS_CHANNELS.some((curatedChannelsInLowerCase) =>
        curatedChannelsInLowerCase.ids.includes(item.snippet.channelId.toLowerCase()),
      );
    });

    const youTubeTeaser = curatedYouTubeTeaser ?? filteredTeasers[0];
    const teaser = `https://www.youtube.com/watch?v=${youTubeTeaser?.id.videoId}`;

    return context.json({
      name,
      year,
      url: teaser,
    });
  },
);