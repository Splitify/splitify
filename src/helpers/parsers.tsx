import { Album, Artist, Features, User, Playlist, Track } from '../types'

import { api } from '../auth'
import Accumulumatorinator from './Accumulumatorinator'
import { getPaginationRawGen } from './helpers'

const FeatureAccumulator = new Accumulumatorinator<
  SpotifyApi.AudioFeaturesResponse
>(
  100,
  async ids => (await api.getAudioFeaturesForTracks(ids))['audio_features']
)
const AlbumAccumulator = new Accumulumatorinator<SpotifyApi.AlbumObjectFull>(
  20,
  async ids => (await api.getAlbums(ids))['albums']
)
const ArtistAccumulator = new Accumulumatorinator<SpotifyApi.ArtistObjectFull>(
  50,
  async ids => (await api.getArtists(ids))['artists']
)

export async function parseTrackJSON (
  json: SpotifyApi.TrackObjectFull,
  expand?: boolean
): Promise<Track> {
  let track: Track = {
    features: undefined,
    album: undefined,
    artists: [],
    duration_ms: json.duration_ms,
    explicit: json.explicit,
    id: json.id,
    // is_local: json.is_local,
    name: json.name,
    popularity: json.popularity,
    preview_url: json.preview_url,
    track_number: json.track_number,
    type: json.type,
    uri: json.uri,
    expand: async function () : Promise<Track> {
      let promise = new Promise<Track>(async (resolve,reject) => {
        this.expand = async () => promise
  
        this.features = parseFeaturesJSON(
          await FeatureAccumulator.request(this.id)
        )
  
        this.artists = await Promise.all(
          json.artists.map(async ({ id }) =>
            parseArtistJSON(await ArtistAccumulator.request(id))
          )
        )
  
        this.album = await parseAlbumJSON(
          await AlbumAccumulator.request(json.album.id)
        )
  
        resolve(this)
      })

      return promise;

    }
  }
  return expand ? await track.expand() : track
}

export function parseFeaturesJSON (
  json: SpotifyApi.AudioFeaturesResponse
): Features {
  return {
    acousticness: json.acousticness,
    danceability: json.danceability,
    duration_ms: json.duration_ms,
    energy: json.energy,
    instrumentalness: json.instrumentalness,
    liveness: json.liveness,
    loudness: json.loudness,
    speechiness: json.speechiness,
    tempo: json.tempo,
    mode: json.mode,
    time_signature: json.time_signature,
    valence: json.valence,
    key: json.key
  }
}

export function parseArtistJSON (json: SpotifyApi.ArtistObjectFull): Artist {
  return {
    followers: json.followers.total,
    genres: json.genres,
    id: json.id,
    image: json.images && json.images.length ? json.images[0].url : '',
    name: json.name,
    popularity: json.popularity,
    type: json.type,
    uri: json.uri
  }
}

export async function parseAlbumJSON (
  json: SpotifyApi.AlbumObjectFull,
  expand?: boolean
): Promise<Album> {
  let album: Album = {
    id: json.id,
    name: json.name,
    artists: [],
    genres: json.genres,
    image: json.images && json.images.length ? json.images[0].url : '',
    release_date: new Date(json.release_date),
    total_tracks: json.tracks.total,
    popularity: json.popularity,
    uri: json.uri,
    expand: async function () {
      this.artists = await Promise.all(
        json.artists.map(async ({ id }) =>
          parseArtistJSON(await ArtistAccumulator.request(id))
        )
      )
      return this
    }
  }

  return expand ? await album.expand() : album
}

export function parseUserJSON ({ id, display_name, images }: any): User {
  return {
    id,
    display_name,
    image: images && images.length ? images[0].url : null
  }
}

export async function parsePlaylistJSON (
  json: SpotifyApi.PlaylistObjectFull,
  expand?: boolean
): Promise<Playlist> {
  let playlist: Playlist = {
    id: json.id,
    name: json.name,
    description: json.description || '',
    image: json.images.length ? json.images[0].url : '',
    owner: parseUserJSON(json.owner),
    snapshot_id: json.snapshot_id,
    uri: json.uri,
    tracks: [],
    expand: async function (expandTrack = false) : Promise<Playlist> {
      // Expand playlist to get tracks (Does not expand tracks)

      let promise = new Promise<Playlist>(async (resolve,reject) => {
        this.expand = async () => promise
  
        for await (let track of getPaginationRawGen(
          api.getPlaylistTracks,
          this.id
        )) {
          // Add parsed track, optionally request track expansion
          this.tracks.push(await parseTrackJSON(track['track'], expandTrack))
        }
        
        resolve(this)
      })

      return promise;
    }
  }

  return expand ? await playlist.expand() : playlist
}
