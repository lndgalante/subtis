import invariant from "tiny-invariant";
import { match } from "ts-pattern";
import { z } from "zod";

const ARGENTEAM_BASE_URL = "http://argenteam.net/api/v1" as const;

const argenteamApiEndpoints = {
  search: (query: string) => {
    return `${ARGENTEAM_BASE_URL}/search?q=${query}`;
  },
  tvShow: (id: number) => {
    return `${ARGENTEAM_BASE_URL}/tvshow?id=${id}`;
  },
  episode: (id: number) => {
    return `${ARGENTEAM_BASE_URL}/episode?id=${id}`;
  },
  movie: (id: number) => {
    return `${ARGENTEAM_BASE_URL}/movie?id=${id}`;
  },
};

const argenteamSearchResultSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  summary: z.string(),
  imdb: z.string(),
  poster: z.string(),
});

const argenteamSearchSchema = z.object({
  results: z.array(argenteamSearchResultSchema),
  total: z.number(),
  offset: z.number(),
});

const argenteamResourceInfoSchema = z.object({
  title: z.string(),
  imdb: z.string(),
  year: z.number(),
  rating: z.number(),
  runtime: z.number(),
  alternativeTitle: z.string(),
  country: z.string(),
  poster: z.string(),
  director: z.string(),
  actors: z.string(),
});

const argenteamResourceSubtitlesSchema = z.object({
  uri: z.string(),
  count: z.number(),
});

const argenteamResourceReleaseSchema = z.object({
  source: z.string(),
  codec: z.string(),
  team: z.string(),
  tags: z.string(),
  size: z.string(),
  torrents: z.any(),
  elinks: z.any(),
  subtitles: z.array(argenteamResourceSubtitlesSchema),
});

const argenteamResourceSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  info: argenteamResourceInfoSchema,
  releases: z.array(argenteamResourceReleaseSchema),
});

export async function getArgenteamSubtitle(
  imdbId: string,
  releaseGroup: string,
  quality: string,
) {
  // 1. Parse imdb id
  const parsedImdbId = imdbId.replace("tt", "");

  // 2. Get argenteam search results
  const argenteamSearchEndpoint = argenteamApiEndpoints.search(parsedImdbId);
  const searchResponse = await fetch(argenteamSearchEndpoint);
  const rawSearchData = await searchResponse.json();

  const { results } = argenteamSearchSchema.parse(rawSearchData);
  invariant(results.length > 0, "There should be at least one result");

  // 3. Get argenteam resource data
  const { id, type } = results[0];

  const argenteamResourceEndpoint = match(type)
    .with("movie", () => argenteamApiEndpoints.movie(id))
    .with("episode", () => argenteamApiEndpoints.episode(id))
    .with("tvshow", () => argenteamApiEndpoints.tvShow(id))
    .otherwise(() => {
      throw new Error(`type ${type} not supported`);
    });

  const resourceResponse = await fetch(argenteamResourceEndpoint);
  const rawResourceData = await resourceResponse.json();

  // 4. Filter releases by release group and quality
  const { releases } = argenteamResourceSchema.parse(rawResourceData);

  // TODO: I think team is translation team and not releated to release group
  const release = releases.find(
    (release) => release.team === releaseGroup && release.tags === quality,
  );
  invariant(release, "Release should exist");

  // 5. Get subtitle link
  const { subtitles } = release;
  invariant(subtitles.length > 0, "There should be at least one subtitle");

  const subtitleLink = subtitles[0].uri;
  return subtitleLink;
}

// getArgenteamSubtitle("tt0439572", "RiGHTNOW", "1080p");