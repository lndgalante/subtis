import { z } from 'zod';
import minimist from 'minimist';
import invariant from 'tiny-invariant';
import { intro, outro, spinner } from '@clack/prompts';

// shared
import { getSubtitleLink } from 'shared/api';
import { getIsInvariantError, getParsedInvariantMessage } from 'shared/invariant';
import { getFilenameFromPath, getMovieData, getVideoFileExtension } from 'shared/movie';

// schemas
const cliArgumentsSchema = z.object({ file: z.string() });

// core
async function cli(): Promise<void> {
  // 1. Initialize loader
  const loader = spinner();

  try {
    // 2. Display intro
    intro('➖ Subtis CLI');

    // 3. Get cli arguments
    const cliArguments = minimist(Bun.argv);

    // 4. Parse with zod
    const { file } = cliArgumentsSchema.parse(cliArguments);

    // 5. Sanitize filename
    const fileName = getFilenameFromPath(file);
    invariant(fileName, 'Parámetro --file no provisto. Prueba con "--file [archivo]".');

    // 6. Checks if file is a video
    const videoFileExtension = getVideoFileExtension(fileName);
    invariant(videoFileExtension, 'Extension de video no soportada');

    // 8. Display loader
    loader.start(`🔎 Buscando subtitulos`);

    // 9. Fetch subtitle link from API
    const { data } = await getSubtitleLink(fileName, {
      isProduction: Bun.env.NODE_ENV === 'production',
      apiBaseUrlProduction: Bun.env.PUBLIC_API_BASE_URL_PRODUCTION,
      apiBaseUrlDevelopment: Bun.env.PUBLIC_API_BASE_URL_DEVELOPMENT,
    });

    // 10. Throw error if subtitle not found
    invariant(data !== null && !('message' in data), 'No se encontró ningún subtítulo');

    // 11. Stop loader and display subtitle link
    loader.stop(`🥳 Descarga tu subtítulo del siguiente link: ${data.subtitleLink}`);

    // 12. Get movie data - TODO: Get this from a join query
    const { name } = getMovieData(fileName);

    // 13. Display outro
    outro(`🍿 Disfruta de "${name}" subtitulada!`);
  } catch (error) {
    loader.stop();

    const parsedError = error as Error;
    const isInvariantError = getIsInvariantError(parsedError);

    if (!isInvariantError) {
      return outro(`🔴 ${parsedError.message}`);
    }

    const errorMessage = getParsedInvariantMessage(parsedError);
    outro(`😢 ${errorMessage}`);
  }
}

cli();
