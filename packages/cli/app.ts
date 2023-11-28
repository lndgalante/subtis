import { z } from 'zod'
import minimist from 'minimist'
import invariant from 'tiny-invariant'
import { intro, outro, spinner } from '@clack/prompts'

// shared
import { getMessageFromStatusCode } from 'shared/error-messages'
import { getFilenameFromPath, getVideoFileExtension } from 'shared/movie'
import { getIsInvariantError, getParsedInvariantMessage } from 'shared/invariant'

// internals
import { getSubtitleFromFileName } from './api'

// core
async function cli(): Promise<void> {
  // 1. Initialize loader
  const loader = spinner()

  try {
    // 2. Display intro
    intro('🤗 Hola, soy Subtis CLI')

    // 3. Get cli arguments
    const cliArguments = minimist(Bun.argv)

    // 4. Parse with zod
    const cliParse = z.object({ file: z.string() }).safeParse(cliArguments)
    invariant(cliParse.success, '🤔 Parámetro --file no provisto. Prueba con "--file [archivo]".')

    // 5. Sanitize filename
    const fileName = getFilenameFromPath(cliParse.data.file)

    // 6. Checks if file is a video
    const videoFileExtension = getVideoFileExtension(fileName)
    invariant(videoFileExtension, '🤔 Extension de video no soportada. Prueba con otro archivo.')

    // 8. Display loader
    loader.start(`🔎 Buscando subtitulos`)

    // 9. Fetch subtitle link from API
    const { data, status } = await getSubtitleFromFileName(fileName)

    // 10. Display error message if status is not 200
    if (data === null || 'message' in data) {
      const { title, description } = getMessageFromStatusCode(status)
      loader.stop(`😥 ${title}`)
      return outro(`⛏ ${description}`)
    }

    // 11. Stop loader and display subtitle link
    loader.stop(`🥳 Descarga tu subtítulo del siguiente link: ${data.subtitleShortLink}`)

    // 12. Display outro
    outro(`🍿 Disfruta de ${data.Movies?.name} (${data.Movies?.year}) en ${data.resolution} subtitulada`)
  }
  catch (error) {
    const nativeError = error as Error
    const isInvariantError = getIsInvariantError(nativeError)

    if (!isInvariantError) {
      return outro(`🔴 ${nativeError.message}`)
    }

    const errorMessage = getParsedInvariantMessage(nativeError)
    outro(errorMessage)
  }
}

cli()
