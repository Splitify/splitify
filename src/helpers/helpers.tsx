import { Playlist, User } from '../types'
import { parsePlaylistJSON, parseUserJSON, parseAlbumJSON, parseTrackJSON, parseFeaturesJSON, parseArtistJSON } from './parsers'

// TODO: Integrate auth branch

import SpotifyAPI from 'spotify-web-api-js'
import { Album } from '../types/Album'
import { Features } from '../types/Features'
import { Artist } from '../types/Artist'
export async function fetchTest () {
  let api = new SpotifyAPI()
  const token = '-'
  api.setAccessToken(token)

  console.log(await api.getUserPlaylists())
  getUserProfile(api)
  console.log(await getPlaylist(api))
}

async function getAlbums(api: SpotifyAPI.SpotifyWebApiJs, ids: string[], ans: Album[]): Promise<Album[]> {
  if (!ids.length) return ans; 
  const albums = await api.getAlbums(ids.splice(0, 20)); // There is a limit of 20 per call
  return (await getAlbums(api, ids, ans)).concat(await Promise.all(albums.albums.map(async(a: any) => await parseAlbumJSON(a))));
}

async function getArtists(api: SpotifyAPI.SpotifyWebApiJs, ids: string[], ans: Artist[]): Promise<Artist[]> {
  if (!ids.length) return ans; 
  const artists = await api.getArtists(ids.splice(0, 50)); // There is a limit of 20 per call
  await console.log(artists);
  return (await getArtists(api, ids, ans)).concat(await Promise.all(artists.artists.map(async(a: any) => await parseArtistJSON(a))));
}

const unique = (value: any, index: any, self: string | any[]) => self.indexOf(value) === index;

export async function getPlaylist (
  api: SpotifyAPI.SpotifyWebApiJs
): Promise<Playlist> {
  let playlist = await api.getPlaylist('1qLoOFlMBRMBTeSnQ5guuc') as any;
  
  
  // TODO: handle paging
  
  const album_ids: string[] = playlist.tracks.items.map((t: any) => t.track.album.id);
  const track_ids: string[] = playlist.tracks.items.map((t: any) => t.track.id); 
  const artist_ids: string[] = playlist.tracks.items.map((t: any) => t.track.artists.map((a: any) => a.id)).flat().filter(unique);
  const albums = await getAlbums(api, album_ids, []); 
  const features = (await api.getAudioFeaturesForTracks(track_ids)).audio_features.map(parseFeaturesJSON);
  const artists = await getArtists(api, artist_ids, []);
    
  
  playlist.tracks = await Promise.all(playlist.tracks.items.map(async (t: any) => {
    t.track.album = albums.find((a: Album) => a.id === t.track.album.id);
    t.track.features = features.find((f: Features) => f.id === t.track.id);
    t.track.artists = t.track.artists.map((a: any) => artists.find((b: any) => a.id === b.id));
    return await parseTrackJSON(t.track);
  }));
  
  await console.log(playlist)
  
  return await parsePlaylistJSON(playlist);
}

export async function getUserProfile (
  api: SpotifyAPI.SpotifyWebApiJs
): Promise<User> {
  return await api.getMe().then(parseUserJSON)
}
