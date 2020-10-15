import { User, Playlist } from '../types'

export function parseUserJSON ({
  id,
  display_name
}: {
  id: string
  display_name: string
}): User {
  return {
    id,
    display_name
  }
}

export function parsePlaylistJSON ({
  id,
  name,
  description,
  images,
  owner,
  snapshot_id,
  uri,
  tracks
}: any): Playlist {
  return {
    id,
    name,
    description: description || '',
    image: images.length ? images[0].url : '',
    owner: parseUserJSON(owner),
    snapshot_id,
    uri,
    tracks // TODO: Parse tracks
  }
}
