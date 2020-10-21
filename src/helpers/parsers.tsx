import { User, Playlist, Track } from '../types'
import { Album } from '../types/Album'
import { Artist } from '../types/Artist'
import { Features } from '../types/Features'

export function parseTrackJSON({
  album,
  artists,
  duration_ms,
  explicit,
  features,
  id,
  is_local,
  name,
  popularity,
  preview_url,
  track_number,
  type,
  uri,
}: any): Track {
  return {
    album,
    artists,
    duration_ms,
    explicit,
    features,
    id,
    is_local,
    name,
    popularity,
    preview_url,
    track_number,
    type,
    uri
  }
}

export function parseFeaturesJSON({
  id,
  acousticness,
  danceability,
  duration_ms,
  energy,
  instrumentalness,
  liveness,
  loudness,
  speechiness,
  tempo,
  mode,
  time_signature,
  valence,
  key,
  uri,
}: any): Features {
  return {
    id,
    acousticness,
    danceability,
    duration_ms,
    energy,
    instrumentalness,
    liveness,
    loudness,
    speechiness,
    tempo,
    mode,
    time_signature,
    valence,
    key,
    uri,
  }
}

export function parseArtistJSON({
  followers,
  genres,
  id,
  images,
  name,
  popularity,
  type,
  uri,
}: any): Artist {
  return {
    followers,
    genres,
    id,
    images,
    name,
    popularity,
    type,
    uri,
  }
}

export function parseAlbumJSON({
  id,
  name,
  label,
  artists,
  genres,
  image,
  release_date,
  total_tracks,
  popularity,
  uri,
}: any): Album {
  return {
    id,
    name,
    label,
    artists,
    genres,
    image,
    release_date,
    total_tracks,
    popularity,
    uri
  }
}

export function parseUserJSON({ id, display_name, images }: any): User {
  return {
    id,
    display_name,
    image: images && images.length ? images[0].url : null
  }
}

export function parsePlaylistJSON({
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
    tracks: [] // TODO: Parse tracks
  }
}
