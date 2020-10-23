
export interface Artist {
  followers: number,
  genres: string[],
  id: string,
  image: string | URL,
  name: string,
  popularity: number,
  type: string,
  uri: string,
}