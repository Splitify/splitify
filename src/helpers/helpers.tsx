import { Playlist, User } from '../types'
import { parsePlaylistJSON, parseUserJSON, parseAlbumJSON, parseTrackJSON } from './parsers'

// TODO: Integrate auth branch

import SpotifyAPI from 'spotify-web-api-js'
export async function fetchTest () {
  let api = new SpotifyAPI()
  const token = '-'
  api.setAccessToken(token)

  console.log(await api.getUserPlaylists())
  getUserProfile(api)
  console.log(await getPlaylist(api))
}

export async function getPlaylist (
  api: SpotifyAPI.SpotifyWebApiJs
): Promise<Playlist> {
  let playlist = await api.getPlaylist('4vHIKV7j4QcZwgzGQcZg1x');
  // TODO: handle paging
  await playlist.tracks.items.map(async (t: any) => {
    t.track.album = await api.getAlbum(t.track.album.id).then(parseAlbumJSON);
    t.track.features = await (await api.getAudioFeaturesForTracks(t.track.id)).audio_features[0];
  });
  await playlist.tracks.items.map((t: any) => {
    console.log(parseTrackJSON(t.track));
    return parseTrackJSON(t.track);
  });

  await console.log("tracks", playlist);

  return await parsePlaylistJSON(playlist);
}

export async function getUserProfile (
  api: SpotifyAPI.SpotifyWebApiJs
): Promise<User> {
  return await api.getMe().then(parseUserJSON)
}
