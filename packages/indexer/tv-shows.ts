import cliProgress from "cli-progress";
import tg from "torrent-grabber";

import { supabase } from "@subtis/db";

import { getSubtitlesForTitle } from "./app";
import { getReleaseGroups, saveReleaseGroupsToDb } from "./release-groups";
import { getSubtitleGroups, saveSubtitleGroupsToDb } from "./subtitle-groups";
import { getTmdbTvShowsTotalPagesArray, getTvShowsFromTmdb } from "./tmdb";

// core
export async function indexSeriesByYear(seriesYear: number, isDebugging: boolean): Promise<void> {
  await tg.activate("ThePirateBay");

  const releaseGroups = await getReleaseGroups(supabase);
  const subtitleGroups = await getSubtitleGroups(supabase);

  const { totalPages, totalResults } = await getTmdbTvShowsTotalPagesArray(seriesYear);
  console.log(`\n1.1) Con un total de ${totalResults} series en el año ${seriesYear}`);
  console.log(
    `\n1.2) ${totalPages.at(
      -1,
    )} páginas (con ${20} pelis c/u), con un total de ${totalResults} titulos en el año ${seriesYear}`,
    "\n",
  );

  const totalMoviesResultBar = new cliProgress.SingleBar(
    {
      format: "[{bar}] {percentage}% | Procesando {value}/{total} páginas de TMDB",
    },
    cliProgress.Presets.shades_classic,
  );
  totalMoviesResultBar.start(totalPages.length, 0);
  console.log("\n");

  for await (const tmbdSeriesPage of totalPages) {
    console.log(`\n2) Buscando en página ${tmbdSeriesPage} de TMDB \n`);

    console.log("\nProgreso total del indexador:\n");
    totalMoviesResultBar.update(tmbdSeriesPage);

    const tvShows = await getTvShowsFromTmdb(tmbdSeriesPage, seriesYear);

    console.log(`\n\n3) titulos encontradas en página ${tmbdSeriesPage} \n`);
    console.table(
      tvShows.map(({ name, year, releaseDate, rating, episodes, totalSeasons, totalEpisodes }) => ({
        name,
        year,
        releaseDate,
        rating,
        episodes,
        totalSeasons,
        totalEpisodes,
      })),
    );
    console.log("\n");

    for await (const [index, tvShow] of Object.entries(tvShows)) {
      if (index === "0") {
        continue;
      }

      if (isDebugging) {
        const value = await confirm(`¿Desea skippear el titulo ${tvShow.name}?`);

        if (value === true) {
          continue;
        }
      }

      for await (const episode of tvShow.episodes) {
        try {
          await getSubtitlesForTitle({
            index,
            currentTitle: { ...tvShow, episode },
            releaseGroups,
            subtitleGroups,
            isDebugging,
          });
        } catch (error) {
          console.log("mainIndexer => getSubtitlesForTvShow error =>", error);
          console.error("Ningún subtítulo encontrado para la serie", tvShow.name);
        }
      }
    }
  }
}

// GENERAL
saveReleaseGroupsToDb(supabase);
saveSubtitleGroupsToDb(supabase);

// SERIES
indexSeriesByYear(2024, false);