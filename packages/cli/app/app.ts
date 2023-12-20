import { z } from 'zod'
import chalk from 'chalk'
import minimist from 'minimist'
import { intro, outro, spinner } from '@clack/prompts'

// shared
import { videoFileNameSchema } from 'shared/movie'
import { getMessageFromStatusCode } from 'shared/error-messages'

// cli
import { apiClient } from '@subtis/cli'

// schemas
const cliArgumentsSchema = z.union([
  z.object({
    f: z.string({
      invalid_type_error: '🤔 El valor de -f debe ser una ruta de archivo válida.',
    }),
  }),
  z.object({
    file: z.string({
      invalid_type_error: '🤔 El valor de --file debe ser una ruta de archivo válida.',
    }),
  }),
], {
  errorMap: (issue, context) => {
    if (issue.code === 'invalid_union') {
      return { message: '🤔 Debe proporcionar o bien --file [archivo] o bien -f [archivo].' }
    }

    return { message: context.defaultError }
  },
})

// core
export async function runCli(): Promise<void> {
  try {
    intro(`👋 Hola, soy ${chalk.magenta('Subtis')}`)

    const cliArgumentsResult = cliArgumentsSchema.safeParse(minimist(Bun.argv))
    if (!cliArgumentsResult.success) {
      return outro(chalk.yellow(cliArgumentsResult.error.message))
    }

    const fileNameResult = videoFileNameSchema.safeParse(
      'file' in cliArgumentsResult.data
        ? cliArgumentsResult.data.file
        : cliArgumentsResult.data.f,
    )
    if (!fileNameResult.success) {
      return outro(chalk.yellow('🤔 Extensión de video no soportada. Prueba con otro archivo.'))
    }

    const loader = spinner()
    loader.start('🔎 Buscando subtitulos')

    const { data, status } = await apiClient.v1.subtitle.post({ fileName: fileNameResult.data })
    if (data === null || 'message' in data) {
      const { title, description } = getMessageFromStatusCode(status)
      loader.stop(`😥 ${title}`)
      return outro(`⛏ ${description}`)
    }

    loader.stop(`🥳 Descarga tu subtítulo en ${chalk.blue(data.subtitleShortLink)}`)

    const { Movies: { name, year }, resolution } = data
    outro(`🍿 Disfruta de ${chalk.bold(`${name} (${year})`)} en ${chalk.italic(resolution)} subtitulada`)
  }
  catch (error) {
    if (error instanceof Error) {
      outro(chalk.red(`🔴 ${error.message}`))
    }
  }
  finally {
    process.exit()
  }
}
