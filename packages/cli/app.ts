import { z } from 'zod'
import minimist from 'minimist'
import { intro, outro, spinner } from '@clack/prompts'

// shared
import { getMessageFromStatusCode } from 'shared/error-messages'
import { getFilenameFromPath, getVideoFileExtension } from 'shared/movie'

// internals
import { getZodError } from 'shared/zod'
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
    const cliParse = z.object({ file: z.string({
      invalid_type_error: '🤔 Parámetro --file no provisto. Prueba con "--file [archivo]".',
    }) }).parse(cliArguments)

    // 5. Sanitize filename
    const fileName = getFilenameFromPath(cliParse.file)

    // 6. Checks if file is a video
    const videoFileExtension = getVideoFileExtension(fileName)
    z.string({ invalid_type_error: '🤔 Extension de video no soportada. Prueba con otro archivo.' }).parse(videoFileExtension)

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
    const zodError = getZodError(nativeError)

    if (zodError) {
      return outro(zodError)
    }

    return outro(`🔴 ${nativeError.message}`)
  }
}

cli()
