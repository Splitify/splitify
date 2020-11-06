import { parsePlaylistJSON, parseUserJSON } from './parsers'
import { Playlist, Track, PlaylistTrackGroup, User } from '../types'
import { api } from '../auth'

// Get all playlists
export async function getPlaylists(
  user?: string,
  expand: boolean = false
): Promise<Array<Playlist>> {
  let res = []
  for await (let playlistJSON of getPaginationRawGen(
    api.getUserPlaylists,
    user
  )) {
    res.push(await parsePlaylistJSON(playlistJSON, expand))
  }
  return res
}

export async function* getPlaylistsGen(
  user?: string,
  expand: boolean = false
) {
  for await (let playlistJSON of getPaginationRawGen(
    api.getUserPlaylists,
    user
  )) {
    yield parsePlaylistJSON(playlistJSON, expand)
  }
}

export async function getPaginationRaw(func: Function, ...args: any) {
  let resp = []
  for await (let obj of getPaginationRawGen(func, ...args)) {
    resp.push(obj)
  }
  return resp
}

export async function* getPaginationRawGen(
  func: Function,
  opts?: {},
  ...args: any
) {
  let offset = 0
  let total
  do {
    let page = await func(...args, { ...opts, /* limit: 50,*/ offset })
    total = page.total
    yield* page.items
    offset += page.items.length
  } while (offset < total)
}

export async function getPlaylist(
  playlistId: string,
  expand: boolean = false
): Promise<Playlist> {
  return parsePlaylistJSON(
    await api.getPlaylist(playlistId, {
      fields: '(!tracks)'
    }),
    expand
  )
}

export async function getUserProfile(): Promise<User> {
  return await api.getMe().then(parseUserJSON)
}

export function allGenresFromPlaylist(playlist: Playlist): string[] {
  return Array.from(
    new Set(
      playlist.tracks
        .map((track: Track) => track.genres).flat()
    )
  ).sort()
}

class _PlaylistTrackGroup implements PlaylistTrackGroup {
  tracks: Track[]

  constructor (...tracks: Track[]) {
    if (tracks.length > 0) {
      throw new Error('Empty track group')
    }
    this.tracks = tracks
  }

  get id () {
    return 'group'
  }
  get name () {
    return 'GROUP'
  }
  get popularity () {
    return this.tracks[0].popularity
  }
  get track_number () {
    return this.tracks[0].track_number
  }
  get uri () {
    return this.tracks[0].uri
  }
  get preview_url () {
    return this.tracks[0].preview_url
  }
  get type () {
    return this.tracks[0].type
  }
  get album () {
    return this.tracks[0].album
  }
  get features () {
    return this.tracks[0].features
  }
  get genres () {
    return this.tracks[0].genres
  }
  get explicit () {
    return this.tracks[0].explicit
  }
  get duration_ms () {
    return this.tracks[0].duration_ms
  }
  get artists () {
    return this.tracks[0].artists
  }

  async expand () {
    return this
  }
}

export function createTrackGroup(...tracks: Track[]) {
  return new _PlaylistTrackGroup(...tracks)
}
