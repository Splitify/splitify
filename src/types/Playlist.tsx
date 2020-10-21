import { Track } from './Track'
import { User } from './User'

export interface Playlist {
  // collaboration: boolean;
  id: string
  name: string
  description: string
  image: string | URL
  owner: User
  snapshot_id: string
  tracks: Array<Track>
  uri: string
  expand : () => Promise<this>
}
