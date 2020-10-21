import Auth from "../auth"

import { parsePlaylistJSON, parseUserJSON, parseAlbumJSON, parseTrackJSON, parseFeaturesJSON, parseArtistJSON } from './parsers'

import { Playlist, Track, User } from '../types'
import { Album } from '../types/Album'
import { Features } from '../types/Features'
import { Artist } from '../types/Artist'

let { api } = Auth;

// Get all playlists (performs page flattening)
export async function getPlaylists (): Promise<Array<Playlist>> {
  let resp = []
  let offset = 0
  let total
  do {
    let page = await api.getUserPlaylists(undefined, { limit: 50, offset })
    total = page.total
    resp.push(...page.items)
    offset += page.items.length
  } while (offset < total)

  return resp.map(parsePlaylistJSON)
}

async function getAlbums(ids: string[], ans: Album[]): Promise<Album[]> {
  if (!ids.length) return ans;
  const albums = await api.getAlbums(ids.splice(0, 20)); // There is a limit of 20 per call
  return (await getAlbums(ids, ans)).concat(albums.albums.map((a: any) => parseAlbumJSON(a)));
}

async function getArtists(ids: string[], ans: Artist[]): Promise<Artist[]> {
  if (!ids.length) return ans;
  const artists = await api.getArtists(ids.splice(0, 50)); // There is a limit of 50 per call
  return (await getArtists(ids, ans)).concat(artists.artists.map((a: any) => parseArtistJSON(a)));
}

const unique = (value: any, index: any, self: string | any[]) => self.indexOf(value) === index;

export async function getPlaylist(playlistId: string = "1qLoOFlMBRMBTeSnQ5guuc"): Promise<Playlist> {
  let playlist = await api.getPlaylist(playlistId) as any;

  // TODO: handle paging

  const album_ids: string[] = playlist.tracks.items.map((t: any) => t.track.album.id);
  const track_ids: string[] = playlist.tracks.items.map((t: any) => t.track.id);
  const artist_ids: string[] = playlist.tracks.items.map((t: any) => t.track.artists.map((a: any) => a.id)).flat().filter(unique);
  const albums = await getAlbums(album_ids, []);
  const features = (await api.getAudioFeaturesForTracks(track_ids)).audio_features.map(parseFeaturesJSON);
  const artists = await getArtists(artist_ids, []);

  playlist.tracks = await Promise.all(playlist.tracks.items.map(async (t: any) => {
    t.track.album = albums.find((a: Album) => a.id === t.track.album.id);
    t.track.features = features.find((f: Features) => f.id === t.track.id);
    t.track.artists = t.track.artists.map((a: any) => artists.find((b: Artist) => a.id === b.id));
    return await parseTrackJSON(t.track);
  }));

  await console.log("Retrieved Playlist:", playlist)
  return await parsePlaylistJSON(playlist);
}

export async function getUserProfile(): Promise<User> {
  return await api.getMe().then(parseUserJSON)
}

export function allGenresFromPlaylist(playlist: Playlist): string[] {
  return playlist.tracks.map((track: Track) =>
    track.artists.map((artist: Artist) => artist.genres)
  ).flat().flat().filter(unique).sort();
}
