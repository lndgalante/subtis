import chalk from 'chalk'
import minimist from 'minimist'
import { ZodIssueCode, z } from 'zod'
import { intro, outro, spinner } from '@clack/prompts'


// shared
import { videoFileNameSchema } from 'shared/movie'
import { getMessageFromStatusCode } from 'shared/error-messages'

// cli
import { apiClient } from '@subtis/cli'

// schemas
const cliArgumentsSchema = z.union([
  z.object({
    f: z.string().min(1, {
      message: '🤔 El valor de -f debe ser una ruta de archivo válida.',
    }),
  }),
  z.object({
    file: z.string().min(1, {
      message: '🤔 El valor de --file debe ser una ruta de archivo válida.',
    }),
  }),
], {
  errorMap: (_, context) => {
    if (context.defaultError === 'Invalid input') {
      return { message: '🤔 Debe proporcionar o bien --file [archivo] o bien -f [archivo].' }
    }

    return { message: context.defaultError }
  },
})

// core
export async function runCli(): Promise<void> {
  const loader = spinner()

  try {
    intro(`👋 Hola, soy ${chalk.magenta('Subtis')}`)

    const args = Object.fromEntries(
      Object.entries(
        minimist(Bun.argv, { string: ['f', 'file'] }),
      ).filter(([key]) => key !== '_'),
    )
    const cliArgumentsResult = cliArgumentsSchema.safeParse(args)
    if (!cliArgumentsResult.success) {
      return outro(chalk.yellow(cliArgumentsResult.error.errors[0].message))
    }
    const cliArguments = cliArgumentsResult.data

    const fileNameResult = videoFileNameSchema.safeParse(
      'file' in cliArguments
        ? cliArguments.file
        : cliArguments.f,
    )
    if (!fileNameResult.success) {
        return outro(chalk.yellow('🤔 Extensión de video no soportada. Prueba con otro archivo'))
    }
    const fileName = fileNameResult.data

    loader.start('🔎 Buscando subtitulos')

    const { data, status } = await apiClient.v1.subtitle.post({ fileName })
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
