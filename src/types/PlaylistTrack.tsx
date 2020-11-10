import { Track } from './Track'

export interface PlaylistTrackBase {
  isCustom?: boolean
  sourceID?: string
}

export interface PlaylistTrack extends PlaylistTrackBase, Track {
  track: Track
}
