import { parsePlaylistJSON, parseUserJSON } from './parsers'
import { Artist, Playlist, Track, User } from '../types'
import { api } from '../auth'

// Get all playlists
export async function getPlaylists (
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

export async function * getPlaylistsGen (
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

export async function getPaginationRaw (func: Function, ...args: any) {
  let resp = []
  for await (let obj of getPaginationRawGen(func, ...args)) {
    resp.push(obj)
  }
  return resp
}

export async function * getPaginationRawGen (
  func: Function,
  opts?: {},
  ...args: any
) {
  let offset = 0
  let total
  do {
    let page = await func(...args, { ...opts, /* limit: 50,*/ offset })
    total = page.total
    yield * page.items
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

export async function getUserProfile (): Promise<User> {
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

export async function createPlaylist(
  userId: string,
  playlist: Playlist,
  expand: boolean = false
): Promise<Playlist> {

  console.log(playlist.id.substr(0, 4))

  if(playlist.id.substr(0, 4) === "temp"){
    console.log("Current playlist doesnt exist. Creating now...");
    return parsePlaylistJSON(
      await api.createPlaylist(userId, {
        name: playlist.name,
      }),
      expand
    )
  }else{
    console.log("Current playlist exists. Updating instead..");
    const curInfo = await getPlaylist(playlist.id)
    let payload = {
      name: playlist.name,
      public: playlist.public,
      collaborative: playlist.collaborative
    }
    const resp = await api.changePlaylistDetails(curInfo.id, payload);
    console.log(resp);
    return parsePlaylistJSON(
      await api.createPlaylist(userId, {
        name: playlist.name,
      }),
      expand
    )
  }
} 
