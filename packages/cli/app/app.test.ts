import { beforeAll, describe, expect, it } from 'bun:test'

// shared
import { getMessageFromStatusCode } from 'shared/error-messages'

describe('CLI', async () => {
  beforeAll(() => {
    Bun.spawn([
      'bun',
      'build',
      'run.ts',
      '--compile',
      '--outfile',
      'bin/subtis',
    ])
  })

  it('returns a message with a subtitle link with --file parameter', async () => {
    const developmentProcess = Bun.spawn([
      'bun',
      'run.ts',
      '--file',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const binaryProcess = Bun.spawn([
      './bin/subtis',
      '--file',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()

      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
      expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
    })
  })

  it('returns a message with a subtitle link with -f parameter', async () => {
    const developmentProcess = Bun.spawn([
      'bun',
      'run.ts',
      '-f',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const binaryProcess = Bun.spawn([
      './bin/subtis',
      '-f',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()

      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
      expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
    })
  })

  it('returns a message when none parameters is given', async () => {
    const developmentProcess = Bun.spawn(['bun', 'run.ts'])
    const binaryProcess = Bun.spawn(['./bin/subtis'])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()

      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🤔 Debe proporcionar --file [archivo] o bien -f [archivo]')
    })
  })

  it('returns a message when -f parameter is given without a file path', async () => {
    const developmentProcess = Bun.spawn(['bun', 'run.ts', '-f'])
    const binaryProcess = Bun.spawn(['./bin/subtis', '-f'])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()
      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🤔 El valor de -f debe ser una ruta de archivo válida')
    })
  })

  it('returns a message when --file parameter is given without a file path', async () => {
    const developmentProcess = Bun.spawn(['bun', 'run.ts', '--file'])
    const binaryProcess = Bun.spawn(['./bin/subtis', '--file'])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()
      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🤔 El valor de --file debe ser una ruta de archivo válida')
    })
  })

  it('returns a message when extension is not supported', async () => {
    const developmentProcess = Bun.spawn([
      'bun',
      'run.ts',
      '--file',
      'Trolls.Band.Together.2023.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3',
    ])
    const binaryProcess = Bun.spawn([
      './bin/subtis',
      '--file',
      'Trolls.Band.Together.2023.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3',
    ])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()

      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude('🤔 Extensión de video no soportada. Prueba con otro archivo')
    })
  })

  it('returns a message when subtitle is not found', async () => {
    const developmentProcess = Bun.spawn(['bun', 'run.ts', '--file', 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4'])
    const binaryProcess = Bun.spawn(['./bin/subtis', '--file', 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4'])

    const processes = [developmentProcess, binaryProcess]
    processes.forEach(async (process) => {
      const text = await new Response(process.stdout).text()

      const { title, description } = getMessageFromStatusCode(404)

      expect(text).toInclude('👋 Hola, soy Subtis')
      expect(text).toInclude(`😥 ${title}`)
      expect(text).toInclude(`⛏ ${description}`)
    })
  })
})