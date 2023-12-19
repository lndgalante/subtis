<<<<<<< HEAD
import { beforeAll, describe, expect, it } from 'bun:test'
=======
import { describe, expect, it } from 'bun:test'
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)

// shared
import { getMessageFromStatusCode } from 'shared/error-messages'

<<<<<<< HEAD
describe('CLI | TypeScript', async () => {
  it('returns a message with a subtitle link with --file parameter', async () => {
    const process = Bun.spawn([
      'bun',
      'run.ts',
=======
describe('CLI', async () => {
  it('returns a message with a subtitle link with --file parameter', async () => {
    const process = Bun.spawn([
      'bun',
      'app.ts',
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
      '--file',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
    expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
  })

  it('returns a message with a subtitle link with -f parameter', async () => {
    const process = Bun.spawn([
      'bun',
<<<<<<< HEAD
      'run.ts',
=======
      'app.ts',
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
      '-f',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
    expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
  })

  it('returns a message when none parameters is given', async () => {
<<<<<<< HEAD
    const process = Bun.spawn(['bun', 'run.ts'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 Debe proporcionar --file [archivo] o bien -f [archivo]')
  })

  it('returns a message when -f parameter is given without a file path', async () => {
    const process = Bun.spawn(['bun', 'run.ts', '-f'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de -f debe ser una ruta de archivo válida')
  })

  it('returns a message when --file parameter is given without a file path', async () => {
    const process = Bun.spawn(['bun', 'run.ts', '--file'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de --file debe ser una ruta de archivo válida')
=======
    const process = Bun.spawn(['bun', 'app.ts'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 Debe proporcionar o bien --file [archivo] o bien -f [archivo].')
  })

  it('returns a message when -f parameter is given without a file path', async () => {
    const process = Bun.spawn(['bun', 'app.ts', '-f'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de -f debe ser una ruta de archivo válida.')
  })

  it('returns a message when --file parameter is given without a file path', async () => {
    const process = Bun.spawn(['bun', 'app.ts', '--file'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de --file debe ser una ruta de archivo válida.')
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
  })

  it('returns a message when extension is not supported', async () => {
    const process = Bun.spawn([
      'bun',
<<<<<<< HEAD
      'run.ts',
=======
      'app.ts',
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
      '--file',
      'Trolls.Band.Together.2023.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
<<<<<<< HEAD
    expect(text).toInclude('🤔 Extensión de video no soportada. Prueba con otro archivo')
  })

  it('returns a message when subtitle is not found', async () => {
    const process = Bun.spawn(['bun', 'run.ts', '--file', 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4'])
=======
    expect(text).toInclude('🤔 Extensión de video no soportada. Prueba con otro archivo.')
  })

  it('returns a message when subtitle is not found', async () => {
    const process = Bun.spawn(['bun', 'app.ts', '--file', 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4'])
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
    const text = await new Response(process.stdout).text()
    const { title, description } = getMessageFromStatusCode(404)

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🔎 Buscando subtitulos')
    expect(text).toInclude(`😥 ${title}`)
    expect(text).toInclude(`⛏ ${description}`)
  })
})
<<<<<<< HEAD

describe('CLI | Binary', async () => {
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
    const process = Bun.spawn([
      './bin/subtis',
      '--file',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
    expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
  })

  it('returns a message with a subtitle link with -f parameter', async () => {
    const process = Bun.spawn([
      './bin/subtis',
      '-f',
      'Killers.Of.The.Flower.Moon.2023.1080p.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🥳 Descarga tu subtítulo en https://tinyurl.com/yuo4llr2')
    expect(text).toInclude('🍿 Disfruta de Killers of the Flower Moon (2023) en 1080p subtitulada')
  })

  it('returns a message when none parameters is given', async () => {
    const process = Bun.spawn(['./bin/subtis'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 Debe proporcionar --file [archivo] o bien -f [archivo]')
  })

  it('returns a message when -f parameter is given without a file path', async () => {
    const process = Bun.spawn(['./bin/subtis', '-f'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de -f debe ser una ruta de archivo válida')
  })

  it('returns a message when --file parameter is given without a file path', async () => {
    const process = Bun.spawn(['./bin/subtis', '--file'])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 El valor de --file debe ser una ruta de archivo válida')
  })

  it('returns a message when extension is not supported', async () => {
    const process = Bun.spawn([
      './bin/subtis',
      '--file',
      'Trolls.Band.Together.2023.1080p.AMZN.WEBRip.1400MB.DD5.1.x264-GalaxyRG.mp3',
    ])
    const text = await new Response(process.stdout).text()

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude('🤔 Extensión de video no soportada. Prueba con otro archivo')
  })

  it('returns a message when subtitle is not found', async () => {
    const process = Bun.spawn(['./bin/subtis', '--file', 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4'])
    const text = await new Response(process.stdout).text()
    const { title, description } = getMessageFromStatusCode(404)

    expect(text).toInclude('👋 Hola, soy Subtis')
    expect(text).toInclude(`😥 ${title}`)
    expect(text).toInclude(`⛏ ${description}`)
  })
})
=======
>>>>>>> eb9a8b2 (feat(api): rework core file + expose explicit run file to run module)
