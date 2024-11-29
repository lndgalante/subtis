import { confirm } from "@clack/prompts";
import cliProgress from "cli-progress";
import tg from "torrent-grabber";
import TorrentSearchApi from "torrent-search-api";

// db
import { supabase } from "@subtis/db";

// internals
import { getSubtitlesForTitle } from "./app";
import { getReleaseGroups, saveReleaseGroupsToDb } from "./release-groups";
import { getSubDivXParameter, getSubDivXToken } from "./subdivx";
import { getSubtitleGroups } from "./subtitle-groups";
import { getMoviesFromTmdb, getTmdbMovieFromTitle, getTmdbMoviesTotalPagesArray } from "./tmdb";

// core
export async function indexMoviesByYear(year: number, isDebugging: boolean): Promise<void> {
  try {
    await tg.activate("ThePirateBay");
    TorrentSearchApi.enableProvider("1337x");

    const releaseGroups = await getReleaseGroups(supabase);
    const subtitleGroups = await getSubtitleGroups(supabase);

    const parameter = await getSubDivXParameter();
    const { token, cookie } = await getSubDivXToken();

    const { totalPages, totalResults } = await getTmdbMoviesTotalPagesArray(year, isDebugging);
    console.log(`\n1.1) Con un total de ${totalResults} titulos en el año ${year}`);
    console.log(
      `\n1.2) ${totalPages.at(
        -1,
      )} páginas (con ${20} pelis c/u), con un total de ${totalResults} titulos en el año ${year}`,
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

    for await (const tmbdMoviesPage of totalPages) {
      console.log(`\n2) Buscando en página ${tmbdMoviesPage} de TMDB \n`);

      console.log("\nProgreso total del indexador:\n");
      totalMoviesResultBar.update(tmbdMoviesPage);

      const movies = await getMoviesFromTmdb(tmbdMoviesPage, year, isDebugging);
      console.log(`\n\n3) titulos encontradas en página ${tmbdMoviesPage} \n`);

      console.table(movies.map(({ name, year, releaseDate, rating }) => ({ name, year, releaseDate, rating })));
      console.log("\n");

      for await (const [index, movie] of Object.entries(movies)) {
        if (isDebugging) {
          const value = await confirm({
            message: `¿Desea saltar el titulo ${movie.name}?`,
            initialValue: false,
          });

          if (value === true) {
            continue;
          }
        }

        await getSubtitlesForTitle({
          indexedBy: "indexer-cron",
          index,
          currentTitle: { ...movie, episode: null, totalEpisodes: null, totalSeasons: null },
          releaseGroups,
          subtitleGroups,
          isDebugging,
          shouldUseTryCatch: true,
          subdivxToken: token,
          subdivxCookie: cookie,
          subdivxParameter: parameter,
        });
      }
    }
  } catch (error) {
    console.log("mainIndexer => error =>");
    console.log(error);
    console.log("\n ~ mainIndexer ~ error message:", (error as Error).message);

    if (isDebugging) {
      await confirm({ message: "¿Desea continuar? (Revisar el porqué del error primero)", initialValue: true });
    }
  }
}

export async function indexMovieByName({
  name,
  year,
  isDebugging,
}: {
  name: string;
  year?: number;
  isDebugging: boolean;
}) {
  try {
    await tg.activate("ThePirateBay");
    TorrentSearchApi.enableProvider("1337x");

    const releaseGroups = await getReleaseGroups(supabase);
    const subtitleGroups = await getSubtitleGroups(supabase);

    const parameter = await getSubDivXParameter();
    const { token, cookie } = await getSubDivXToken();

    const movie = await getTmdbMovieFromTitle(name, year);

    await getSubtitlesForTitle({
      indexedBy: "indexer-movie",
      index: "1",
      currentTitle: { ...movie, episode: null, totalEpisodes: null, totalSeasons: null },
      releaseGroups,
      subtitleGroups,
      isDebugging,
      shouldUseTryCatch: true,
      subdivxToken: token,
      subdivxCookie: cookie,
      subdivxParameter: parameter,
    });
  } catch (error) {
    console.log("\n ~ indexMovieByName ~ error:", error);
  }
}

// testing
indexMoviesByYear(2020, true);

// indexMovieByName({
//   year: 2005,
//   isDebugging: false,
//   name: "Kingdom of Heaven",
// });

saveReleaseGroupsToDb(supabase);
// saveSubtitleGroupsToDb(supabase);
// saveTmdbMovieGenresToDb(supabase);
