import { afterAll, beforeEach, describe, expect, it, spyOn } from 'bun:test'

// internals
import { runApi } from '../app'
import { cache } from './subtitle'

// constants
const app = runApi()
const cacheGetSpy = spyOn(cache, 'get')
const cacheSetSpy = spyOn(cache, 'set')

describe('API | /subtitle', () => {
  afterAll(() => app.stop())

  beforeEach(() => {
    cache.clear()
    cacheGetSpy.mockClear()
    cacheSetSpy.mockClear()
  })

  it('return a response for an existant subtitle', async () => {
    const fileName = 'Rebel.Moon.Part.One.A.Child.of.Fire.2023.1080p.NF.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv'

    const request = new Request(`${Bun.env.PUBLIC_API_BASE_URL_DEVELOPMENT}/v1/subtitle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName }),
    })

    const response = await app.handle(request)
    const data = await response.json()

    expect(cacheGetSpy).toHaveBeenCalled()
    expect(cacheSetSpy).toHaveBeenCalled()
    expect(cache.size).toBe(1)
    expect(data).toEqual({
      id: 1374,
      subtitleShortLink: 'https://tinyurl.com/yp8eg3mp',
      subtitleFullLink: 'https://yelhsmnvfyyjuamxbobs.supabase.co/storage/v1/object/public/subtitles/rebel-moon-part-one-a-child-of-fire-1080p-galaxyrg-subdivx.srt?download=Rebel.Moon.Part.One.A.Child.of.Fire.2023.1080p.NF.WEBRip.1600MB.DD5.1.x264-GalaxyRG.srt',
      resolution: '1080p',
      fileName: 'Rebel.Moon.Part.One.A.Child.of.Fire.2023.1080p.NF.WEBRip.1600MB.DD5.1.x264-GalaxyRG.mkv',
      Movies: {
        name: 'Rebel Moon - Part One: A Child of Fire',
        year: 2023,
      },
      ReleaseGroups: {
        name: 'GalaxyRG',
      },
      SubtitleGroups: {
        name: 'SubDivX',
      },
    })
  })

  it('return a response for an 415 error for non supported file extensions', async () => {
    const request = new Request(`${Bun.env.PUBLIC_API_BASE_URL_DEVELOPMENT}/v1/subtitle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'The.Equalizer.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp3' }),
    })

    const response = await app.handle(request)
    const data = await response.json()

    expect(cacheGetSpy).not.toHaveBeenCalled()
    expect(cacheSetSpy).not.toHaveBeenCalled()

    expect(response.status).toBe(415)
    expect(data).toEqual({
      message: 'File extension not supported',
    })
  })

  it('return a response for an 404 error for a non existant subtitle', async () => {
    const request = new Request(`${Bun.env.PUBLIC_API_BASE_URL_DEVELOPMENT}/v1/subtitle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'The.Matrix.3.2023.1080p.WEBRip.x264.AAC5.1-[YTS.MX].mp4' }),
    })

    const response = await app.handle(request)
    const data = await response.json()

    expect(cacheGetSpy).toHaveBeenCalled()

    expect(response.status).toBe(404)
    expect(data).toEqual({
      message: 'Subtitle not found for file',
    })
  })

  it('return a response for an 400 error for a bad payload', async () => {
    const request = new Request(`${Bun.env.PUBLIC_API_BASE_URL_DEVELOPMENT}/v1/subtitle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: 'the' }),
    })

    const response = await app.handle(request)
    const data = await response.json()

    expect(cacheGetSpy).not.toHaveBeenCalled()
    expect(cacheSetSpy).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(data).toMatchObject({
      type: 'body',
      at: 'fileName',
      message: 'Required property',
      expected: {
        fileName: '',
      },
    })
  })
})