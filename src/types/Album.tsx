
export interface Album {
  id: string
  name: string
  label: string
  artists: Array<any> // TODO more specific type
  genres: Array<string>
  image: string | URL
  release_date: Date
  total_tracks: number
  popularity: number
  uri: string
}