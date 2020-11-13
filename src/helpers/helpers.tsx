import { parsePlaylistJSON, parseUserJSON } from './parsers'
import { Playlist, Track, PlaylistTrack, PlaylistTrackGroup, User, PlaylistTrackBase } from '../types'
import { api } from '../auth'
import { v4 as uuid } from 'uuid';

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

export async function createOrUpdatePlaylist(
  userId: string,
  playlist: Playlist,
  expand: boolean = false
) {

  if (playlist.id.substr(0, 4) === "temp") {
    console.log("Current playlist doesnt exist. Creating now...");
    // First create the new playlist
    const newPlaylist = await parsePlaylistJSON(
      await api.createPlaylist(userId, {
        name: playlist.name,
      }),
      expand
    )
    // replace the current playlists id
    playlist.id = newPlaylist.id;

    // get all track uris to add
    const trackUris = playlist.tracks.map(track => {
      return track.uri;
    })

    // add the to the playlist 100 tracks at a time
    await paginated_api_request(playlist.id, trackUris, api.addTracksToPlaylist);
  } else {
    console.log("Current playlist exists. Updating instead..");
    // get current playlist info and construct payload
    const curInfo = await getPlaylist(playlist.id)
    let payload = {
      name: playlist.name,
      public: playlist.public,
      collaborative: playlist.collaborative
    }
    // first update the basic playlist details
    await api.changePlaylistDetails(curInfo.id, payload);

    // remove all current tracks
    await api.replaceTracksInPlaylist(playlist.id, []);

    // then add the new tracks
    const trackUris = playlist.tracks.map(track => {
      return track.uri;
    })

    await paginated_api_request(playlist.id, trackUris, api.addTracksToPlaylist);
  }
}

async function paginated_api_request(playlist_id: string, track_uris: string[], api_function: (playlistId: string, uris: string[]) => any) {

  let remaining = track_uris.length;
  let start = 0;

  while (remaining > 0) {
    console.log("start: ", start, "remaining: ", remaining);
    if (remaining >= 100) {
      console.log("adding from: ", start, " to: ", start + 100);
      api_function(playlist_id, track_uris.slice(start, start + 100));
      remaining -= 100
    } else {
      console.log("adding from: ", start, " to: ", track_uris.length);
      api_function(playlist_id, track_uris.slice(start));
      remaining -= (track_uris.length - start);
    }
    start += 100;
    await timer(250);
  }
}

function timer(ms: any) { return new Promise(res => setTimeout(res, ms)); }

abstract class TrackExtensible implements Track {
  abstract track: Track
  readonly uuid: string


  constructor() {
    this.uuid = uuid()
  }

  get id() {
    return this.track.id
  }
  get name() {
    return this.track.name
  }
  get popularity() {
    return this.track.popularity
  }
  get track_number() {
    return this.track.track_number
  }
  get uri() {
    return this.track.uri
  }
  get preview_url() {
    return this.track.preview_url
  }
  get type() {
    return this.track.type
  }
  get album() {
    return this.track.album
  }
  get features() {
    return this.track.features
  }
  get genres() {
    return this.track.genres
  }
  get explicit() {
    return this.track.explicit
  }
  get duration_ms() {
    return this.track.duration_ms
  }
  get artists() {
    return this.track.artists
  }

  async expand() {
    return this.track.expand()
  }
}

class _PlaylistTrack extends TrackExtensible implements PlaylistTrack {
  track: Track
  constructor(track: Track, apply: PlaylistTrackBase) {
    super()
    this.track = track
    delete apply.uuid // Don't apply UUID
    Object.assign(this, apply)
  }

  clone(apply?: PlaylistTrackBase) {
    return new _PlaylistTrack(this.track, { ...(this as PlaylistTrackBase), ...apply })
  }

}

export class _PlaylistTrackGroup extends TrackExtensible implements PlaylistTrackGroup {
  tracks: PlaylistTrack[]

  constructor(...tracks: PlaylistTrack[]) {
    super()
    if (tracks.length === 0) {
      throw new Error('Empty track group')
    }
    this.tracks = tracks
  }
  
  set track(_) {
    return
  }
  get track() {
    return this.tracks[0]
  }
  get id() {
    return this.uuid
  }
  get name () {
    return this.tracks[0].name
  }
}

export function asPlaylistTrack(track: Track): PlaylistTrack {
  if ((track as PlaylistTrack).track) {
    return track as PlaylistTrack
  }
  return new _PlaylistTrack(track, {})
}

export function touchTrack(track: Track, apply: PlaylistTrackBase): Track {
  return Object.assign(asPlaylistTrack(track), apply)
}

export function isTrackCustom(track: Track) {
  return asPlaylistTrack(track).isCustom
}

export function createTrackGroup(...tracks: PlaylistTrack[]) {
  return new _PlaylistTrackGroup(...tracks)
}


export function createOccurrenceMap(genres: string[]) {
  let map: Record<string, number> = {};
  genres.forEach((g: string) => map[g] = isNaN(map[g]) ? 1 : map[g] + 1);
  let map2: Record<string, number> = {};
  Array.from(Object.entries(map))
    .sort((a, b) => b[1] - a[1])
    .forEach(a => map2[a[0]] = a[1]);
  return map2
}