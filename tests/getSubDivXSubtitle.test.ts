import { describe, it } from "vitest";

import { getMovieData } from "../movie";
import { getSubDivXSubtitle } from "../subdivx";

describe("getSubDivXSubtitle", () => {
  it('should return an search params for "Guardians of the Galaxy Vol 3 (2023)" for page 1', async ({
    expect,
  }) => {
    const movieData = getMovieData(
      "Guardians.Of.The.Galaxy.Vol..3.2023.720p.WEBRip.x264.AAC-[YTS.MX].mp4",
    );
    const subtitle = await getSubDivXSubtitle(movieData);

    expect(subtitle).toEqual({
      subtitleGroup: "SubDivX",
      subtitleLink: "https://subdivx.com/sub9/666540.zip",
      subtitleSrtFileName:
        "guardians-of-the-galaxy-vol-3-720p-yts-mx-subdivx.srt",
      subtitleCompressedFileName:
        "guardians-of-the-galaxy-vol-3-720p-yts-mx-subdivx.zip",
      subtitleFileNameWithoutExtension:
        "guardians-of-the-galaxy-vol-3-720p-yts-mx-subdivx",
      fileExtension: "zip",
    });
  });
});