import { Album, Artist, Features, User, Playlist, Track } from '../types'

import { api } from '../auth'
import { CachingAccumulumatorinator } from './Accumulumatorinator'
import { getPaginationRawGen } from './helpers'

import Queue from 'queue'
import { WHITELIST as GENRE_WHITELIST } from './genreWhitelist'



const ToURLParam = (track: string, artist: string) => {
  let params = new URLSearchParams();
  params.append("artist", artist);
  params.append("track", track);
  params.append("api_key", "f21088bf9097b49ad4e7f487abab981e");
  params.append("format", "json");
  params.append("method", "track.gettoptags");
  return params.toString();
}

async function fetchLFM(
  request: RequestInfo
): Promise<any> {
  const response = await fetch(request);
  const res = await response.json();
  return res;
}

const GenreAccumulator = new CachingAccumulumatorinator<
  any
>('genres', 1, async id => ([await fetchLFM("https://ws.audioscrobbler.com/2.0/?" + id)]))
const TrackAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.TrackObjectFull
>('tracks', 50, async ids => (await api.getTracks(ids))['tracks'])
const FeatureAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.AudioFeaturesResponse
>(
  'features',
  100,
  async ids => (await api.getAudioFeaturesForTracks(ids))['audio_features']
)
const AlbumAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.AlbumObjectFull
>('albums', 20, async ids => (await api.getAlbums(ids))['albums'])
const ArtistAccumulator = new CachingAccumulumatorinator<
  SpotifyApi.ArtistObjectFull
>('artists', 50, async ids => (await api.getArtists(ids))['artists'])

export async function parseTrackJSON(
  json: SpotifyApi.TrackObjectFull,
  expand?: boolean
): Promise<Track> {
  let track: Track = {
    features: undefined,
    album: undefined,
    genres: [],
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
    expand: async function (): Promise<Track> {
      let promise = new Promise<Track>(async (resolve, reject) => {
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

        this.genres = await parseGenres(
          await GenreAccumulator.requestCustom(this.id, ToURLParam(json.name, json.artists[0].name), true),
          this.artists,
          this.album,
        )
        resolve(this)
      })

      return promise
    }
  }
  return expand ? await track.expand() : track
}

export function parseGenres(
  lm: any,
  artists: Artist[],
  album?: Album,
) {
  const artistNames = artists.map((a: Artist) => a.name.toLowerCase());
  let genres = lm.toptags?.tag
    .filter((t: any) => t.count > 50 && t.name.length < 20)
    .map((t: any) => t.name.toLowerCase())
    .filter((s: string) => {
      return s.split(" ").some((g: string) => GENRE_WHITELIST.includes(g))
        || s.split("-").some((g: string) => GENRE_WHITELIST.includes(g))
    }) ?? [];
  genres.splice(3, 99); // Only keep the first three. The quality goes down quick on some songs
  genres = genres.filter((g: string) => !artistNames.includes(g));

  if (genres.length === 0) {
    genres = album?.genres ?? [];
  }

  if (genres.length === 0) {
    genres = artists.map((a: Artist) => a.genres).flat();
  }

  // convert the date into a decade
  // e.g. 2011 -> 2010s and 1963 -> 1960s
  const year = Math.floor((album?.release_date.getFullYear() ?? 0) / 10) * 10
  if (year > 1920) {
    genres.push(`${year}s`);
  }
  return genres;
}

export function parseFeaturesJSON(
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

export function parseArtistJSON(json: SpotifyApi.ArtistObjectFull): Artist {
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

export async function parseAlbumJSON(
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

export function parseUserJSON({ id, display_name, images }: any): User {
  return {
    id,
    display_name,
    image: images && images.length ? images[0].url : null
  }
}

export async function parsePlaylistJSON(
  json: SpotifyApi.PlaylistObjectFull,
  expand?: boolean,
  expandTrack?: boolean
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
    expand: async function (expandTrack = false): Promise<Playlist> {
      // Expand playlist to get tracks (Does not expand tracks)

      let promise = new Promise<Playlist>(async (resolve, reject) => {
        this.expand = async () => promise

        const Q = Queue({ autostart: true, concurrency: 1, timeout: 10 * 1000 })

        // TODO: What if it's a local track?

        for await (let trackJSONBare of getPaginationRawGen(
          api.getPlaylistTracks,
          { fields: 'items.track.id,total' },
          this.id
        )) {
          let track = TrackAccumulator.request(
            trackJSONBare['track']['id']
          ).then(async (data: SpotifyApi.TrackObjectFull) =>
            // Add parsed track, optionally request track expansion
            parseTrackJSON(await data, expandTrack)
          )

          Q.push(async cb => {
            this.tracks.push(await track)
            cb && cb()
          })
        }

        Q.push(cb => {
          resolve(this)
          cb && cb()
        })
      })

      return promise
    }
  }

  return expand ? await playlist.expand(expandTrack) : playlist
}
