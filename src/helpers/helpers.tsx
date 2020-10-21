import { parsePlaylistJSON, parseUserJSON, parseAlbumJSON, parseTrackJSON, parseFeaturesJSON, parseArtistJSON } from './parsers'

import { Playlist, Track, User } from '../types'
import { Album } from '../types/Album'
import { Features } from '../types/Features'
import { Artist } from '../types/Artist'

import { api } from "../auth"

// Get all playlists (performs page flattening)
export async function getPlaylists (): Promise<Array<Playlist>> {
  let res = [];
  for await (let playlistJSON of getPlaylistsRawGen()) {
    res.push(parsePlaylistJSON(playlistJSON))
  }
  return res
}

export async function* getPlaylistsGen () {
  for await (let playlistJSON of getPlaylistsRawGen()) {
    yield parsePlaylistJSON(playlistJSON)
  }
}

async function* getPlaylistsRawGen() {
  let offset = 0
  let total
  do {
    let page = await api.getUserPlaylists(undefined, { limit: 50, offset })
    total = page.total
    yield *page.items
    offset += page.items.length
  } while (offset < total)
}

export async function getPlaylist (
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

export function allGenresFromPlaylist (playlist: Playlist): string[] {
  return Array.from(
    new Set(
      playlist.tracks
        .map((track: Track) =>
          track.artists.map((artist: Artist) => artist.genres)
        )
        .flat()
        .flat()
    )
  ).sort()
}
