import { Track } from './Track'

export interface PlaylistTrackBase {
  uuid?: string
  isCustom?: boolean
  sourceID?: string
  sourceName?: () => string | undefined
  included_genres?: string[]
}

export interface PlaylistTrack extends PlaylistTrackBase, Track {
  track: Track
  clone?(apply?: PlaylistTrackBase): PlaylistTrack
}
