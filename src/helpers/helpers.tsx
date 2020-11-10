import { parsePlaylistJSON, parseUserJSON } from './parsers'
import { Playlist, Track, PlaylistTrack, PlaylistTrackGroup, User, PlaylistTrackBase } from '../types'
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

abstract class TrackExtensible implements Track {
  abstract track: Track

  get id() {
    return this.track.id
  }
  get name() {
    return this.track.name
  }
  get popularity () {
    return this.track.popularity
  }
  get track_number () {
    return this.track.track_number
  }
  get uri () {
    return this.track.uri
  }
  get preview_url () {
    return this.track.preview_url
  }
  get type () {
    return this.track.type
  }
  get album () {
    return this.track.album
  }
  get features () {
    return this.track.features
  }
  get genres () {
    return this.track.genres
  }
  get explicit () {
    return this.track.explicit
  }
  get duration_ms () {
    return this.track.duration_ms
  }
  get artists () {
    return this.track.artists
  }

  async expand () {
    return this
  }
}

class _PlaylistTrack extends TrackExtensible implements PlaylistTrack {
  track: Track
  constructor(track: Track, apply: PlaylistTrackBase ) {
      super()
      this.track = track
      Object.assign(this, apply)
  }
}

class _PlaylistTrackGroup extends TrackExtensible implements PlaylistTrackGroup {
  tracks: PlaylistTrack[]

  constructor (...tracks: PlaylistTrack[]) {
    super()
    if (tracks.length > 0) {
      throw new Error('Empty track group')
    }
    this.tracks = tracks
  }

  get track() {
    return this.tracks[0]
  }
  get id () {
    return 'group'
  }
  get name () {
    return 'GROUP'
  }
}

export function touchTrack(track: Track, apply: PlaylistTrackBase): Track {
  if ((track as PlaylistTrack).track) {
    return Object.assign(track, apply)
  }
  return new _PlaylistTrack(track, apply)
}

export function createTrackGroup(...tracks: PlaylistTrack[]) {
  return new _PlaylistTrackGroup(...tracks)
}


export function isTrackCustom(track: Track) {
  return !!(track as PlaylistTrack).isCustom

}