import { Track } from './Track'

export interface PlaylistTrackBase {
  uuid?: string
  isCustom?: boolean
  sourceID?: string
}

export interface PlaylistTrack extends PlaylistTrackBase, Track {
  track: Track
}
