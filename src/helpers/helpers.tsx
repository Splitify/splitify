import { Playlist, User } from '../types'
import { parsePlaylistJSON, parseUserJSON } from './parsers'

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
  return await api.getPlaylist('4vHIKV7j4QcZwgzGQcZg1x').then(parsePlaylistJSON)
}

export async function getUserProfile (
  api: SpotifyAPI.SpotifyWebApiJs
): Promise<User> {
  return await api.getMe().then(parseUserJSON)
}
