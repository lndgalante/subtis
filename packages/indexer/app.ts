import fs from 'node:fs';
import path from 'node:path';
import delay from 'delay';
import sound from 'sound-play';
import { rimraf } from 'rimraf';
import download from 'download';
import extract from 'extract-zip';
import { match } from 'ts-pattern';
import unrar from '@continuata/unrar';
import invariant from 'tiny-invariant';
// import { confirm } from '@clack/prompts';

// internals
import { getImdbLink } from './imdb';
import { getSubDivXSubtitle } from './subdivx';
// import { getArgenteamSubtitle } from './argenteam';
// import { getOpenSubtitlesSubtitle } from './opensubtitles';
import { getRandomDelay, getFileNameHash, safeParseTorrent } from './utils';
import { type YtsMxMovieList, getYtsMxMovieList, getYtsMxTotalMoviesAndPages } from './yts-mx';
import { type ReleaseGroupMap, type ReleaseGroupNames, getReleaseGroups } from './release-groups';
import { type SubtitleGroupMap, type SubtitleGroupNames, getSubtitleGroups } from './subtitle-groups';

// db
import { supabase } from 'db';

// shared
import { VIDEO_FILE_EXTENSIONS, getMovieFileNameExtension, getMovieData } from 'shared/movie';

// utils
async function setMovieSubtitlesToDatabase({
  subtitle,
  movie,
  fileName,
  resolution,
  fileNameHash,
  fileNameExtension,
  releaseGroup,
  subtitleGroup,
  releaseGroups,
  subtitleGroups,
}: {
  subtitle: {
    subtitleLink: string;
    subtitleSrtFileName: string;
    subtitleCompressedFileName: string;
    subtitleFileNameWithoutExtension: string;
    fileExtension: 'rar' | 'zip' | 'srt';
  };
  movie: {
    id: number;
    name: string;
    year: number;
    rating: number;
  };
  fileName: string;
  resolution: string;
  fileNameHash: string;
  fileNameExtension: string;
  releaseGroup: ReleaseGroupNames;
  subtitleGroup: SubtitleGroupNames;
  releaseGroups: ReleaseGroupMap;
  subtitleGroups: SubtitleGroupMap;
}): Promise<void> {
  const {
    subtitleLink,
    subtitleSrtFileName,
    subtitleCompressedFileName,
    subtitleFileNameWithoutExtension,
    fileExtension,
  } = subtitle;

  // 1. Download subtitle to fs
  const subtitlesFolderAbsolutePath = path.join(__dirname, '..', 'indexer', 'subtitles');
  await download(subtitleLink, subtitlesFolderAbsolutePath, {
    filename: subtitleCompressedFileName,
  });

  // 2. Create path to downloaded subtitles
  const subtitleAbsolutePath = path.join(__dirname, '..', 'indexer', 'subtitles', subtitleCompressedFileName);

  // 3. Create path to extracted subtitles
  const extractedSubtitlePath = path.join(__dirname, '..', 'indexer', 'subs', subtitleFileNameWithoutExtension);

  // 4. Handle compressed zip/rar files
  await match(fileExtension)
    .with('rar', async () => {
      fs.mkdir(extractedSubtitlePath, { recursive: true }, (_error) => null);

      await unrar.uncompress({
        command: 'e',
        switches: ['-o+', '-idcd'],
        src: subtitleAbsolutePath,
        dest: extractedSubtitlePath,
      });
    })
    .with('zip', async () => {
      await extract(subtitleAbsolutePath, { dir: extractedSubtitlePath });
    })
    .with('srt', async () => {
      await download(subtitleLink, 'subs', {
        filename: subtitleSrtFileName,
      });
    })
    .exhaustive();

  let srtFileToUpload;

  if (['zip', 'rar'].includes(fileExtension)) {
    const extractedSubtitleFiles = fs.readdirSync(extractedSubtitlePath);

    const srtFile = extractedSubtitleFiles.find((file) => path.extname(file).toLowerCase() === '.srt');
    invariant(srtFile, 'SRT file not found');

    const extractedSrtFileNamePath = path.join(
      __dirname,
      '..',
      'indexer',
      'subs',
      subtitleFileNameWithoutExtension,
      srtFile,
    );

    srtFileToUpload = fs.readFileSync(extractedSrtFileNamePath);
  }

  if (fileExtension === 'srt') {
    const srtFileNamePath = path.join(__dirname, '..', 'indexer', 'subs', subtitleSrtFileName);
    srtFileToUpload = fs.readFileSync(srtFileNamePath);
  }

  // 10. Upload SRT file to Supabase storage
  await supabase.storage.from('subtitles').upload(subtitleSrtFileName, srtFileToUpload as Buffer);

  // 11. Remove files and folders from fs to avoid collition with others subtitle groups
  await rimraf([subtitleAbsolutePath, extractedSubtitlePath]);

  // 12. Save SRT to Supabase and get public URL for SRT file
  const {
    data: { publicUrl },
  } = await supabase.storage.from('subtitles').getPublicUrl(subtitleSrtFileName, { download: true });

  // 13. Get movie by ID
  const { data: movieData } = await supabase.from('Movies').select('*').eq('id', movie.id);
  invariant(movieData, 'Movie not found');

  // 14. Save movie to Supabase if is not yet saved
  if (Array.isArray(movieData) && !movieData.length) {
    await supabase.from('Movies').insert(movie).select();
  }

  // 15. Get release and subtitle group id
  const { id: releaseGroupId } = releaseGroups[releaseGroup];
  const { id: subtitleGroupId } = subtitleGroups[subtitleGroup];

  // 16. Save subtitle to Supabase
  await supabase.from('Subtitles').insert({
    resolution,
    releaseGroupId,
    subtitleGroupId,
    movieId: movie.id,
    subtitleLink: publicUrl,
    fileName,
    fileNameHash,
    fileExtension: fileNameExtension,
  });

  // 17. Short Subtitle link (ONLY USED FOR DEVELOPMENT)
  // const subtitleShortLink = process.env. await turl.shorten(publicUrl);

  // play sound when a subtitle was found
  console.log('Subtitle found, and saved to DB and Storage! 🎉');

  const successSoundPath = path.join(__dirname, '..', 'indexer', 'success_short_high.wav');
  sound.play(successSoundPath);

  // TODO: Move to console.table when is supported in Bun
  console.log(
    {
      movie,
      resolution,
      releaseGroup,
      subtitleGroup,
      imdbLink: getImdbLink(movie.id),
      subtitleLink: `${subtitleLink.slice(0, 100)}...`,
    },
    '\n-----------------------------',
  );
}

async function getMovieListFromDb(
  movie: YtsMxMovieList,
  releaseGroups: ReleaseGroupMap,
  subtitleGroups: SubtitleGroupMap,
): Promise<void> {
  const { title, rating, year, torrents, imdbId } = movie;

  for await (const torrent of torrents) {
    const { url, hash } = torrent;

    // 1. Download torrent
    const torrentFilename = hash;
    const torrentFolderPath = path.join(__dirname, '..', 'indexer', 'torrents');
    await download(url, torrentFolderPath, { filename: torrentFilename });

    // 2. Read torrent file
    const torrentPath = path.join(__dirname, '..', 'indexer', 'torrents', torrentFilename);
    const torrentFile = fs.readFileSync(torrentPath);
    const { files } = safeParseTorrent(torrentFile);

    // 3. Remove torrent from fs
    await rimraf(torrentPath);

    // 3. Find video file
    const videoFile = files.find((file) => {
      return VIDEO_FILE_EXTENSIONS.some((videoFileExtension) => {
        return file.name.endsWith(videoFileExtension);
      });
    });

    // 4. Return if no video file
    if (!videoFile) continue;

    // 5. Get movie data from video file name
    const fileName = videoFile.name;
    const fileNameExtension = getMovieFileNameExtension(fileName);

    const movieData = getMovieData(fileName);
    const { resolution, releaseGroup } = movieData;

    // 6. Hash video file name
    const fileNameHash = getFileNameHash(fileName);

    // 7. Find subtitle metadata from SubDivx and Argenteam
    const subtitles = await Promise.allSettled([
      getSubDivXSubtitle(movieData),
      // getArgenteamSubtitle(movieData, imdbId),
      // getOpenSubtitlesSubtitle(movieData, imdbId),
    ]);

    // 8. Filter fulfilled only promises
    const resolvedSubtitles = subtitles.filter(
      (subtitle) => subtitle.status === 'fulfilled',
    ) as PromiseFulfilledResult<{
      subtitleLink: string;
      subtitleGroup: SubtitleGroupNames;
      subtitleSrtFileName: string;
      subtitleCompressedFileName: string;
      subtitleFileNameWithoutExtension: string;
      fileExtension: 'zip' | 'rar';
    }>[];

    // 9. Save whole subtitles data to DB
    resolvedSubtitles.forEach(({ value: subtitle }) => {
      const { subtitleGroup } = subtitle;

      setMovieSubtitlesToDatabase({
        subtitle,
        subtitleGroup,
        movie: {
          year,
          rating,
          id: imdbId,
          name: title,
        },
        resolution,
        fileName,
        fileNameHash,
        fileNameExtension,
        releaseGroup,
        releaseGroups,
        subtitleGroups,
      });
    });
  }
}

async function indexYtsMxMoviesSubtitles(
  releaseGroups: ReleaseGroupMap,
  subtitleGroups: SubtitleGroupMap,
): Promise<void> {
  console.log('ABOUT TO INDEX ALL MOVIES SUBTITLES FROM YTS-MX 🚀');

  // 1. Get total YTS-MX pages
  const { totalPagesArray } = await getYtsMxTotalMoviesAndPages(5);

  // 2. Await for each page to get movies
  for await (const page of totalPagesArray) {
    console.log(`Getting movies for page ${page} 🚨`);

    // 3. Get all the movies (50) for this page
    const movieList = await getYtsMxMovieList(page, 5);

    // 4. Filter movies from movie list which already exists in DB
    const movieListIds = movieList.map(({ imdbId }) => imdbId);

    const { data: moviesFromDb } = await supabase.from('Movies').select('*').in('id', movieListIds);

    const moviesIdsFromDb = (moviesFromDb ?? []).map(({ id }) => id);
    const movieListNotInDb = movieList.filter(({ imdbId }) => !moviesIdsFromDb.includes(imdbId));

    // TODO: FOR AWAIT OR PROMISE.ALL SEEMS NOT TO BE WORKING CORRECTLY IN process

    // 5. Run all 50 movies in parallels to get their subtitle and save them to DB and Storage
    // const movieListPromises = movieListNotInDb.map((movie) => getMovieListFromDb(movie, releaseGroups, subtitleGroups));
    // const movies = await Promise.all(movieListPromises);
    // console.log('\n ~ movies:', movies);

    // 6. Optional: or one by one just for testing purposess
    for (const movie of movieListNotInDb) {
      console.log(`Finding subtitle for : ${movie.title} (${movie.year})`);

      getMovieListFromDb(movie, releaseGroups, subtitleGroups);

      // const shouldContinue = await confirm({
      //   message: 'Do you want to continue?',
      // });

      // if (!shouldContinue) break;
    }

    console.log(`Finished movies from page ${page} 🥇`);

    // 6. Generate random delays between 4 and 6 seconds
    const { seconds, miliseconds } = getRandomDelay(10, 10);
    console.log(`Delaying next iteration by ${seconds}s to avoid get blocked`);

    // 7. Delay next iteration
    await delay(miliseconds);

    console.log('-------------------------------\n\n\n');
  }

  console.log('All movies saved to DB and Storage! 🎉');
}

// core
async function mainIndexer(): Promise<void> {
  try {
    // 1. Get release and subtitle groups from DB
    const releaseGroups = await getReleaseGroups(supabase);
    const subtitleGroups = await getSubtitleGroups(supabase);

    // 2. Run YTS-MX indexer
    await indexYtsMxMoviesSubtitles(releaseGroups, subtitleGroups);
  } catch (error) {
    console.log('\n ~ mainIndexer ~ error:', error);
  }
}

mainIndexer();