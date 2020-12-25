import { Artist } from './Artist'

export interface Album {
  id: string
  name: string
  artists: Array<Artist>
  genres: Array<string>
  image: string | URL
  release_date: Date
  total_tracks: number
  popularity: number
  uri: string
  expand: () => Promise<this>
}
